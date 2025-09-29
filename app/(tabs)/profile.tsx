import LinearbackGround from "@/components/LinearBackGround";
import { useUser } from "@/src/userContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Student } from "../Oop/Types";

const Profile = () => {
  //  user context
  const {
    studentToken,
    studentNumber,
    studentData,
    setStudentData,
    eventData,
  } = useUser();

  const [studentNotification, setStudentNotification] = useState(Number);

  const student: Student = studentData;
  const firstLetter = student.studentName.charAt(0);

  const router = useRouter()

    // program event
    const haddleNotificationClick = () => {
      router.push(`../Notification/studentNotication`);
    };
  return (
    <LinearbackGround>
      <SafeAreaView style={styles.safeAreaView}>
        {/* Header */}
        <View style={styles.headContainer}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>{firstLetter}</Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good Day</Text>
            <Text style={styles.name}>{student.studentName}</Text>
          </View>

          {/* //  notication area */}

          <TouchableHighlight onPress={() => haddleNotificationClick()}>
            <View>
              {studentNotification !== 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>
                    {studentNotification}
                  </Text>
                </View>
              )}
              <Ionicons
                name="notifications-outline"
                size={30}
                style={styles.icon}
              />
            </View>
          </TouchableHighlight>
        </View>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeAreaView: { width: "100%", height: "100%" },
  headContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 10,
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: { color: "#fff", fontWeight: "700", fontSize: 20 },
  headerText: { flex: 1, marginLeft: 10 },
  greeting: { fontSize: 12, color: "#666" },
  name: { fontSize: 16, fontWeight: "bold", color: "#222" },
  icon: { marginHorizontal: 5 },
  notificationBadge: {
    width: 20,
    height: 20,
    right: 5,
    position: "absolute",
    backgroundColor: "black",
    borderRadius: 40,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: { color: "white", fontSize: 12 },
});
