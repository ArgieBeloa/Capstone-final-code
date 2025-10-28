import { getAllEvents } from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import { StudentModel } from "@/api/students/model";
import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const Profile = () => {
  const { studentData, eventData, studentToken } = useUser();
  const router = useRouter();

  const student: StudentModel = studentData;
  const [events, setEvents] = useState(eventData);
  const [doneEvents, setDoneEvents] = useState<EventModel[]>([]);
  const [soonEvents, setSoonEvents] = useState<EventModel[]>([]);
  const [isLogout, setIsLogout] = useState<boolean>(false);

  // circle data
  const screenWidth = Dimensions.get("window").width;
  const ratingFontSize = Math.min(screenWidth * 0.06, 20);
  const labelFontSize = Math.min(screenWidth * 0.045, 14);
  const radius = Math.max(40, Math.min(80, screenWidth / 6));
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  const eventDone = doneEvents.length;
  const totalCount = eventData.length || 0;
  const progress = (eventDone / (totalCount || 1)) * circumference;

  // 🕒 Separate done & upcoming events
  const separateEventsByDate = (events: any[]) => {
    const nowPH = new Date(Date.now() + 8 * 60 * 60 * 1000);
    const todayPH = new Date(
      nowPH.getFullYear(),
      nowPH.getMonth(),
      nowPH.getDate()
    );

    const doneEvents: any[] = [];
    const upcomingEvents: any[] = [];

    for (const event of events) {
      if (!event.eventDate) continue;
      const [year, month, day] = event.eventDate.split("-").map(Number);
      const eventDate = new Date(year, month - 1, day);
      if (eventDate < todayPH) doneEvents.push(event);
      else upcomingEvents.push(event);
    }

    return { doneEvents, upcomingEvents };
  };

  // 🔘 Logout
  const handleLogout = () => {
    setIsLogout(false);
    router.push("/");
  };

  // 📅 Fetch events
  useEffect(() => {
    const loadEvents = async () => {
      const allEvents = await getAllEvents(studentToken);
      setEvents(allEvents);
      const { doneEvents, upcomingEvents } = separateEventsByDate(allEvents);
      setDoneEvents(doneEvents);
      setSoonEvents(upcomingEvents);
    };
    loadEvents();
  }, []);

  const handlePrintAttendance = (id: string) => {
    router.push(`../PrintAttendances/${id}`);
  };

  // ✅ Done Events Header
  const headerDoneEvent = (
    <View style={{ marginBottom: 15 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          color: COLORS.TextColor,
          marginBottom: 10,
          marginLeft: 10,
        }}
      >
        Upcoming and Completed Events
      </Text>

      {doneEvents.length === 0 ? (
        <Text
          style={{ color: "#888", textAlign: "center", marginVertical: 10 }}
        >
          No completed events yet.
        </Text>
      ) : (
        doneEvents.map((item) => (
          <View
            key={item.id}
            style={{
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
            }}
          >
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
                {item.eventTitle}
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
                    {item.eventTimeLength || item.eventDate}
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
                    {item.eventLocation || "No location specified"}
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
                {Platform.OS === "web" ? (
                  <>
                    <Text
                      style={{
                        color: "#000",
                        marginLeft: 8,
                        fontWeight: "600",
                        marginTop: 5,
                      }}
                    >
                      Attendance
                    </Text>

                    <TouchableOpacity
                      onPress={() => handlePrintAttendance(item.id)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#007bff",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 8,
                        marginLeft: 5,
                      }}
                    >
                      <FontAwesome5 name="print" size={15} color="#fff" />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => handlePrintAttendance(item.id)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#28a745",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 8,
                      }}
                    >
                      <Ionicons name="save-outline" size={15} color="#fff" />
                    </TouchableOpacity>

                    <Text
                      style={{
                        color: "#030000ff",
                        marginLeft: 8,
                        fontWeight: "600",
                      }}
                    >
                      Attendance
                    </Text>
                  </>
                )}
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );

  // ✅ Render Upcoming Events
  const renderUpcomingEvent = ({ item }: any) => (
    <View
      key={item.id}
      style={{
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
      }}
    >
      <View style={{ marginRight: 10, width: 40, alignItems: "center" }}>
        <Ionicons name="time-outline" size={28} color="#4e9af1" />
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
          {item.eventTitle}
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
              {item.eventTimeLength || item.eventDate}
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
              {item.eventLocation || "No location specified"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.Forth,
            borderRadius: 10,
            marginHorizontal: 10,
            position: "relative", // ✅ fix touch issue
          }}
        >
          {/* 🔘 Logout icon */}
          <TouchableHighlight
            onPress={() => {
              console.log("Logout pressed ✅");
              setIsLogout(true);
            }}
            underlayColor="transparent"
            style={{
              position: "absolute",
              top: 20,
              right: 10,
              zIndex: 100, // ✅ ensure visible
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Entypo name="log-out" size={24} color="black" />
              <Text>Logout</Text>
            </View>
          </TouchableHighlight>

          <Text
            style={{
              textAlign: "center",
              fontSize: 25,
              fontWeight: "900",
              marginTop: 15,
            }}
          >
            Profile
          </Text>

          {/* Profile info */}
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                height: 80,
                width: 80,
                borderRadius: 100,
                backgroundColor: "grey",
                justifyContent: "center",
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              <Text style={{ textAlign: "center", color: "white" }}>
                {student.studentName.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={{ marginLeft: 10, paddingVertical: 10, marginTop: 7 }}>
              <Text style={styles.infoText}>Name: {student.studentName}</Text>
              <Text style={styles.infoText}>
                Student #: {student.studentNumber}
              </Text>
              <Text style={styles.infoText}>Category: Officer</Text>
            </View>
          </View>

          {/* Circle progress */}
          <View
            style={{
              marginHorizontal: 10,
              borderRadius: 7,
              marginVertical: 10,
            }}
          >
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
              <View style={styles.textWrapper}>
                <Text style={[styles.ratingText, { fontSize: ratingFontSize }]}>
                  {totalCount > 0
                    ? `${Math.round((eventDone / totalCount) * 100)}%`
                    : "0%"}
                </Text>
                <Text
                  style={{ fontSize: labelFontSize - 3, fontWeight: "500" }}
                >
                  Event Done
                </Text>
              </View>
            </View>
          </View>

          {/* FlatList */}
          <FlatList
            ListHeaderComponent={headerDoneEvent}
            data={soonEvents}
            keyExtractor={(item) => item.id}
            renderItem={renderUpcomingEvent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text
                style={{ textAlign: "center", color: "#888", marginTop: 10 }}
              >
                No upcoming events.
              </Text>
            }
          />
        </View>
      </SafeAreaView>

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
    </LinearbackGround>
  );
};

export default Profile;

const styles = StyleSheet.create({
  infoText: {
    fontSize: 14,
    fontWeight: "500",
  },
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
});
