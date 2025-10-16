import { getAllEvents } from "@/api/EventService";
import { eventsDataFunction } from "@/api/spring";
import {
  getAllStudents,
  sendExpoNotification
} from "@/api/StudentService";
import FloatingButton from "@/components/FloatingButton";
import HeaderOfficer from "@/components/HeaderOfficer";
import LinearbackGround from "@/components/LinearBackGround";
import LinearProgressBar from "@/components/LinearProgressBar";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Event, Student } from "../Oop/Types";

const Home = () => {
  const router = useRouter();
  const { eventData, studentToken, studentData } = useUser();

  const [suggestionTitleState, setSuggestedTitleState] = useState([]);
  const [latestEventState, setLatestEventState] = useState<Event | undefined>();
  const [eventState, setEventState] = useState<Event[]>([]);
  const [allTokens, setAllTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Fetch all data
  useEffect(() => {
    const loadData = async () => {
      try {
        // 🎯 Suggested event titles
        if (eventData?.length) {
          const eventIdAndTitles = eventData.map(
            (event: { id: any; eventTitle: any }) => ({
              eventId: event.id,
              eventTitle: event.eventTitle,
            })
          );
          setSuggestedTitleState(eventIdAndTitles);
        }

        // 🎯 Fetch all students (for notification tokens)
        const students = await getAllStudents(studentToken);

        const tokens = students
          .map((s: Student) => s.tokenId)
          .filter((t: any): t is string => !!t);
        setAllTokens(tokens);
        // console.log("🎯 Loaded tokens:", tokens.length);

        // 🎯 Fetch all events
        const events = await eventsDataFunction(studentToken);
        setEventState(events);

        // 🎯 Get latest event
        const allEventsData = await  getAllEvents(studentToken)

        if(allEventsData?.length) {
          const lastItem = allEventsData.at(-1);
          setLatestEventState(lastItem);
        } else {
          setLatestEventState(undefined);
        }
      } catch (error) {
        console.error("❌ Error loading data:", error);
      }
    };

    loadData();
  }, [studentToken]);

  // 📢 Send announcement
  const handleSendAnnouncement = async (title: string, message: string) => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Missing fields", "Please fill out both title and message!");
      return;
    }

    try {
      setLoading(true);
      await sendExpoNotification({ tokens: allTokens, title, message });
      Alert.alert("✅ Success", "Announcement sent successfully!");
    } catch (error: any) {
      console.error("❌ Error sending announcement:", error);
      Alert.alert("Error", "Failed to send announcement!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header */}
          <HeaderOfficer
            officerName={studentData?.studentName ?? "Officer"}
            eventSuggestionData={suggestionTitleState}
            handleSendAnnouncement={handleSendAnnouncement}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Latest Event */}
            <Text style={styles.subTitleText}>Latest Event</Text>

            {latestEventState ? (
              <TouchableOpacity
                onPress={() =>
                  router.push(`../officerEventDetails/${latestEventState.id}`)
                }
                style={styles.card}
              >
                <Image
                  source={require("@/assets/images/eventPic1.jpg")}
                  resizeMode="cover"
                  style={styles.eventImage}
                />
                <View style={styles.eventInfo}>
                  <Text style={styles.title}>
                    {latestEventState.eventTitle}
                  </Text>
                  <Text style={styles.info}>{latestEventState.eventDate}</Text>
                  <Text style={styles.info}>{latestEventState.eventTime}</Text>
                  <Text style={styles.info}>
                    {latestEventState.eventTimeLength}
                  </Text>

                  <LinearProgressBar
                    value={latestEventState.eventAttendances?.length || 0}
                    max={latestEventState.allStudentAttending}
                    title={"Attended"}
                  />
                  <LinearProgressBar
                    value={latestEventState.eventEvaluationDetails?.length || 0}
                    max={latestEventState.eventAttendances?.length || 0}
                    title={"Evaluated"}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <Text style={styles.emptyText}>Loading latest event...</Text>
            )}

            {/* All Events */}
            <Text style={styles.subTitleText}>All Events</Text>

            <FlatList
              data={eventState}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push(`../officerEventDetails/${item.id}`)
                  }
                  style={styles.card}
                >
                  <Image
                    source={require("@/assets/images/eventPic1.jpg")}
                    resizeMode="cover"
                    style={styles.eventImage}
                  />
                  <View style={styles.eventInfo}>
                    <Text style={styles.title}>{item.eventTitle}</Text>
                    <Text style={styles.info}>{item.eventDate}</Text>
                    <Text style={styles.info}>{item.eventTime}</Text>
                    <Text style={styles.info}>{item.eventTimeLength}</Text>

                    <LinearProgressBar
                      value={item.eventAttendances?.length || 0}
                      max={item.allStudentAttending}
                      title={"Attended"}
                    />
                    <LinearProgressBar
                      value={item.eventEvaluationDetails?.length || 0}
                      max={item.eventAttendances?.length || 0}
                      title={"Evaluated"}
                    />
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No events to display</Text>
              }
            />
          </ScrollView>
        </View>

        {/* Floating Add Button */}
        <FloatingButton
          iconName="plus"
          onPress={() => router.push("../officerAddEvent/addEvent")}
        />

        {/* Loading Modal */}
        <Modal visible={loading} transparent animationType="fade">
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Sending Announcement...</Text>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "95%",
    backgroundColor: COLORS.Forth,
    margin: 10,
    borderRadius: 12,
    padding: 10,
    alignSelf: "center",
  },
  subTitleText: {
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: "700",
    fontSize: 20,
    alignSelf: "flex-start",
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.Third,
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  eventImage: {
    width: 120,
    height: "100%",
    borderRadius: 8,
    marginRight: 10,
  },
  eventInfo: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 4,
  },
  info: {
    color: "#444",
    fontSize: 14,
    marginBottom: 2,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});
