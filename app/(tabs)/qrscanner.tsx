import { addEventAttendanceRecords } from "@/api/events/controller";
import { EventAttendance, QrGeneratorProps } from "@/api/events/utils";
import {
  addEventAttendance,
  deleteStudentNotification,
  markStudentAttended,
} from "@/api/students/controller";
import { StudentModel } from "@/api/students/model";
import { StudentEventAttended } from "@/api/students/utils";
import { useUser } from "@/src/userContext";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  AppState,
  Button,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Qrscanner() {
  const qrLock = useRef(false);
  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [alreadyAttendedArray, setAlreadyAttendedArray] = useState<
    { eventId: string }[]
  >([]);

  const [permission, requestPermission] = useCameraPermissions();

  const { studentToken, studentData, userId } = useUser();

  const studentId = studentData?.id;
  const studentName = studentData?.studentName ?? "Student";
  const student: StudentModel = studentData;
  // Handle app background/foreground
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  // Request camera permission
  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) requestPermission();
  }, [permission]);

  if (!permission) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera access is required to scan QR codes.
        </Text>
        <Button title="Allow Camera Access" onPress={requestPermission} />
      </SafeAreaView>
    );
  }

  // QR scan handler
  const handleQRScan = async (data: string) => {
    if (!data || qrLock.current) return;

    try {
      const officerQRGenerated: QrGeneratorProps = JSON.parse(data);
      console.log("📦 QR Data:", officerQRGenerated);

      // Check for duplicate attendance
      const isAlreadyInAttendedEvent = alreadyAttendedArray.some(
        (event) => event.eventId === officerQRGenerated.eventId
      );

      if (isAlreadyInAttendedEvent) {
        setModalMessage(
          `👋 Hello ${studentName}, you have already been recorded! ✅`
        );
        setModalVisible(true);
        return;
      }

      // Lock QR scanner for 4s
      qrLock.current = true;
      if (scanTimeout.current) clearTimeout(scanTimeout.current);
      scanTimeout.current = setTimeout(() => {
        qrLock.current = false;
      }, 4000);

      // Clean officer token
      const rawToken = officerQRGenerated.officerToken
        .replace(/^Bearer\s*/i, "")
        .trim();
      console.log("🎯 Sending token:", rawToken);

      // Get PH time
      const now = new Date();
      const phOffset = 8 * 60; // UTC+8 in minutes
      const phTime = new Date(now.getTime() + phOffset * 60 * 1000);

      // Format date
      const year = phTime.getUTCFullYear();
      const month = String(phTime.getUTCMonth() + 1).padStart(2, "0");
      const day = String(phTime.getUTCDate()).padStart(2, "0");

      // Format 12-hour time with am/pm
      let hours = phTime.getUTCHours();
      const minutes = String(phTime.getUTCMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const timeString = `${hours}:${minutes} ${ampm}`;

      // Combine date + time
      const dateString = `${year}-${month}-${day}T${timeString}`;

      const payloadStudentAttendance: StudentEventAttended = {
        eventId: officerQRGenerated.eventId,
        eventTitle: officerQRGenerated.eventTitle,
        studentDateAttended: dateString,
        evaluated: false,
      };

      //1. Send attendance request
      await addEventAttendance(
        rawToken, // ✅ send raw token
        userId,
        payloadStudentAttendance
      );

      const payloadEventRecordAttendance: EventAttendance = {
        studentId: student.id ?? "", // fallback to empty string if undefined
        studentNumber: student.studentNumber,
        studentName: student.studentName,
        role: student.role ?? "STUDENT",
        department: student.course,
        dateScanned: dateString,
      };

      //2. send to event attendance
      await addEventAttendanceRecords(
        rawToken,
        officerQRGenerated.eventId,
        payloadEventRecordAttendance
      );

      //3. update profile data to attended
      await markStudentAttended(
        studentToken,
        userId,
        officerQRGenerated.eventId
      );

      // delete to student notification
      await deleteStudentNotification(
        studentToken,
        userId,
        officerQRGenerated.eventId
      );

      // Update local state
      setAlreadyAttendedArray((prev) => [
        ...prev,
        { eventId: officerQRGenerated.eventId },
      ]);

      setModalMessage(
        `✅ ${officerQRGenerated.eventTitle} attendance recorded! 🎉`
      );
      setModalVisible(true);
    } catch (err: any) {
      if (err.response) {
        console.error(
          "❌ Backend error:",
          err.response.status,
          err.response.data
        );
        setModalMessage(`Error: ${err.response.data}`);
      } else if (err.request) {
        console.error("❌ No response received:", err.request);
        setModalMessage("No response from server. Try again.");
      } else {
        console.error("❌ QR scanning error:", err.message);
        setModalMessage("Invalid QR code or unauthorized access.");
      }
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen options={{ title: "QR Scanner", headerShown: false }} />

      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={({ data }) => handleQRScan(data)}
        />
      )}

      <View style={styles.overlayContainer}>
        <View style={styles.focusBox} />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                qrLock.current = false;
                router.back();
              }}
            >
              <Text style={styles.modalButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  focusBox: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
  },
});
