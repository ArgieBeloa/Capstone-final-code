import { deleteApprovalEvent, getAdminById } from "@/api/admin/controller";
import { approvalUpdateEvent } from "@/api/admin/utils";
import { updateEvent } from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import { EvaluationQuestion, EventAgenda } from "@/api/events/utils";
import DateTemplate from "@/components/DateTemplate";
import TimeTemplate from "@/components/TimeTemplate";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Clock } from "lucide-react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const EditEvent = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { studentToken } = useUser();

  const [event, setEvent] = useState<EventModel>();
  const [eventTitle, setEventTitle] = useState("");
  const [eventShortDescription, setEventShortDescription] = useState("");
  const [eventBody, setEventBody] = useState("");
  const [eventTime, setEventTime] = useState<Date | undefined>();
  const [eventDate, setEventDate] = useState<Date>();
  const [evaluationStart, setEvaluationStart] = useState<Date | null>();
  const [evaluationEnd, setEvaluationEnd] = useState<Date | null>();
  const [eventLocation, setEventLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [eventAgenda, setEventAgenda] = useState<EventAgenda[]>([]);
  const [eventEvaluationQuestion, setEventEvaluationQuestion] = useState<
    EvaluationQuestion[]
  >([]);
  const [approveEvent, setApproveEvent] = useState<approvalUpdateEvent[]>([]);

  // Modal show
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEvaluationStartPicker, setShowEvaluationStartPicker] =
    useState(false);
  const [showEvaluationEndPicker, setShowEvaluationEndPicker] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  // AGENDA FUNCTION
  const updateAgenda = (
    index: number,
    field: keyof EventAgenda,
    value: string,
  ) => {
    const updatedAgenda = [...eventAgenda];

    updatedAgenda[index] = {
      ...updatedAgenda[index],
      [field]: value,
    };

    setEventAgenda(updatedAgenda);
  };

  const addAgenda = () => {
    setEventAgenda([
      ...(eventAgenda ?? []),
      {
        agendaTime: "",
        agendaTitle: "",
        agendaHost: "",
      },
    ]);
  };

  const deleteAgenda = (index: number) => {
    setEventAgenda((eventAgenda ?? []).filter((_, i) => i !== index));
  };

  // Evalution FUNCTION

  // const parseTime = (time: string): Date | undefined => {
  //   if (!time) return undefined;

  //   const [clock, period] = time.split(" ");
  //   const [hourStr, minuteStr] = clock.split(":");

  //   let hours = Number(hourStr);
  //   const minutes = Number(minuteStr);

  //   if (period === "PM" && hours !== 12) hours += 12;
  //   if (period === "AM" && hours === 12) hours = 0;

  //   const date = new Date();
  //   date.setHours(hours, minutes, 0, 0);

  //   return date;
  // };
  const updateEvaluationQuestion = (
    index: number,
    field: keyof EvaluationQuestion,
    value: string,
  ) => {
    const updatedEvaluationQuestion = [...eventEvaluationQuestion];

    updatedEvaluationQuestion[index] = {
      ...updatedEvaluationQuestion[index],
      [field]: value,
    };

    setEventEvaluationQuestion(updatedEvaluationQuestion);
  };

  const addEvaluationQuestion = () => {
    setEventEvaluationQuestion([
      ...(eventEvaluationQuestion ?? []),
      {
        questionId: "",
        questionText: "",
      },
    ]);
  };

  const deleteEvaluationQuestion = (index: number) => {
    setEventEvaluationQuestion(
      (eventEvaluationQuestion ?? []).filter((_, i) => i !== index),
    );
  };

  const [loading, setLoading] = useState(false);

  // --- SUBMIT ---
  const updateEventToCloud = async () => {
    if (!id) {
      Alert.alert("Error", "Event ID not found.");
      return;
    }

    setLoading(true);

    const dateString = eventDate?.toLocaleDateString("en-CA", {
      timeZone: "Asia/Manila",
    });

    console.log(dateString);

    const timeString = eventTime?.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    try {
      const updatedEvent: EventModel = {
        ...event,
        eventTitle,
        eventShortDescription,
        eventBody,
        eventLocation,
        eventCategory,
        eventTime: timeString,
        eventDate: dateString,
        evaluationStart,
        evaluationEnd,
        eventOrganizer: {
          organizerName,
          organizerEmail,
        },
        eventAgendas: eventAgenda,
        evaluationQuestions: eventEvaluationQuestion,
      } as unknown as EventModel;

      const res = await updateEvent(id as string, updatedEvent, studentToken);
      await deleteApprovalEvent(
        "6a324a76054e165bcb1dae54",
        id as string,
        studentToken,
      );
      console.log(res);

      Alert.alert("✅ Event Added");

      router.back();
    } catch (error: any) {
      console.error("❌ Update failed:", error);
      Alert.alert("❌ Error", error?.message || "Failed to update event.");
    } finally {
      setLoading(false);
    }
  };
  useLayoutEffect(() => {
    getAdminData();
  }, []);

  // Functions
  const getAdminData = async () => {
    try {
      const adminData = await getAdminById(
        studentToken,
        "6a324a76054e165bcb1dae54",
      );

      setApproveEvent(adminData.approvalUpdateEvents);
      console.log(adminData.approvalUpdateEvents);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (approveEvent.length > 0) {
      const event = approveEvent.find((event) => event.id === id);
      setEvent(event);
      console.log(event?.eventTime);

      if (!event) return;
      const evaluationStart = event.evaluationStart
        ? new Date(event.evaluationStart)
        : null;
      const evaluationEndVariable = event.evaluationEnd
        ? new Date(event.evaluationEnd)
        : null;

      setEventTitle(event.eventTitle);
      setEventShortDescription(event.eventShortDescription);
      setEventBody(event.eventBody);
      setEventLocation(event.eventLocation);
      setEventCategory(event.eventCategory);
      setEventTime(new Date(event.eventTime));

      setEventDate(event.eventDate ? new Date(event.eventDate) : undefined);
      setEvaluationStart(
        evaluationStart && !isNaN(evaluationStart.getTime())
          ? evaluationStart
          : null,
      );

      setEvaluationEnd(
        evaluationEndVariable && !isNaN(evaluationEndVariable.getTime())
          ? evaluationEndVariable
          : null,
      );
      setOrganizerName(event.eventOrganizer.organizerName);
      setOrganizerEmail(event.eventOrganizer.organizerEmail);
      setEventAgenda(event.eventAgendas);
      setEventEvaluationQuestion(event.evaluationQuestions);
    }
  }, [approveEvent, id]);

  // useEffect(() => {
  //   const getEvent = async () => {
  //     try {
  //       const res = await getEventById(studentToken, id as string);
  //       setEvent(res);
  //       setEventTitle(res.eventTitle);
  //       setEventShortDescription(res.eventShortDescription);
  //       setEventBody(res.eventBody);
  //       setEventLocation(res.eventLocation);
  //       setEventCategory(res.eventCategory);
  //       const eventTimeLength = res.eventTimeLength;
  //       setEventTime(eventTimeLength);
  //       setEventDate(res.eventDate);
  //       setOrganizerName(res.eventOrganizer.organizerName);
  //       setOrganizerEmail(res.eventOrganizer.organizerEmail);
  //       setEventAgenda(res.eventAgendas);
  //       setEventEvaluationQuestion(res.evaluationQuestions);
  //     } catch (e) {
  //       console.error("❌ Error fetching event:", e);
  //     }
  //   };

  //   getEvent();
  // }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* --- Event Info --- */}
          <Text style={styles.textInfo}>Title</Text>
          <TextInput
            style={styles.input}
            value={eventTitle}
            onChangeText={setEventTitle}
          />

          <Text style={styles.textInfo}>Short Description</Text>
          <TextInput
            style={styles.input}
            value={eventShortDescription}
            onChangeText={setEventShortDescription}
          />

          <Text style={styles.textInfo}>Main Content</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            value={eventBody}
            onChangeText={setEventBody}
          />

          <Text style={styles.textInfo}>Location</Text>
          <TextInput
            style={styles.input}
            value={eventLocation}
            onChangeText={setEventLocation}
          />

          {/* event Time */}
          <Text style={styles.textInfo}>Event Time</Text>
          {/* <TextInput
            style={styles.input}
            value={eventTime}
            onChangeText={setEventTime}
          /> */}
          <TimeTemplate
            label="Event Time"
            time={eventTime}
            setTime={setEventTime}
            showModal={showTimeModal}
            setShowModal={setShowTimeModal}
          />

          {/* event date*/}
          <Text style={styles.textInfo}>Event Date</Text>
          {/* <TextInput
            style={styles.input}
            value={eventDate}
            onChangeText={setEventDate}
          /> */}
          <TouchableOpacity
            style={styles.rowInput}
            onPress={() => {
              if (Platform.OS !== "web") {
                setShowDatePicker(true);
              }
            }}
          >
            <Clock color={COLORS.Primary} />
            <Text style={styles.rowText}>
              {eventDate
                ? `Event date: ${eventDate.toLocaleString()}`
                : "Pick Date"}
            </Text>
          </TouchableOpacity>

          {Platform.OS === "web" ? (
            <View style={{ marginVertical: 6 }}>
              <input
                type="datetime-local"
                value={
                  eventDate
                    ? new Date(
                        eventDate.getTime() -
                          eventDate.getTimezoneOffset() * 60000,
                      )
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) => {
                  if (e.target.value) {
                    setEventDate(new Date(e.target.value));
                  }
                }}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
            </View>
          ) : (
            showDatePicker && (
              <DateTimePicker
                mode="datetime"
                value={eventDate || new Date()}
                display="default"
                onChange={(_, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    setEventDate(date);
                  }
                }}
              />
            )
          )}

          {/* Evaluation Start */}
          <Text style={styles.textInfo}>Evaluation start</Text>
          <DateTemplate
            label="Evaluation Start"
            dateState={evaluationStart ?? null}
            setDateState={setEvaluationStart}
            show={showEvaluationStartPicker}
            setShow={setShowEvaluationStartPicker}
          />

          {/* Evaluation End */}
          <Text style={styles.textInfo}>Evaluation End</Text>
          <DateTemplate
            label="Evaluation End"
            dateState={evaluationEnd ?? null}
            setDateState={setEvaluationEnd}
            show={showEvaluationEndPicker}
            setShow={setShowEvaluationEndPicker}
          />
          {/* event category */}
          <Text style={styles.textInfo}>Event Category</Text>
          <TextInput
            style={styles.input}
            value={eventCategory}
            onChangeText={setEventCategory}
          />

          {/* Organization Name */}
          <Text style={styles.textInfo}>Organization Name</Text>
          <TextInput
            style={styles.input}
            value={organizerName}
            onChangeText={setOrganizerName}
          />

          {/* Organization email */}
          <Text style={styles.textInfo}>Organization Email</Text>
          <TextInput
            style={styles.input}
            value={organizerEmail}
            onChangeText={setOrganizerEmail}
          />

          {/* Event Agenda */}
          <Text style={styles.textInfo}>Agenda</Text>
          {/* <FlatList
            data={event?.eventAgendas ?? []}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View>
                <Text>{item.agendaTime}</Text>
                <Text>{item.agendaTitle}</Text>
                <Text>{item.agendaHost}</Text>
              </View>
            )}
          /> */}
          <FlatList
            data={eventAgenda ?? []}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={{ marginBottom: 15 }}>
                <TextInput
                  style={styles.input}
                  value={item.agendaTime}
                  placeholder="Time"
                  onChangeText={(text) =>
                    updateAgenda(index, "agendaTime", text)
                  }
                />

                <TextInput
                  style={styles.input}
                  value={item.agendaTitle}
                  placeholder="Title"
                  onChangeText={(text) =>
                    updateAgenda(index, "agendaTitle", text)
                  }
                />

                <TextInput
                  style={styles.input}
                  value={item.agendaHost}
                  placeholder="Host"
                  onChangeText={(text) =>
                    updateAgenda(index, "agendaHost", text)
                  }
                />

                <TouchableOpacity
                  style={{
                    backgroundColor: "#ff4444",
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 8,
                  }}
                  onPress={() => deleteAgenda(index)}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponent={
              <TouchableOpacity
                style={{
                  backgroundColor: "#4CAF50",
                  padding: 12,
                  borderRadius: 5,
                  marginTop: 10,
                }}
                onPress={addAgenda}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  + Add Agenda
                </Text>
              </TouchableOpacity>
            }
          />

          {/* Evaluation Question */}
          <Text style={styles.textInfo}>Evaluation Questions</Text>
          <FlatList
            data={eventEvaluationQuestion ?? []}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={{ marginBottom: 15 }}>
                <TextInput
                  style={styles.input}
                  value={item.questionText}
                  placeholder="Question"
                  onChangeText={(text) =>
                    updateEvaluationQuestion(index, "questionText", text)
                  }
                />

                <TouchableOpacity
                  style={{
                    backgroundColor: "#ff4444",
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 8,
                  }}
                  onPress={() => deleteEvaluationQuestion(index)}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponent={
              <TouchableOpacity
                style={{
                  backgroundColor: "#4CAF50",
                  padding: 12,
                  borderRadius: 5,
                  marginTop: 10,
                }}
                onPress={addEvaluationQuestion}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  + Add Question
                </Text>
              </TouchableOpacity>
            }
          />

          {/* --- Request for approval event --- */}
          <TouchableOpacity
            style={[styles.submitBtn]}
            onPress={updateEventToCloud}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Approve Event</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditEvent;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: COLORS.Primary,
  },
  textInfo: {
    marginLeft: 7,
    fontSize: 14,
    fontWeight: 700,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginVertical: 6,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  rowInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
  },
  rowText: { fontSize: 16 },
  imageBtn: {
    backgroundColor: COLORS.Primary,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    marginTop: 10,
  },
  imageBtnText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  imagePreview: { width: "100%", height: 200, borderRadius: 10, marginTop: 10 },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    color: COLORS.Primary,
  },
  addBtn: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 6,
  },
  addBtnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  listItem: { marginLeft: 10, marginTop: 4, color: "#333" },
  submitBtn: {
    backgroundColor: COLORS.Primary,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 20,
  },
  btnPickPhoto: {
    margin: "auto",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#28a745",
    borderRadius: 10,
  },
  btnPickPhotoText: {
    textAlign: "center",
    fontWeight: 700,
    color: "white",
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  backText: { color: COLORS.Primary, fontWeight: "600", fontSize: 16 },
});
