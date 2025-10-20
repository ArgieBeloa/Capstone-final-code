import { createEvent } from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ArrowLeft, Calendar, Clock, ImageIcon } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

const AddEventScreen = () => {
  const { studentToken } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // --- FORM STATES ---
  const [eventTitle, setEventTitle] = useState("");
  const [eventShortDescription, setEventShortDescription] = useState("");
  const [eventBody, setEventBody] = useState("");
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [eventStartTime, setEventStartTime] = useState<Date | null>(null);
  const [eventEndTime, setEventEndTime] = useState<Date | null>(null);
  const [eventLocation, setEventLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [eventImage, setEventImage] = useState<string | null>(null);

  const [eventAgendas, setEventAgendas] = useState<
    { agendaTitle: string; agendaTime: string; agendaHost: string }[]
  >([]);
  const [evaluationQuestions, setEvaluationQuestions] = useState<
    { questionId: string; questionText: string }[]
  >([]);

  const [agendaTitle, setAgendaTitle] = useState("");
  const [agendaTime, setAgendaTime] = useState("");
  const [agendaHost, setAgendaHost] = useState("");
  const [questionText, setQuestionText] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const isFormValid =
    eventTitle &&
    eventShortDescription &&
    eventBody &&
    eventDate &&
    eventStartTime &&
    eventEndTime &&
    eventLocation &&
    eventCategory &&
    organizerName &&
    organizerEmail;

  // --- IMAGE PICKER ---
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0].base64) {
      setEventImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  // --- PICKERS ---
  const handleDateChange = (_: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) setEventDate(selected);
  };
  const handleStartTimeChange = (_: any, selected?: Date) => {
    setShowStartTimePicker(false);
    if (selected) setEventStartTime(selected);
  };
  const handleEndTimeChange = (_: any, selected?: Date) => {
    setShowEndTimePicker(false);
    if (selected) setEventEndTime(selected);
  };

  // --- AGENDA & QUESTION ---
  const addAgenda = () => {
    if (!agendaTitle || !agendaTime || !agendaHost)
      return Alert.alert("Error", "Please fill all agenda fields.");
    setEventAgendas([...eventAgendas, { agendaTitle, agendaTime, agendaHost }]);
    setAgendaTitle("");
    setAgendaTime("");
    setAgendaHost("");
  };

  const addQuestion = () => {
    if (!questionText)
      return Alert.alert("Error", "Please enter a question.");
    setEvaluationQuestions([
      ...evaluationQuestions,
      { questionId: Date.now().toString(), questionText },
    ]);
    setQuestionText("");
  };

  // --- SUBMIT ---
  const submitEvent = async () => {
    if (!isFormValid) return Alert.alert("Error", "Please fill all fields.");
    setLoading(true);
    try {
      const formattedDate = eventDate?.toISOString().split("T")[0] || "";
      const formattedStart = eventStartTime?.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const formattedEnd = eventEndTime?.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newEvent: EventModel = {
        eventTitle,
        eventShortDescription,
        eventBody,
        allStudentAttending: 0,
        eventDate: formattedDate,
        eventTime: `${formattedStart} - ${formattedEnd}`,
        eventLocation,
        eventCategory,
        eventTimeLength: "",
        eventImage: eventImage || "",
        eventOrganizer: { organizerName, organizerEmail },
        eventAttendances: [],
        eventAgendas,
        evaluationQuestions,
        eventEvaluationDetails: [],
      };

      await createEvent(newEvent, studentToken);
      Alert.alert("✅ Success", "Event created successfully!");
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("❌ Error", "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ArrowLeft color={COLORS.Primary} size={24} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>🗓️ Add New Event</Text>

      {/* --- Event Info --- */}
      <TextInput placeholder="Event Title" style={styles.input} value={eventTitle} onChangeText={setEventTitle} />
      <TextInput placeholder="Short Description" style={styles.input} value={eventShortDescription} onChangeText={setEventShortDescription} />
      <TextInput placeholder="Event Details" style={[styles.input, styles.textArea]} multiline value={eventBody} onChangeText={setEventBody} />

      {/* Date Picker */}
      <TouchableOpacity style={styles.rowInput} onPress={() => setShowDatePicker(true)}>
        <Calendar color={COLORS.Primary} />
        <Text style={styles.rowText}>{eventDate ? eventDate.toISOString().split("T")[0] : "Pick Event Date"}</Text>
      </TouchableOpacity>
      {showDatePicker && <DateTimePicker mode="date" value={eventDate || new Date()} onChange={handleDateChange} />}

      {/* Start Time */}
      <TouchableOpacity style={styles.rowInput} onPress={() => setShowStartTimePicker(true)}>
        <Clock color={COLORS.Primary} />
        <Text style={styles.rowText}>
          {eventStartTime
            ? `Start: ${eventStartTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : "Pick Start Time"}
        </Text>
      </TouchableOpacity>
      {showStartTimePicker && <DateTimePicker mode="time" value={eventStartTime || new Date()} onChange={handleStartTimeChange} />}

      {/* End Time */}
      <TouchableOpacity style={styles.rowInput} onPress={() => setShowEndTimePicker(true)}>
        <Clock color={COLORS.Primary} />
        <Text style={styles.rowText}>
          {eventEndTime
            ? `End: ${eventEndTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : "Pick End Time"}
        </Text>
      </TouchableOpacity>
      {showEndTimePicker && <DateTimePicker mode="time" value={eventEndTime || new Date()} onChange={handleEndTimeChange} />}

      {/* Other Inputs */}
      <TextInput placeholder="Event Location" style={styles.input} value={eventLocation} onChangeText={setEventLocation} />
      <TextInput placeholder="Event Category (e.g. Health)" style={styles.input} value={eventCategory} onChangeText={setEventCategory} />
      <TextInput placeholder="Organizer Name" style={styles.input} value={organizerName} onChangeText={setOrganizerName} />
      <TextInput placeholder="Organizer Email" style={styles.input} value={organizerEmail} onChangeText={setOrganizerEmail} />

      {/* --- Image Picker --- */}
      <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
        <ImageIcon color="#fff" />
        <Text style={styles.imageBtnText}>
          {eventImage ? "✅ Image Selected" : "Pick Event Image"}
        </Text>
      </TouchableOpacity>
      {eventImage && <Image source={{ uri: eventImage }} style={styles.imagePreview} />}

      {/* --- Agendas --- */}
      <Text style={styles.sectionHeader}>📋 Event Agendas</Text>
      <TextInput placeholder="Agenda Title" style={styles.input} value={agendaTitle} onChangeText={setAgendaTitle} />
      <TextInput placeholder="Agenda Time" style={styles.input} value={agendaTime} onChangeText={setAgendaTime} />
      <TextInput placeholder="Agenda Host" style={styles.input} value={agendaHost} onChangeText={setAgendaHost} />
      <TouchableOpacity style={styles.addBtn} onPress={addAgenda}>
        <Text style={styles.addBtnText}>+ Add Agenda</Text>
      </TouchableOpacity>

      {eventAgendas.map((a, i) => (
        <Text key={i} style={styles.listItem}>
          • {a.agendaTime} - {a.agendaTitle} ({a.agendaHost})
        </Text>
      ))}

      {/* --- Evaluation Questions --- */}
      <Text style={styles.sectionHeader}>📝 Evaluation Questions</Text>
      <TextInput placeholder="Enter question" style={styles.input} value={questionText} onChangeText={setQuestionText} />
      <TouchableOpacity style={styles.addBtn} onPress={addQuestion}>
        <Text style={styles.addBtnText}>+ Add Question</Text>
      </TouchableOpacity>
      {evaluationQuestions.map((q, i) => (
        <Text key={i} style={styles.listItem}>• {q.questionText}</Text>
      ))}

      {/* --- Submit --- */}
      <TouchableOpacity
        style={[styles.submitBtn, { opacity: isFormValid ? 1 : 0.6 }]}
        disabled={!isFormValid || loading}
        onPress={submitEvent}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit Event</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddEventScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 16, textAlign: "center", color: COLORS.Primary },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, fontSize: 16, marginVertical: 6 },
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
  sectionHeader: { fontSize: 18, fontWeight: "600", marginTop: 20, color: COLORS.Primary },
  addBtn: { backgroundColor: "#28a745", borderRadius: 10, paddingVertical: 10, marginTop: 6 },
  addBtnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  listItem: { marginLeft: 10, marginTop: 4, color: "#333" },
  submitBtn: { backgroundColor: COLORS.Primary, borderRadius: 10, paddingVertical: 14, marginTop: 20 },
  submitText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "700" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  backText: { color: COLORS.Primary, fontWeight: "600", fontSize: 16 },
});
