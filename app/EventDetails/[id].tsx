import { updateAllStudentAttending } from "@/api/EventService";
import { addStudentUpcomingEvent, getEventById } from "@/api/spring";
import { addStudentProfileData, deleteSpecificStudentNotifications } from "@/api/StudentService";
import LinearbackGround from "@/components/LinearBackGround";
import Loading from "@/components/Loading";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Event,
  EventAgenda,
  StudentEventAttendedAndEvaluationDetails,
  StudentUpcomingEvents,
} from "../Oop/Types";

const EventDetails = () => {
  const { id } = useLocalSearchParams();
  const { studentToken, studentData } = useUser();

  const studentId = studentData.id;
  const [studentUpcomingEvents, setStudentUpcomingEvents] = useState<
    StudentUpcomingEvents[]
  >([]);
  const [event, setEvent] = useState<Event | null>(null);
  const [eventAgendas, setEventAgendas] = useState<EventAgenda[]>([]);
  const [loading, setLoading] = useState(false);

  const [alreadyModalVisible, setAlreadyModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const [studentNotification, setStudentNotification] = useState(0);
  const router = useRouter();

  const haddleStudentAttending = async () => {
    if (!event) return;

    setLoading(true);

    try {
      const studentUpcomingData: StudentUpcomingEvents = {
        eventId: id.toString(),
        eventTitle: event.eventTitle,
        eventDate: event.eventDate,
        eventTime: event.eventTime,
        eventLocation: event.eventLocation,
        numberOfStudentAttending: (event.allStudentAttending ?? 0) + 1,
      };

      const alreadyExists = studentUpcomingEvents.some(
        (e) => e.eventId === id.toString()
      );

      if (alreadyExists) {
        setLoading(false);
        setAlreadyModalVisible(true);
        return;
      }

      const eventAttended = await addStudentUpcomingEvent(studentId, studentToken, [
        studentUpcomingData,
      ]);

      console.log(eventAttended)

      const currentEventAttending = (event.allStudentAttending ?? 0) + 1;
      await updateAllStudentAttending(
        studentToken,
        id as string,
        currentEventAttending
      );

      const eventDateTime = `${event.eventDate ?? ""} ${
        event.eventTime ?? ""
      }`.trim();

      // profile data
      const sampleData: StudentEventAttendedAndEvaluationDetails[] = [
        {
          eventId: id as string,
          eventTitle: event?.eventTitle || "no title",
          eventDateAndTime: eventDateTime,
          attended: false,
          evaluated: false,
        },
      ];

      await addStudentProfileData(studentToken, studentId, sampleData);

      // delete student notification
      await deleteSpecificStudentNotifications(studentToken, studentId, id as string)

      setLoading(false);
      setSuccessModalVisible(true);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to add upcoming event. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      setStudentUpcomingEvents(studentData.studentUpcomingEvents);

      try {
        const fetchedEvent = await getEventById(studentToken, id);
        const eventData = Array.isArray(fetchedEvent)
          ? fetchedEvent[0]
          : fetchedEvent;

        setEvent(eventData);
        setEventAgendas(eventData.eventAgendas || []);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEventDetails();
  }, [id, studentToken]);

  // Agenda Section
  const AgendaSection = ({
    eventAgendas,
  }: {
    eventAgendas?: EventAgenda[];
  }) => {
    if (!eventAgendas || eventAgendas.length === 0) {
      return (
        <Text
          style={{ textAlign: "center", marginVertical: 10, color: "gray" }}
        >
          No agenda available.
        </Text>
      );
    }

    return (
      <View style={{ flex: 1, marginTop: 10, paddingLeft: 20 }}>
        {eventAgendas.map((agendaItem, index) => (
          <View key={index} style={{ flexDirection: "row", marginBottom: 20 }}>
            {/* Timeline circle */}
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: COLORS.Primary,
                  marginTop: 5,
                }}
              />
              {index !== eventAgendas.length - 1 && (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    backgroundColor: "#ccc",
                    marginTop: 2,
                  }}
                />
              )}
            </View>

            {/* Agenda card */}
            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                padding: 12,
                borderRadius: 8,
                marginLeft: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 3,
              }}
            >
              <Text
                style={{ fontWeight: "600", fontSize: 14, marginBottom: 2 }}
              >
                {agendaItem.agendaTime}
              </Text>
              <Text style={{ fontSize: 14, marginBottom: 2 }}>
                {agendaItem.agendaTitle}
              </Text>
              <Text style={{ fontSize: 12, color: "gray" }}>
                {agendaItem.agendaHost}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <LinearbackGround>
      <ScrollView>
        <SafeAreaView style={{ flex: 1, marginBottom: 50 }}>
          {event ? (
            <View
              style={{
                margin: 10,
                backgroundColor: COLORS.Forth,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <ImageBackground
                source={require("@/assets/images/auditorium.jpg")}
                style={{
                  width: "100%",
                  height: 180,
                  justifyContent: "flex-end",
                }}
                imageStyle={{ resizeMode: "cover" }}
              >
                <View
                  style={{ backgroundColor: "rgba(0,0,0,0.4)", padding: 10 }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "600",
                      marginBottom: 5,
                    }}
                  >
                    {event.eventTitle}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <AntDesign name="calendar" size={17} color="#fff" />
                    <Text
                      style={{
                        color: "#fff",
                        marginRight: 10,
                        marginLeft: 4,
                        fontSize: 12,
                      }}
                    >
                      {event.eventDate}
                    </Text>

                    <AntDesign name="clockcircleo" size={17} color="#fff" />
                    <Text
                      style={{
                        color: "#fff",
                        marginRight: 10,
                        marginLeft: 4,
                        fontSize: 12,
                      }}
                    >
                      {event.eventTime}
                    </Text>

                    <Entypo name="location" size={17} color="#fff" />
                    <Text
                      style={{ color: "#fff", marginLeft: 4, fontSize: 12 }}
                    >
                      {event.eventLocation}
                    </Text>
                  </View>
                </View>
              </ImageBackground>

              <View style={{ marginHorizontal: 10 }}>
                <Text style={styles.title}>{event.eventTitle}</Text>
                <Text style={styles.subTitle}>
                  {event.eventShortDescription}
                </Text>

                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.body}>{event.eventBody}</Text>

                <Text style={styles.sectionTitle}>Agenda</Text>
                <AgendaSection eventAgendas={eventAgendas} />

                <TouchableHighlight
                  style={styles.btnAttending}
                  onPress={haddleStudentAttending}
                >
                  <Text style={styles.btnAttendingText}>I'm Attending</Text>
                </TouchableHighlight>
              </View>
              <View style={{ marginLeft: 10, marginBottom:15 }}>
                <Text style={[styles.sectionTitle]}>Organizer</Text>
                <View style={{ marginLeft: 10 }}>
                  <Text>{event.eventOrganizer?.organizerName}</Text>
                  <Text>{event.eventOrganizer?.organizerEmail}</Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Loading event details...
            </Text>
          )}

          {/* Already Added Modal */}
          <Modal
            animationType="fade"
            transparent
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

          {/* Success Modal */}
          <Modal
            animationType="fade"
            transparent
            visible={successModalVisible}
            onRequestClose={() => setSuccessModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalView}>
                <Text style={[styles.modalTitle, { color: "green" }]}>
                  Success 🎉
                </Text>
                <Text style={styles.modalText}>
                  Event added successfully to your Events you registered!
                </Text>

                <Pressable
                  style={[
                    styles.button,
                    { backgroundColor: "green", marginTop: 15 },
                  ]}
                  onPress={() => {
                    setSuccessModalVisible(false);
                    router.push("/(tabs)/home");
                  }}
                >
                  <Text style={styles.buttonText}>Go to Home</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <Loading text="Please wait..." color="#4F46E5" visible={loading} />
        </SafeAreaView>
      </ScrollView>
    </LinearbackGround>
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8, color: "black" },
  subTitle: { fontSize: 16, marginBottom: 12, color: "#555" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: "black",
  },
  body: { fontSize: 14, color: "#333", marginBottom: 12 },
  btnAttending: {
    backgroundColor: COLORS.Primary,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  btnAttendingText: { color: COLORS.textColorWhite, textAlign: "center" },

  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: { borderRadius: 10, padding: 10, elevation: 2 },
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
