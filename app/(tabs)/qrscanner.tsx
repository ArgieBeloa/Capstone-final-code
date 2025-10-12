import { StudentAttended } from "@/api/ApiType";
import { addStudentToEventAttendance } from "@/api/EventService";
import {
  addStudentAttended,
  eventsDataFunction,
  studentDataFunction,
} from "@/api/spring";
import {
  updateProfileData,
  updateStudentEventEvaluated,
} from "@/api/StudentService";
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
import { EventAttendance } from "../Oop/Types";

export default function Qrscanner() {
  const qrLock = useRef(false);
  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [eventId, setEventId] = useState("no id");
  const [alreadyAttendedArray, setAlreadyAttendedArray] = useState<
    { eventId: string }[]
  >([]);

  // Camera permission
  const [permission, requestPermission] = useCameraPermissions();

  // User context
  const {
    studentToken,
    studentData,
    setStudentData,
    studentNumber,
    setEventData,
  } = useUser();
  const studentId = studentData.id;
  const studentName = studentData.studentName;

  useEffect(() => {
    // Refresh student attendance data
    const getStudent = async () => {
      const student = await studentDataFunction(
        studentData.studentNumber,
        studentToken
      );
      setAlreadyAttendedArray(student[0].studentEventAttended);
    };
    getStudent();
  }, []);

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
    try {
      if (!data) return;
      let parsedData: StudentAttended = JSON.parse(data);
      console.log("📦 QR Data:", parsedData);

      const date = new Date(parsedData.studentDateAttended);
      parsedData.studentDateAttended = date.toISOString().split("T")[0];
      setEventId(parsedData.eventId);

      const isAlreadyInAttendedEvent = alreadyAttendedArray.some(
        (event) => event.eventId === parsedData.eventId
      );

      if (isAlreadyInAttendedEvent) {
        setModalMessage(
          `👋 Hello ${studentName}, you have already been recorded! ✅`
        );
        setModalVisible(true);
      } else {
        // Prevent double scanning
        qrLock.current = true;
        if (scanTimeout.current) clearTimeout(scanTimeout.current);
        scanTimeout.current = setTimeout(() => {
          qrLock.current = false;
        }, 4000);

        // Post attendance
        await addStudentAttended(studentId, studentToken, [parsedData]);
        await updateStudentEventEvaluated(
          studentToken,
          studentId,
          eventId,
          false
        );

       

        const studentAttendancePost: EventAttendance[] = [
          {
            id: studentId,
            studentName,
            timeAttended: date.toISOString().split("T")[0]
          },
        ];
        // add student to event data attendance
        const idEvent = parsedData.eventId;
        await addStudentToEventAttendance(
          idEvent,
          studentToken,
          studentAttendancePost
        );

        await updateProfileData(
          studentToken,
          studentData.id,
          eventId,
          true,
          false
        );

        // refresh student data
        const refreshStudentData = await studentDataFunction(
          studentNumber,
          studentToken
        );
        setStudentData(refreshStudentData);

        // refresh all event

        const events = await eventsDataFunction(studentToken);
        setEventData(events);

        setModalMessage(`✅ ${parsedData.eventTitle} attendance recorded! 🎉`);
        setModalVisible(true);

        // Update local state to prevent re-scanning
        setAlreadyAttendedArray((prev) => [
          ...prev,
          { eventId: parsedData.eventId },
        ]);
      }
    } catch (err) {
      console.log("❌ Error scanning QR:", err);
      setModalMessage("Invalid QR code.");
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
          onBarcodeScanned={({ data }) => {
            if (!qrLock.current) handleQRScan(data);
          }}
        />
      )}

      <View style={styles.overlayContainer}>
        <View style={styles.focusBox} />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          qrLock.current = false;
        }}
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
