import { addEvent, EventPayload } from "@/api/AddEventOfficer";
import {
  addStudentNotification,
  getAllStudents,
  sendExpoNotification,
} from "@/api/StudentService";
import ErrorModal from "@/components/ErrorModal";
import LinearbackGround from "@/components/LinearBackGround";
import Loading from "@/components/Loading";
import Mymodal from "@/components/Mymodal";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { Entypo } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type EventData = {
  id?: string;
  eventTitle: string;
  eventShortDescription: string;
  eventBody: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventCategory: string;
  eventTimeLength: string;
  allStudentAttending: number;
  eventAgendas: { agendaTime: string; agendaTitle: string; agendaHost: string }[];
  eventStats: { attending: number; interested: number };
  eventOrganizer: { organizerName: string; organizerEmail: string };
  evaluationQuestions: { questionId: string; questionText: string }[];
  eventEvaluationDetails: any[];
  eventPerformanceDetails: any[];
  eventStudentEvaluations: any[];
  eventAveragePerformance: number;
  attendanceRate: number | null;
  evaluationAvg: number | null;
  eventAttendances: any[] | null;
};

const AddEventScreen = () => {
  const { studentToken } = useUser();
  const router = useRouter();

  const [allStudentId, setAllStudentId] = useState<string[]>([]);
  const [allToken, setAllToken] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Event fields
  const [eventTitle, setEventTitle] = useState("");
  const [eventShortDescription, setEventShortDescription] = useState("");
  const [eventBody, setEventBody] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [eventTimeStart, setEventTimeStart] = useState("");
  const [eventTimeEnd, setEventTimeEnd] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEventTimePicker, setShowEventTimePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [eventAgendas, setEventAgendas] = useState<
    { agendaTime: string; agendaTitle: string; agendaHost: string }[]
  >([]);
  const [evaluationQuestions, setEvaluationQuestions] = useState<
    { questionId: string; questionText: string }[]
  >([]);

  const [newEvent, setNewEvent] = useState<EventData | null>(null);

  const requiredFields = [
    eventTitle,
    eventShortDescription,
    eventBody,
    eventDate,
    eventTime,
    eventLocation,
    eventCategory,
    organizerName,
    organizerEmail,
  ];

  const isFormValid =
    requiredFields.every((f) => f.trim() !== "") &&
    eventAgendas.length > 0 &&
    evaluationQuestions.length > 0;

  const addAgenda = () =>
    setEventAgendas([
      ...eventAgendas,
      { agendaTime: "", agendaTitle: "", agendaHost: "" },
    ]);

  const updateAgenda = (index: number, field: string, value: string) => {
    const updated = [...eventAgendas];
    updated[index] = { ...updated[index], [field]: value };
    setEventAgendas(updated);
  };

  const addQuestion = () =>
    setEvaluationQuestions([
      ...evaluationQuestions,
      {
        questionId: (evaluationQuestions.length + 1).toString(),
        questionText: "",
      },
    ]);

  const updateQuestion = (index: number, value: string) => {
    const updated = [...evaluationQuestions];
    updated[index].questionText = value;
    setEvaluationQuestions(updated);
  };

  const submitEvent = async () => {
    setFormSubmitted(true);
    if (!isFormValid) return;

    setLoading(true);
    try {
      const eventTimeLengthNew = `${eventTimeStart} - ${eventTimeEnd}`;
      const payload: EventPayload = {
        eventTitle,
        eventShortDescription,
        eventBody,
        eventDate,
        eventTime,
        eventLocation,
        eventCategory,
        eventTimeLength: eventTimeLengthNew,
        allStudentAttending: 0,
        eventAgendas,
        eventStats: { attending: 0, interested: 0 },
        eventOrganizer: { organizerName, organizerEmail },
        evaluationQuestions,
        eventEvaluationDetails: [],
        eventPerformanceDetails: [],
        eventStudentEvaluations: [],
        eventAveragePerformance: 0.0,
        attendanceRate: null,
        evaluationAvg: null,
        eventAttendances: null,
      };

      const result = await addEvent(studentToken, payload);
      setNewEvent(result);

      await sendExpoNotification({
        tokens: allToken,
        title: eventTitle,
        message: eventShortDescription,
      });

      for (const id of allStudentId) {
        await addStudentNotification(studentToken, id, [
          { eventId: result?.id, eventTitle, eventShortDescription },
        ]);
      }

      setSuccessModalVisible(true);
    } catch (error) {
      console.error("❌ Error while adding event:", error);
      setErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const students = await getAllStudents(studentToken);
      setAllToken(students.map((s: { tokenId: string }) => s.tokenId));
      setAllStudentId(students.map((s: { id: string }) => s.id));
    };
    fetchStudents();
  }, []);

  return (
    <LinearbackGround>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Add Event</Text>

          <Pressable
            onPress={() => router.push("/(officer)/home")}
            style={{ position: "absolute", top: 30, left: 10 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Entypo name="back" size={30} color="black" />
              <Text style={styles.backText}>Back</Text>
            </View>
          </Pressable>

          {/* Inputs */}
          <TextInput
            style={styles.input}
            placeholder="Event Title"
            value={eventTitle}
            onChangeText={setEventTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Short Description"
            value={eventShortDescription}
            onChangeText={setEventShortDescription}
          />
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            placeholder="Event Body"
            value={eventBody}
            onChangeText={setEventBody}
            multiline
          />

          {/* DATE PICKER */}
          <Text style={styles.subHeader}>Event Date</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerText}>
              {eventDate || "Select Date"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              onChange={(event, selectedDate) => {
                if (selectedDate)
                  setEventDate(selectedDate.toISOString().split("T")[0]);
                setShowDatePicker(false);
              }}
            />
          )}

          {/* TIME PICKERS */}
          <Text style={styles.subHeader}>Main Event Time</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowEventTimePicker(true)}
          >
            <Text style={styles.datePickerText}>
              {eventTime || "Select Time"}
            </Text>
          </TouchableOpacity>
          {showEventTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              onChange={(event, selectedTime) => {
                if (selectedTime) {
                  const time = selectedTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  setEventTime(time);
                }
                setShowEventTimePicker(false);
              }}
            />
          )}

          <Text style={styles.subHeader}>Start Time</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowStartTimePicker(true)}
          >
            <Text style={styles.datePickerText}>
              {eventTimeStart || "Select Start Time"}
            </Text>
          </TouchableOpacity>
          {showStartTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              onChange={(event, selectedTime) => {
                if (selectedTime) {
                  const time = selectedTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  setEventTimeStart(time);
                }
                setShowStartTimePicker(false);
              }}
            />
          )}

          <Text style={styles.subHeader}>End Time</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowEndTimePicker(true)}
          >
            <Text style={styles.datePickerText}>
              {eventTimeEnd || "Select End Time"}
            </Text>
          </TouchableOpacity>
          {showEndTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              onChange={(event, selectedTime) => {
                if (selectedTime) {
                  const time = selectedTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  setEventTimeEnd(time);
                }
                setShowEndTimePicker(false);
              }}
            />
          )}

          {/* LOCATION PICKER */}
          <Text style={styles.subHeader}>Location</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={eventLocation}
              onValueChange={(v) => setEventLocation(v)}
            >
              <Picker.Item label="Select Location..." value="" />
              <Picker.Item label="Auditorium" value="Auditorium" />
              <Picker.Item label="SLEC" value="Slec" />
              <Picker.Item label="CPC Main" value="CPC Main" />
              <Picker.Item label="CPC Engineering" value="CPC Engineering" />
              <Picker.Item label="Announce later" value="Announce later" />
            </Picker>
          </View>

          {/* CATEGORY PICKER */}
          <Text style={styles.subHeader}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={eventCategory}
              onValueChange={(v) => setEventCategory(v)}
            >
              <Picker.Item label="Select Category..." value="Others" />
              <Picker.Item label="Technology" value="Technology" />
              <Picker.Item label="Health" value="Health" />
              <Picker.Item label="Academic" value="Academic" />
              <Picker.Item label="Others" value="Others" />
            </Picker>
          </View>

          {/* ORGANIZER */}
          <Text style={styles.subHeader}>Organizer</Text>
          <TextInput
            style={styles.input}
            placeholder="Organizer Name"
            value={organizerName}
            onChangeText={setOrganizerName}
          />
          <TextInput
            style={styles.input}
            placeholder="Organizer Email"
            value={organizerEmail}
            onChangeText={setOrganizerEmail}
          />

          {/* AGENDAS */}
          <Text style={styles.subHeader}>Agendas</Text>
          {eventAgendas.map((agenda, index) => (
            <View key={index} style={styles.card}>
              <TextInput
                style={styles.input}
                placeholder="Agenda Time"
                value={agenda.agendaTime}
                onChangeText={(t) => updateAgenda(index, "agendaTime", t)}
              />
              <TextInput
                style={styles.input}
                placeholder="Agenda Title"
                value={agenda.agendaTitle}
                onChangeText={(t) => updateAgenda(index, "agendaTitle", t)}
              />
              <TextInput
                style={styles.input}
                placeholder="Agenda Host"
                value={agenda.agendaHost}
                onChangeText={(t) => updateAgenda(index, "agendaHost", t)}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.addBtn} onPress={addAgenda}>
            <Text style={styles.addBtnText}>+ Add Agenda</Text>
          </TouchableOpacity>

          {/* QUESTIONS */}
          <Text style={styles.subHeader}>Evaluation Questions</Text>
          {evaluationQuestions.map((q, i) => (
            <TextInput
              key={i}
              style={styles.input}
              placeholder={`Question ${i + 1}`}
              value={q.questionText}
              onChangeText={(t) => updateQuestion(i, t)}
            />
          ))}
          <TouchableOpacity style={styles.addBtn} onPress={addQuestion}>
            <Text style={styles.addBtnText}>+ Add Question</Text>
          </TouchableOpacity>

          {/* SUBMIT */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!isFormValid || loading) && { backgroundColor: "#ccc" },
            ]}
            disabled={!isFormValid || loading}
            onPress={submitEvent}
          >
            <Text style={styles.submitText}>
              {loading ? "Submitting..." : "Submit Event"}
            </Text>
          </TouchableOpacity>

          <Mymodal
            visible={successModalVisible}
            onClose={() => setSuccessModalVisible(false)}
            message="Event created successfully!"
            redirectPath="/(officer)/home"
            buttonLabel="Home"
          />
          <ErrorModal visible={errorModal} onClose={() => setErrorModal(false)} />
        </ScrollView>
        <Loading text="Please wait..." color="#4F46E5" visible={loading} />
      </KeyboardAvoidingView>
    </LinearbackGround>
  );
};

export default AddEventScreen;

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, paddingBottom: 200 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  subHeader: { fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    alignItems: "center",
  },
  datePickerText: { fontSize: 16, color: "#333" },
  card: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginBottom: 10 },
  addBtn: { backgroundColor: "#fff", padding: 10, alignItems: "center", borderRadius: 8 },
  addBtnText: { color: "#333", fontWeight: "600" },
  submitBtn: {
    backgroundColor: COLORS.Primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  backText: { marginLeft: 10, fontSize: 18, fontWeight: "600" },
});
