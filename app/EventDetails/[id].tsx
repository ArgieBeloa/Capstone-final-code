import { addStudentUpcomingEvent, getEventById } from "@/api/spring";
import LinearbackGround from "@/components/LinearBackGround";
import Loading from "@/components/Loading";
import ViewPanel from "@/components/ViewPanel";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event, StudentUpcomingEvents } from "../Oop/Types";

const EventDetails = () => {
  const { id } = useLocalSearchParams();
  const { studentToken, studentData } = useUser();

  const studentId = studentData.id;
  const [studentUpcomingEvents, setStudentUpcomingEvents] = useState<
    StudentUpcomingEvents[]
  >([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Modals
  const [alreadyModalVisible, setAlreadyModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  let numberOfStudentAttending = event?.allStudentAttending ?? 0;
  const router = useRouter();

  // Handle attending
  const haddleStudentAttending = async () => {
    setLoading(true);

    if (!event) {
      Alert.alert("No Event", "No event provided, skipping add.");
      setLoading(false);
      return;
    }

    try {
      const studentUpcomingData: StudentUpcomingEvents = {
        eventId: id.toString(),
        eventTitle: event.eventTitle,
        eventDate: event.eventDate,
        eventTime: event.eventTime,
        eventLocation: event.eventLocation,
        numberOfStudentAttending: (numberOfStudentAttending ?? 0) + 1,
      };

      const alreadyExists = studentUpcomingEvents.some(
        (e: StudentUpcomingEvents) => e.eventId === id.toString()
      );

      console.log("Already exists?", alreadyExists);

      if (alreadyExists) {
        // ⚠️ Show Already Added modal
        setLoading(false);
        setAlreadyModalVisible(true);
      } else {
        // ✅ Add event when not exists
        await addStudentUpcomingEvent(studentId, studentToken, [
          studentUpcomingData,
        ]);
        setLoading(false);
        setSuccessModalVisible(true); // 🎉 Show success modal
      }
    } catch (err) {
      console.error("❌ Failed to add upcoming event:", err);
      Alert.alert("Error", "Failed to add upcoming event. Please try again.");
      setLoading(false);
    }
  };

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      setStudentUpcomingEvents(studentData.studentUpcomingEvents);

      try {
        const fetchedEvent = await getEventById(studentToken, id);
        const eventData = Array.isArray(fetchedEvent)
          ? fetchedEvent[0]
          : fetchedEvent;

        setEvent(eventData);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEventDetails();
  }, [id, studentToken]);

  return (
    <LinearbackGround>
      <SafeAreaView>
        {event ? (
          <Animated.FlatList
            data={[event]}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ margin: 10 }}
            renderItem={({ item }: { item: Event }) => (
              <ViewPanel style={{ padding: 10 }}>
                <Text style={styles.title}>{item.eventTitle}</Text>
                <Text style={styles.subTitle}>
                  {item.eventShortDescription}
                </Text>

                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.body}>{item.eventBody}</Text>

                <Text style={styles.sectionTitle}>Details</Text>
                <Text>Date: {item.eventDate}</Text>
                <Text>Location: {item.eventLocation}</Text>
                {item.eventTime && <Text>Time: {item.eventTime}</Text>}
                {item.eventCategory && (
                  <Text>Category: {item.eventCategory}</Text>
                )}

                <TouchableHighlight
                  style={styles.btnAttending}
                  onPress={haddleStudentAttending}
                >
                  <Text style={styles.btnAttendingText}>I'm Attending</Text>
                </TouchableHighlight>
              </ViewPanel>
            )}
          />
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Loading event details...
          </Text>
        )}

        {/* ⚠️ Already Added Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={alreadyModalVisible}
          onRequestClose={() => setAlreadyModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Already Added</Text>
              <Text style={styles.modalText}>
                You have already added this event to your upcoming list.
              </Text>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setAlreadyModalVisible(false)}
              >
                <Text style={styles.buttonText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* 🎉 Success Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={successModalVisible}
          onRequestClose={() => setSuccessModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalView}>
              <Text style={[styles.modalTitle, { color: "green" }]}>
                Success 🎉
              </Text>
              <Text style={styles.modalText}>
                Event added successfully to your upcoming list!
              </Text>

              <Pressable
                style={[styles.button, { backgroundColor: "green", marginTop: 15 }]}
                onPress={() => {
                  setSuccessModalVisible(false);
                  router.push("/(tabs)/home"); // ✅ redirect to home after success
                }}
              >
                <Text style={styles.buttonText}>Go to Home</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Loading text="Please wait..." color="#4F46E5" visible={loading} />
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  eventImagebg: {
    width: "100%",
    height: 200,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "black",
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: "black",
  },
  body: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
  },
  btnAttending: {
    backgroundColor: COLORS.Primary,
    paddingVertical: 5,
    borderRadius: 8,
    marginVertical: 10,
  },
  btnAttendingText: {
    color: COLORS.textColorWhite,
    textAlign: "center",
  },

  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },

  // modal
  buttonClose: { backgroundColor: "red", marginTop: 15 },
  buttonText: { color: "white", fontWeight: "bold" },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 14, textAlign: "center" },
});
