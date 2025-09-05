import { StudentAttended } from "@/api/ApiType";
import { addStudentAttended } from "@/api/spring";
import { useUser } from "@/src/userContext";
import { useIsFocused } from "@react-navigation/native";
import { CameraView } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  AppState,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Qrscanner() {
  const qrLock = useRef(false); // lock to prevent multiple scans
  const appState = useRef(AppState.currentState);
  const isFocused = useIsFocused();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // userContext
  const { studentToken, studentData } = useUser();
  const studentId = studentData.id;
  const alreadyAttendedArray = studentData.studentEventAttended;
  // console.log(alreadyAttendedArray)
  // handle app going background/foreground
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

  // handle QR scan
  async function handleQRScan(data: string) {
    try {
      // console.log("Data from qr ", data);
      let parsedData: StudentAttended = JSON.parse(data);
      // const eventIdNow = parsedData.eventId
      //  const isAlreadyAttended = alreadyAttendedArray.find(eventIdNow)
      //  console.log("Already attended ", isAlreadyAttended)
      const date = new Date(parsedData.studentDateAttended);
      parsedData.studentDateAttended = date.toISOString().split("T")[0];

      const isAlreadyAttended = alreadyAttendedArray.find(
        (attended: StudentAttended) => attended.eventId === parsedData.eventId
      );

      if (isAlreadyAttended) {
        // console.log("Already attended:", isAlreadyAttended);
        setModalMessage(`${parsedData.eventTitle} has already been recorded!`);
        setModalVisible(true);
        return; // stop here to avoid duplication
      }

      const response = await addStudentAttended(studentId, studentToken, [
        parsedData,
      ]);

      setModalMessage(`${parsedData.eventTitle} attendance recorded!`);

      setModalVisible(true); // show modal
    } catch (err) {
      console.log("Error scanning QR:", err);
      setModalMessage("Invalid QR code.");
      setModalVisible(true);
    }
    // ⚠ Don't unlock qrLock yet, wait for modal to close
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen options={{ title: "QR Scanner", headerShown: false }} />
      {Platform.OS === "android" && <StatusBar hidden />}

      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true;
              handleQRScan(data);
            }
          }}
        />
      )}

      {/* QR Focus Rectangle */}
      <View style={styles.overlayContainer}>
        <View style={styles.focusBox} />
      </View>

      {/* Modal */}
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
                qrLock.current = false; // unlock camera
                router.back(); // navigate back
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
});
