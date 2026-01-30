import {
  addEventAttendanceRecords,
  getAllEvents,
} from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import { StudentModel } from "@/api/students/model";
import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

// ✅ local storage imports
import { EventAttendance } from "@/api/events/utils";
import {
  deleteLocalAttendanceByEventId,
  loadAllLocalAttendance,
  loadStudents,
} from "@/api/local/local";

// Type for local attendance
type LocalAttendance = {
  eventId: string;
  students: EventAttendance[];
};

const Profile = () => {
  const { studentData, eventData, studentToken } = useUser();
  const router = useRouter();
  const isFocused = useIsFocused();

  const student: StudentModel = studentData;

  const [events, setEvents] = useState(eventData);
  const [doneEvents, setDoneEvents] = useState<EventModel[]>([]);
  const [soonEvents, setSoonEvents] = useState<EventModel[]>([]);
  const [localEvents, setLocalEvents] = useState<EventModel[]>([]);
  const [isLogout, setIsLogout] = useState(false);

  // 📊 circle progress
  const screenWidth = Dimensions.get("window").width;
  const radius = Math.max(40, Math.min(80, screenWidth / 6));
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const eventDone = doneEvents.length;
  const totalCount = eventData.length || 0;
  const progress = (eventDone / (totalCount || 1)) * circumference;

  // 🕒 Separate done & upcoming events
  const separateEventsByDate = (events: EventModel[]) => {
    const nowPH = new Date(Date.now() + 8 * 60 * 60 * 1000);
    const todayPH = new Date(
      nowPH.getFullYear(),
      nowPH.getMonth(),
      nowPH.getDate(),
    );

    const done: EventModel[] = [];
    const upcoming: EventModel[] = [];

    for (const event of events) {
      if (!event.eventDate) continue;
      const [y, m, d] = event.eventDate.split("-").map(Number);
      const eventDate = new Date(y, m - 1, d);
      eventDate < todayPH ? done.push(event) : upcoming.push(event);
    }

    return { done, upcoming };
  };

  // 📅 Fetch events and local attendance
  useEffect(() => {
    const loadEvents = async () => {
      const allEvents = await getAllEvents(studentToken);
      setEvents(allEvents);
      const { done, upcoming } = separateEventsByDate(allEvents);
      setDoneEvents(done);
      setSoonEvents(upcoming);
    };

    const loadLocalEvents = async () => {
      const eventsLocal = await loadAllLocalAttendance();
      const eventIds = Object.keys(eventsLocal);
      const localEventsData = eventData.filter((event) =>
        eventIds.includes(event.id),
      );
      setLocalEvents(localEventsData);
    };

    loadEvents();
    loadLocalEvents();
  }, []);

  // 🔁 Reload local attendance when screen is focused
  useEffect(() => {
    if (isFocused) {
      const reloadLocalEvents = async () => {
        const eventsLocal = await loadAllLocalAttendance();
        const eventIds = Object.keys(eventsLocal);
        const localEventsData = eventData.filter((event) =>
          eventIds.includes(event.id),
        );
        setLocalEvents(localEventsData);
      };
      reloadLocalEvents();
    }
  }, [isFocused]);

  // Logout
  const handleLogout = () => {
    setIsLogout(false);
    router.push("/");
  };

  // Navigate to print attendance screen
  const handlePrintAttendance = (id: string) => {
    router.push(`../PrintAttendances/${id}`);
  };

  // Upload local attendance to cloud
  const handleAttendanceLocal = async (id: string) => {
    try {
      const localData = await loadStudents(id);
      if (localData.length === 0) return;

      for (const item of localData) {
        await addEventAttendanceRecords(studentToken, id, {
          studentId: item.studentId,
          studentNumber: item.studentNumber,
          studentName: item.studentName,
          role: item.role,
          department: item.department,
          dateScanned: item.dateScanned,
        });
      }

      await deleteLocalAttendanceByEventId(id);

      const eventsLocal = await loadAllLocalAttendance();
      const eventIds = Object.keys(eventsLocal);
      const localEventsData = eventData.filter((event) =>
        eventIds.includes(event.id),
      );
      setLocalEvents(localEventsData);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  // Reusable Event Card
  const EventCard = ({
    event,
    onPrint,
    uploadBtn = false,
  }: {
    event: EventModel;
    onPrint: () => void;
    uploadBtn?: boolean;
  }) => (
    <View style={styles.card}>
      <View style={{ marginRight: 10, width: 40, alignItems: "center" }}>
        <Ionicons
          name="checkmark-done-circle"
          size={24}
          color={COLORS.Primary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: COLORS.TextColor,
            marginBottom: 6,
          }}
        >
          {event.eventTitle}
        </Text>

        <View style={{ marginBottom: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Ionicons
              name="time-outline"
              size={16}
              color="#666"
              style={{ marginRight: 4 }}
            />
            <Text style={{ color: "#666", fontSize: 14 }}>
              {event.eventTimeLength || event.eventDate}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="location-outline"
              size={16}
              color="#999"
              style={{ marginRight: 4 }}
            />
            <Text style={{ color: "#999", fontSize: 13 }}>
              {event.eventLocation || "No location specified"}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 15,
            position: "absolute",
            right: 2,
            bottom: 2,
          }}
        >
          <TouchableOpacity
            onPress={onPrint}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: uploadBtn ? "#4f61b4" : "#28a745",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
            }}
          >
            <Ionicons name="save-outline" size={15} color="#fff" />
          </TouchableOpacity>
          <Text
            style={{ color: "#030000ff", marginLeft: 8, fontWeight: "600" }}
          >
            {uploadBtn ? "Upload" : "Attendance"}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Logout Button */}
          <TouchableHighlight
            onPress={() => setIsLogout(true)}
            underlayColor="transparent"
            style={styles.logoutBtn}
          >
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Entypo name="log-out" size={22} color="black" />
              <Text>Logout</Text>
            </View>
          </TouchableHighlight>

          <Text style={styles.title}>Profile</Text>

          {/* Profile Info */}
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={{ color: "white", fontSize: 22 }}>
                {student.studentName.charAt(0)}
              </Text>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.infoText}>Name: {student.studentName}</Text>
              <Text style={styles.infoText}>
                Student #: {student.studentNumber}
              </Text>
              <Text style={styles.infoText}>Category: Officer</Text>
            </View>
          </View>

          {/* Progress Circle */}
          <View style={styles.circleContainer}>
            <Svg
              width={radius * 2 + strokeWidth}
              height={radius * 2 + strokeWidth}
            >
              <Circle
                cx={radius + strokeWidth / 2}
                cy={radius + strokeWidth / 2}
                r={radius}
                stroke="#E5E7EB"
                strokeWidth={strokeWidth}
                fill="none"
              />
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
            <Text style={styles.percentText}>
              {totalCount > 0
                ? `${Math.round((eventDone / totalCount) * 100)}%`
                : "0%"}
            </Text>
          </View>

          {/* Done Events */}
          <Text style={styles.sectionTitle}>Done Events</Text>
          <FlatList
            data={doneEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                onPrint={() => handlePrintAttendance(item.id)}
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No completed events yet.</Text>
            }
          />

          {/* Local Attendance */}
          <Text style={styles.sectionTitle}>Local Attendance</Text>
          <FlatList
            data={localEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                onPrint={() => handleAttendanceLocal(item.id)}
                uploadBtn
              />
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No local attendance yet.</Text>
            }
          />
        </View>

        {/* Logout Modal */}
        <Modal transparent visible={isLogout} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                Are you sure you want to log out?
              </Text>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <Pressable
                  onPress={() => setIsLogout(false)}
                  style={styles.modalBtn}
                >
                  <Text>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleLogout}
                  style={[styles.modalBtn, { backgroundColor: "red" }]}
                >
                  <Text style={{ color: "white" }}>Yes</Text>
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Forth,
    margin: 10,
    borderRadius: 12,
    padding: 10,
  },
  logoutBtn: { position: "absolute", top: 15, right: 10, zIndex: 10 },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 10,
  },
  profileRow: { flexDirection: "row", marginTop: 15, alignItems: "center" },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: { fontSize: 14, fontWeight: "500" },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  percentText: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 10,
    marginLeft: 10,
    color: COLORS.TextColor,
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.Forth,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: 10,
  },
  emptyText: { textAlign: "center", color: "#888", marginTop: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
});
