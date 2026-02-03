import { EventAttendance } from "@/api/events/utils";
import { getStudentById } from "@/api/students/controller";
import { StudentEventAttendedAndEvaluationDetails } from "@/api/students/utils";
import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const Profile = () => {
  const screenWidth = Dimensions.get("window").width;
  const ratingFontSize = Math.min(screenWidth * 0.06, 20);
  const labelFontSize = Math.min(screenWidth * 0.045, 14);
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
  const [studentDataQR, setStudentDataQR] = useState<EventAttendance>();

  const { studentData, setStudentData, studentToken, eventData, userId } =
    useUser();

  const [studentAttendedData, setStudentAttendedData] = useState<
    StudentEventAttendedAndEvaluationDetails[]
  >(studentData.studentEventAttendedAndEvaluationDetails);

  const [isLogout, setIsLogout] = useState<boolean>(false);
  const router = useRouter();

  const radius = Math.max(40, Math.min(80, screenWidth / 6));
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  const attendedCount = studentData.studentEventAttended.length;
  const totalCount = eventData.length || 0;
  const progress = (attendedCount / (totalCount || 1)) * circumference;

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

  useFocusEffect(
    useCallback(() => {
      const getStudentData = async () => {
        const student = await getStudentById(studentToken, userId);
        setStudentData(student);
        setStudentAttendedData(
          student.studentEventAttendedAndEvaluationDetails,
        );
      };
      getStudentData();
    }, []),
  );

  const handleLogout = () => {
    setIsLogout(false);
    router.push("/");
  };

  // student qr generated
  const handleStudentQR = (
    studentId: string,
    studentNumber: string,
    studentName: string,
    role: string,
    department: string,
    dateScanned: string,
  ) => {
    const qrPayload: EventAttendance = {
      studentId,
      studentNumber,
      studentName,
      role,
      department,
      dateScanned,
    };

    setStudentDataQR(qrPayload); // ✅ THIS WAS MISSING
    setModalIsVisible(true);

    console.log("✅ QR Payload:", qrPayload);
  };

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarArea}>
                <Text style={styles.avatarText}>
                  {studentData.studentName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.headerTitle}>Profile</Text>
            </View>

            {/* qr generated students data */}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableHighlight
                onPress={() =>
                  handleStudentQR(
                    studentData.id ?? "no_id",
                    studentData.studentNumber,
                    studentData.studentName,
                    "Student",
                    studentData.department,
                    dateString,
                  )
                }
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons
                    name="qr-code-scanner"
                    size={24}
                    color="black"
                  />
                  <Text style={{ textAlign: "center" }}>QR</Text>
                </View>
              </TouchableHighlight>
              {/* QR MODAL */}
              <Modal
                visible={modalIsVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setModalIsVisible(false)}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <Text
                      style={{
                        marginBottom: 20,
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      Student QR
                    </Text>
                    <QRCode
                      value={JSON.stringify(studentDataQR)}
                      size={200}
                      backgroundColor="white"
                      color="black"
                    />
                    <Pressable
                      style={styles.closeButton}
                      onPress={() => setModalIsVisible(false)}
                    >
                      <Text>Close</Text>
                    </Pressable>
                  </View>
                </View>
              </Modal>

              {/* 🔘 Logout icon */}
              <TouchableHighlight
                onPress={() => setIsLogout(true)}
                underlayColor="transparent"
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <Entypo name="log-out" size={24} color="black" />
                  <Text>Logout</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>

          {/* Student Info */}
          <View style={styles.studentInfo}>
            <Text style={styles.infoText}>
              Student Name: {studentData.studentName}
            </Text>
            <Text style={styles.infoText}>
              Student #: {studentData.studentNumber}
            </Text>
            <Text style={styles.infoText}>
              Course: {studentData.course.toUpperCase()}
            </Text>
          </View>

          {/* Circle Progress */}
          <View style={styles.circleContainer}>
            <Svg
              width={radius * 2 + strokeWidth}
              height={radius * 2 + strokeWidth}
            >
              {/* Background Circle */}
              <Circle
                cx={radius + strokeWidth / 2}
                cy={radius + strokeWidth / 2}
                r={radius}
                stroke="#E5E7EB"
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Progress Circle */}
              <Circle
                cx={radius + strokeWidth / 2}
                cy={radius + strokeWidth / 2}
                r={radius}
                stroke="green"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
              />
            </Svg>

            {/* Text Inside Circle */}
            <View style={styles.textWrapper}>
              <Text style={[styles.ratingText, { fontSize: ratingFontSize }]}>
                {totalCount > 0
                  ? `${Math.round((attendedCount / totalCount) * 100)}%`
                  : "0%"}
              </Text>
              <Text
                style={{
                  fontSize: labelFontSize - 3,
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Attendance Progress
              </Text>
            </View>
          </View>

          {/* Event Evaluated (List) */}
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Event Attended & Evaluated</Text>

            {studentAttendedData.length !== 0 ? (
              <Animated.FlatList
                data={studentAttendedData}
                keyExtractor={(item) => item.eventId}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator
                renderItem={({ item }) => (
                  <Animated.View
                    entering={FadeInUp.duration(500)}
                    style={styles.eventCard}
                  >
                    <View>
                      <Text style={styles.eventText}>{item.eventTitle}</Text>
                      <Text style={styles.eventText}>
                        {item.eventDateAndTime}
                      </Text>
                    </View>

                    <View
                      style={{
                        justifyContent: "center",
                        flexDirection: "row",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {item.attended ? (
                        <Entypo name="check" size={24} color="green" />
                      ) : (
                        <Entypo name="cycle" size={24} color="orange" />
                      )}
                      <Text style={styles.statusText}>Attended</Text>

                      {item.evaluated ? (
                        <Entypo name="check" size={24} color="green" />
                      ) : (
                        <Entypo name="cross" size={24} color="red" />
                      )}
                      <Text style={styles.statusText}>Evaluated</Text>
                    </View>
                  </Animated.View>
                )}
              />
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text>No events available!</Text>
              </View>
            )}
          </View>
        </View>

        {/* 🔘 Logout Confirmation Modal */}
        <Modal
          transparent
          visible={isLogout}
          animationType="fade"
          onRequestClose={() => setIsLogout(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                Are you sure you want to log out?
              </Text>
              <View style={styles.modalButtons}>
                <Pressable
                  onPress={() => setIsLogout(false)}
                  style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                >
                  <Text>Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={handleLogout}
                  style={[styles.modalBtn, { backgroundColor: "red" }]}
                >
                  <Text style={{ color: "#fff" }}>Yes</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Forth,
    marginHorizontal: "auto",
    marginVertical: 10,
    padding: 10,
    width: "95%",
    maxWidth: 600,
    borderRadius: 7,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  avatarArea: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: { color: "white", fontSize: 20, fontWeight: "bold" },
  studentInfo: { marginVertical: 5 },
  infoText: { fontWeight: "500", marginBottom: 2 },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  textWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  ratingText: {
    color: COLORS.TextColor,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 7,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventText: { fontWeight: "500", fontSize: 13 },
  statusText: { fontSize: 10, fontWeight: "500", marginHorizontal: 4 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 20,
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    minWidth: 250,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
