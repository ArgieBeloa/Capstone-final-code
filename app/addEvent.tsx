import { addEvent, EventPayload } from "@/api/AddEventOfficer";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import ErrorModal from "@/components/ErrorModal";
import LinearbackGround from "@/components/LinearBackGround";
import Loading from "@/components/Loading";
import Mymodal from "@/components/Mymodal";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";

const Event = () => {
  // userContext
  const { studentToken } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [successModalVisible, setSuccessModalVisible] =
    useState<boolean>(false);
  const [errorModel, setErrorModal] = useState<boolean>(false);

  // Event fields
  const [eventTitle, setEventTitle] = useState("");
  const [eventShortDescription, setEventShortDescription] = useState("");
  const [eventBody, setEventBody] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [eventTimeLength, setEventTimeLength] = useState("");

  // Organizer
  const [organizerName, setOrganizerName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");

  // Agendas
  const [eventAgendas, setEventAgendas] = useState<
    { agendaTime: string; agendaTitle: string; agendaHost: string }[]
  >([]);

  // Evaluation questions
  const [evaluationQuestions, setEvaluationQuestions] = useState<
    { questionId: string; questionText: string }[]
  >([]);

  // Add agenda
  const addAgenda = () => {
    setEventAgendas([
      ...eventAgendas,
      { agendaTime: "", agendaTitle: "", agendaHost: "" },
    ]);
  };

  // Update agenda
  const updateAgenda = (index: number, field: string, value: string) => {
    const updated = [...eventAgendas];
    updated[index] = { ...updated[index], [field]: value };
    setEventAgendas(updated);
  };

  // Add evaluation question
  const addQuestion = () => {
    setEvaluationQuestions([
      ...evaluationQuestions,
      {
        questionId: (evaluationQuestions.length + 1).toString(),
        questionText: "",
      },
    ]);
  };

  // Update question
  const updateQuestion = (index: number, value: string) => {
    const updated = [...evaluationQuestions];
    updated[index].questionText = value;
    setEvaluationQuestions(updated);
  };

  const submitEvent = async () => {
    setLoading(true);
    try {
      const payload: EventPayload = {
        eventTitle,
        eventShortDescription,
        eventBody,
        eventDate,
        eventTime,
        eventLocation,
        eventCategory,
        eventTimeLength,
        allStudentAttending: 0,
        eventAgendas,
        eventStats: { attending: 0, interested: 0 },
        eventOrganizer: {
          organizerName,
          organizerEmail,
        },
        evaluationQuestions,
        eventEvaluationDetails: [],
        eventPerformanceDetails: [],
        eventStudentEvaluations: [],
        eventAveragePerformance: 0.0,
      };

      const result = await addEvent(studentToken, payload);
      setSuccessModalVisible(true);

      console.log("Server response:", result);
    } catch (error) {
      setErrorModal(true);
      console.error("❌ Error while adding event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearbackGround>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Add Event</Text>

          {/* Event Info */}
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
            style={[styles.input, { height: 100 }]}
            placeholder="Event Body"
            value={eventBody}
            onChangeText={setEventBody}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Event Date (YYYY-MM-DD)"
            value={eventDate}
            onChangeText={setEventDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Event Time (e.g., 08:00 AM)"
            value={eventTime}
            onChangeText={setEventTime}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={eventLocation}
            onChangeText={setEventLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={eventCategory}
            onChangeText={setEventCategory}
          />
          <TextInput
            style={styles.input}
            placeholder="Event Time Length"
            value={eventTimeLength}
            onChangeText={setEventTimeLength}
          />

          {/* Organizer */}
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

          {/* Agendas */}
          <Text style={styles.subHeader}>Agendas</Text>
          {eventAgendas.map((agenda, index) => (
            <View key={index} style={styles.card}>
              <TextInput
                style={styles.input}
                placeholder="Agenda Time"
                value={agenda.agendaTime}
                onChangeText={(text) => updateAgenda(index, "agendaTime", text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Agenda Title"
                value={agenda.agendaTitle}
                onChangeText={(text) =>
                  updateAgenda(index, "agendaTitle", text)
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Agenda Host"
                value={agenda.agendaHost}
                onChangeText={(text) => updateAgenda(index, "agendaHost", text)}
              />
            </View>
          ))}
          <TouchableOpacity style={styles.addBtn} onPress={addAgenda}>
            <Text style={styles.addBtnText}>+ Add Agenda</Text>
          </TouchableOpacity>

          {/* Evaluation Questions */}
          <Text style={styles.subHeader}>Evaluation Questions</Text>
          {evaluationQuestions.map((q, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={`Question ${index + 1}`}
              value={q.questionText}
              onChangeText={(text) => updateQuestion(index, text)}
            />
          ))}
          <TouchableOpacity style={styles.addBtn} onPress={addQuestion}>
            <Text style={styles.addBtnText}>+ Add Question</Text>
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity style={styles.submitBtn} onPress={submitEvent}>
            <Text style={styles.submitText}>Submit Event</Text>
          </TouchableOpacity>

          {/* modal */}

          <Mymodal
            visible={successModalVisible}
            onClose={() => setSuccessModalVisible(false)}
            message="Event created successfully!"
            redirectPath="/(officer)/home"
            buttonLabel="Home" // ✅ custom button text
          />
          <ErrorModal
            visible={errorModel}
            onClose={() => setErrorModal(false)}
          />
        </ScrollView>
        <Loading text="Please wait..." color="#4F46E5" visible={loading} />
      </KeyboardAvoidingView>
    </LinearbackGround>
  );
};

export default Event;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    paddingBottom: 50,
    // backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",

    marginBottom: 10,
  },
  card: {
    // backgroundColor: "#f9f9f9",
    backgroundColor: "#fff",

    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addBtn: {
    backgroundColor: "#fff",

    padding: 10,
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 15,
  },
  addBtnText: {
    color: "#333",
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: COLORS.Primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
