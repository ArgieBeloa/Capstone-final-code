import { StudentModel } from "@/api/students/model";
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

// ✅ IMPORT FROM local.ts (single source of truth)
import { EventAttendance } from "@/api/events/utils";
import { addStudent } from "@/api/local/local";
import { useLocalSearchParams } from "expo-router";

export default function OfficerScanner() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [permission, requestPermission] = useCameraPermissions();
  const { studentData } = useUser();

  const student: StudentModel = studentData;

  // 🔄 App foreground/background handler
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

  // 📷 Request camera permission
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

  // 📸 QR handler
  const handleQRScan = async (data: string) => {
    if (!data || qrLock.current) return;
    qrLock.current = true;

    try {
      // Validate JSON
      if (!data.trim().startsWith("{")) {
        throw new Error("QR is not JSON");
      }

      const parsedQR: EventAttendance = JSON.parse(data);

      const studentQRGenerated: EventAttendance = {
        studentId: parsedQR.studentId,
        studentNumber: parsedQR.studentNumber,
        studentName: parsedQR.studentName,
        role: parsedQR.role,
        department: parsedQR.department,
        dateScanned: parsedQR.dateScanned,
      };

      console.log("✅ QR Parsed:", studentQRGenerated);

      console.log("💾 Saving to local storage...");
      await addStudent(id as string, studentQRGenerated);

      setModalMessage(
        `Name: ${studentQRGenerated.studentName}\nDepartment: ${studentQRGenerated.studentName}`,
      );
    } catch (error: any) {
      console.error("❌ QR Scan Error:", error.message);
      setModalMessage("Invalid QR code format.");
    }

    setModalVisible(true);
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

      {/* Scanner overlay */}
      <View style={styles.overlayContainer}>
        <View style={styles.focusBox} />
      </View>

      {/* Result modal */}
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
                // router.back();
              }}
            >
              <Text style={styles.modalButtonText}>next</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                qrLock.current = false;
                router.back();
              }}
            >
              <Text style={styles.modalButtonText}>back</Text>
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
