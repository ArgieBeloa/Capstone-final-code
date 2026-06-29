import {
  addStudentNotificationToAll,
  getAllStudents,
  getEvaluationTemplate,
  sendExpoNotification,
} from "@/api/admin/controller";
import {
  createEvent,
  pickImageFromGallery,
  uploadEventImage,
} from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import { StudentNotification } from "@/api/students/utils";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { ArrowLeft, Clock } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { evaluationTemplates, id } from "@/api/admin/utils";
import { EvaluationQuestion, PickedImage } from "@/api/events/utils";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AddEventScreen = () => {
  const { studentToken, studentData } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newEventData, setNewEventData] = useState<EventModel | null>(null);

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
    EvaluationQuestion[]
  >([
    // {
    //   questionId: "1",
    //   questionText: "The over-all preparation in the conduct of the activity",
    // },
    // {
    //   questionId: "2",
    //   questionText:
    //     "Alignment of the seminar/conference to VMGO of the college Importance and applicability",
    // },
    // {
    //   questionId: "3",
    //   questionText: "Venue and Accommodation of the activity",
    // },
    // {
    //   questionId: "4",
    //   questionText: "Timing/Phasing and Scheduling of the activity",
    // },
    // {
    //   questionId: "5",
    //   questionText:
    //     "Dynamic inter-action among facilitator/s and participants during the activity",
    // },
  ]);
  const [evaluationTemplateState, setEvaluationTemplateState] = useState<
    evaluationTemplates[]
  >([]);

  const [agendaTitle, setAgendaTitle] = useState("");
  const [agendaTime, setAgendaTime] = useState("");
  const [agendaHost, setAgendaHost] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [evaluationStart, setEvaluationStart] = useState<Date | null>(null);
  const [evaluationEnd, setEvaluationEnd] = useState<Date | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [showEvaluationStartPicker, setShowEvaluationStartPicker] =
    useState(false);
  const [showEvaluationEndPicker, setShowEvaluationEndPicker] = useState(false);

  const selectedTemplate = evaluationTemplateState.find(
    (t) => t.id === selectedTemplateId,
  );
  const [image, setImage] = useState<PickedImage | null>(null);

  const [allTokens, setAllTokens] = useState<{ notificationId: string }[]>([]);

  const isFormValid =
    eventTitle &&
    eventShortDescription &&
    eventBody &&
    eventDate &&
    eventStartTime &&
    eventEndTime &&
    evaluationStart &&
    evaluationEnd &&
    eventLocation &&
    eventCategory &&
    organizerName &&
    organizerEmail;

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
    if (!questionText) return Alert.alert("Error", "Please enter a question.");
    setEvaluationQuestions([
      ...evaluationQuestions,
      { questionId: Date.now().toString(), questionText },
    ]);
    setQuestionText("");
  };
  useEffect(() => {
    const getTemplate = async () => {
      try {
        const template = await getEvaluationTemplate(
          id as string,
          studentToken,
        );

        setEvaluationTemplateState(template);
      } catch (error) {
        console.log(error);
      }
    };

    getTemplate();
  }, [id, studentToken]);

  useEffect(() => {
    setEvaluationQuestions([]);
    if (!selectedTemplate) return;

    const questions = selectedTemplate.evaluationQuestions.map((item) => ({
      questionId: item.questionId,
      questionText: item.questionText,
    }));

    setEvaluationQuestions(questions);
  }, [selectedTemplate]);

  // --- SUBMIT ---
  const submitEvent = async () => {
    if (!isFormValid) return Alert.alert("Error", "Please fill all fields.");
    setLoading(true);
    try {
      // const formattedDate = eventDate?.toISOString().split("T")[0] || "";
      // const formattedStart = eventStartTime?.toLocaleTimeString([], {
      //   hour: "2-digit",
      //   minute: "2-digit",
      // });
      // const formattedEnd = eventEndTime?.toLocaleTimeString([], {
      //   hour: "2-digit",
      //   minute: "2-digit",
      // });

      const dateString = eventDate?.toLocaleDateString("en-CA", {
        timeZone: "Asia/Manila",
      });

      const timeString = eventStartTime?.toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const eventLength = eventEndTime?.toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const newEvent: any = {
        whoPostedName: studentData.studentName,
        eventTitle,
        eventShortDescription,
        eventBody,
        allStudentAttending: 0,
        eventDate: dateString,
        eventTime: timeString,
        evaluationStart: evaluationStart?.toISOString(),
        evaluationEnd: evaluationEnd?.toISOString(),
        eventLocation,
        eventCategory,
        eventTimeLength: `${timeString} - ${eventLength}`,
        eventOrganizer: { organizerName, organizerEmail },
        eventAttendances: [],
        eventAgendas,
        evaluationQuestions,
        eventEvaluationDetails: [],
        eventImageId: "", // MongoDB ObjectId of image in GridFS
        eventImageUrl: "",
      };

      //add to db
      const event = await createEvent(newEvent, studentToken);
      setNewEventData(event);

      Alert.alert("✅ Success", "Event created successfully!");
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("❌ Error", "Failed to create event.");
    }
  };

  // 📸 Pick Image using the shared function
  const handlePickPhoto = async () => {
    const selected = await pickImageFromGallery();
    if (selected) {
      setImage(selected);
      console.log("✅ Image selected:", selected.uri);
    }
  };

  // 🚀 Upload to backend
  const handleUpload = async (eventId: string, token: string) => {
    if (!image) {
      Alert.alert("Please select an image first!");
      return;
    }

    try {
      const result = await uploadEventImage(image, eventId, token);
      console.log("✅ Upload success:", result);
      Alert.alert("✅ Upload successful!");
    } catch (error: any) {
      console.error("❌ Upload failed:", error.message || error);
      Alert.alert("❌ Upload failed", error.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run this effect AFTER newEventData is set
  useEffect(() => {
    if (!newEventData) return;

    const sendNotifications = async () => {
      try {
        // add the new event to all studentNotification
        const payloadStudentNotification: StudentNotification = {
          eventId: newEventData.id,
          eventTitle: newEventData.eventTitle,
          eventShortDescription: newEventData.eventShortDescription,
        };
        await addStudentNotificationToAll(
          payloadStudentNotification,
          studentToken,
        );

        const students = await getAllStudents(studentToken);
        // get students expo token
        const notificationIds = students
          .filter((s) => !!s.notificationId)
          .map((student) => ({
            notificationId: student.notificationId,
          }));

        setAllTokens(notificationIds);
        // notify all using expo
        const extactAllTokens: string[] = allTokens.map(
          (item) => item.notificationId,
        );

        await sendExpoNotification(studentToken, {
          tokens: extactAllTokens,
          title: eventTitle,
          body: eventShortDescription,
        });

        await handleUpload(newEventData.id, studentToken);

        console.log("✅ Notifications sent to all students!");
      } catch (error) {
        console.error("❌ Error sending notifications:", error);
      }
    };

    sendNotifications();
  }, [newEventData]);

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
          {/* 🔙 Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <ArrowLeft color={COLORS.Primary} size={24} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.header}>🗓️ Add New Event</Text>

          {/* --- Event Info --- */}
          <TextInput
            placeholder="Event Title"
            style={styles.input}
            value={eventTitle}
            onChangeText={setEventTitle}
          />
          <TextInput
            placeholder="Short Description"
            style={styles.input}
            value={eventShortDescription}
            onChangeText={setEventShortDescription}
          />
          <TextInput
            placeholder="Event Details"
            style={[styles.input, styles.textArea]}
            multiline
            value={eventBody}
            onChangeText={setEventBody}
          />

          {/* Date Picker */}
          <Text style={styles.rowText}>Event Date</Text>

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
                mode="date"
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

          {/* Start Time */}
          <Text style={styles.rowText}>Event Start</Text>

          <TouchableOpacity
            style={styles.rowInput}
            onPress={() => {
              if (Platform.OS !== "web") {
                setShowStartTimePicker(true);
              }
            }}
          >
            <Clock color={COLORS.Primary} />
            <Text style={styles.rowText}>
              {eventStartTime
                ? `Start: ${eventStartTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "Pick Start Time"}
            </Text>
          </TouchableOpacity>

          {Platform.OS === "web" ? (
            <View style={{ marginVertical: 6 }}>
              <input
                type="time"
                value={
                  eventStartTime
                    ? eventStartTime.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : ""
                }
                onChange={(e) => {
                  const [hours, minutes] = e.target.value
                    .split(":")
                    .map(Number);

                  const date = eventStartTime || new Date();
                  date.setHours(hours);
                  date.setMinutes(minutes);
                  date.setSeconds(0);
                  date.setMilliseconds(0);

                  setEventStartTime(new Date(date));
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
            showStartTimePicker && (
              <DateTimePicker
                mode="time"
                value={eventStartTime || new Date()}
                display="default"
                onChange={handleStartTimeChange}
              />
            )
          )}

          {/* End Time */}
          <Text style={styles.rowText}>Event End</Text>

          <TouchableOpacity
            style={styles.rowInput}
            onPress={() => {
              if (Platform.OS !== "web") {
                setShowEndTimePicker(true);
              }
            }}
          >
            <Clock color={COLORS.Primary} />
            <Text style={styles.rowText}>
              {eventEndTime
                ? `End: ${eventEndTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "Pick End Time"}
            </Text>
          </TouchableOpacity>

          {Platform.OS === "web" ? (
            <View style={{ marginVertical: 6 }}>
              <input
                type="time"
                value={
                  eventEndTime
                    ? eventEndTime.toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : ""
                }
                onChange={(e) => {
                  const [hours, minutes] = e.target.value
                    .split(":")
                    .map(Number);

                  const date = eventEndTime || new Date();
                  date.setHours(hours);
                  date.setMinutes(minutes);
                  date.setSeconds(0);
                  date.setMilliseconds(0);

                  setEventEndTime(new Date(date));
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
            showEndTimePicker && (
              <DateTimePicker
                mode="time"
                display="default"
                value={eventEndTime || new Date()}
                onChange={handleEndTimeChange}
              />
            )
          )}

          {/* Evaluation Start */}
          <Text style={styles.rowText}>Evaluation Start</Text>

          <TouchableOpacity
            style={styles.rowInput}
            onPress={() => {
              if (Platform.OS !== "web") {
                setShowEvaluationStartPicker(true);
              }
            }}
          >
            <Clock color={COLORS.Primary} />
            <Text style={styles.rowText}>
              {evaluationStart
                ? `Evaluation Starts: ${evaluationStart.toLocaleString()}`
                : "Pick Evaluation Start"}
            </Text>
          </TouchableOpacity>

          {Platform.OS === "web" ? (
            <View style={{ marginVertical: 6 }}>
              <input
                type="datetime-local"
                value={
                  evaluationStart
                    ? new Date(
                        evaluationStart.getTime() -
                          evaluationStart.getTimezoneOffset() * 60000,
                      )
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) => {
                  if (e.target.value) {
                    setEvaluationStart(new Date(e.target.value));
                  }
                }}
                style={{
                  // width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  fontSize: "16px",
                }}
              />
            </View>
          ) : (
            showEvaluationStartPicker && (
              <DateTimePicker
                mode="datetime"
                value={evaluationStart || new Date()}
                display="default"
                onChange={(_, date) => {
                  setShowEvaluationStartPicker(false);
                  if (date) {
                    setEvaluationStart(date);
                  }
                }}
              />
            )
          )}

          {/* Evaluation End */}
          <Text style={styles.rowText}>Evaluation End</Text>

          <TouchableOpacity
            style={styles.rowInput}
            onPress={() => {
              if (Platform.OS !== "web") {
                setShowEvaluationEndPicker(true);
              }
            }}
          >
            <Clock color={COLORS.Primary} />
            <Text style={styles.rowText}>
              {evaluationEnd
                ? `Evaluation Ends: ${evaluationEnd.toLocaleString()}`
                : "Pick Evaluation End"}
            </Text>
          </TouchableOpacity>

          {Platform.OS === "web" ? (
            <View style={{ marginVertical: 6 }}>
              <input
                type="datetime-local"
                value={
                  evaluationEnd
                    ? new Date(
                        evaluationEnd.getTime() -
                          evaluationEnd.getTimezoneOffset() * 60000,
                      )
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) => {
                  if (e.target.value) {
                    setEvaluationEnd(new Date(e.target.value));
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
            showEvaluationEndPicker && (
              <DateTimePicker
                mode="datetime"
                value={evaluationEnd || new Date()}
                display="default"
                onChange={(_, date) => {
                  setShowEvaluationEndPicker(false);
                  if (date) {
                    setEvaluationEnd(date);
                  }
                }}
              />
            )
          )}
          {/* Other Inputs */}
          <Picker
            selectedValue={eventLocation}
            onValueChange={(itemValue) => setEventLocation(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Select Location" value="" />
            <Picker.Item label="Auditorium" value="Auditorium" />
            <Picker.Item label="Slec" value="Slec" />
            <Picker.Item label="CPC Main" value="CPC main" />
            <Picker.Item label="CPC Boulevard" value="CPC Boulevard" />
            <Picker.Item label="SM" value="SM" />
            <Picker.Item label="none" value="none" />
          </Picker>

          <Picker
            selectedValue={eventCategory}
            onValueChange={(itemValue) => setEventCategory(itemValue)}
            style={[styles.input]}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Technology" value="Technology" />
            <Picker.Item label="Health" value="Health" />
            <Picker.Item label="Academic" value="Academic" />
            <Picker.Item label="Others" value="Others" />
          </Picker>
          <TouchableOpacity
            onPress={handlePickPhoto}
            style={styles.btnPickPhoto}
          >
            <Text style={styles.btnPickPhotoText}>Upload Photo</Text>
          </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image.uri }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 10,
                marginBottom: 10,
                alignSelf: "center",
              }}
            />
          )}

          {/* Upload image only AFTER event is created */}
          {/* {newEventData && (
            <UploadEventImage eventId={newEventData.id} token={studentToken} />
          )} */}

          <TextInput
            placeholder="Organizer Name"
            style={styles.input}
            value={organizerName}
            onChangeText={setOrganizerName}
          />
          <TextInput
            placeholder="Organizer Email"
            style={styles.input}
            value={organizerEmail}
            onChangeText={setOrganizerEmail}
          />
          {/* --- Agendas --- */}
          <Text style={styles.sectionHeader}>📋 Event Agendas</Text>
          <TextInput
            placeholder="Agenda Title"
            style={styles.input}
            value={agendaTitle}
            onChangeText={setAgendaTitle}
          />
          <TextInput
            placeholder="Agenda Time"
            style={styles.input}
            value={agendaTime}
            onChangeText={setAgendaTime}
          />
          <TextInput
            placeholder="Agenda Host"
            style={styles.input}
            value={agendaHost}
            onChangeText={setAgendaHost}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addAgenda}>
            <Text style={styles.addBtnText}>+ Add Agenda</Text>
          </TouchableOpacity>

          {eventAgendas.map((a, i) => (
            <Text key={i} style={styles.listItem}>
              • {a.agendaTime} - {a.agendaTitle} ({a.agendaHost})
            </Text>
          ))}

          {/* --- Evaluation Questions --- */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.sectionHeader}>📝 Evaluation Questions</Text>
            <Picker
              selectedValue={selectedTemplateId}
              onValueChange={(value) => setSelectedTemplateId(value)}
              style={{
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                color: "#000",
              }}
            >
              <Picker.Item
                label="Select Evaluation Template"
                value=""
                enabled={false}
                color="#999"
              />

              {evaluationTemplateState.map((template) => (
                <Picker.Item
                  key={template.id}
                  label={template.templateName}
                  value={template.id}
                />
              ))}
            </Picker>
          </View>
          <TextInput
            placeholder="Enter question"
            style={styles.input}
            value={questionText}
            onChangeText={setQuestionText}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addQuestion}>
            <Text style={styles.addBtnText}>+ Add Question</Text>
          </TouchableOpacity>
          {evaluationQuestions.map((q, i) => (
            <Text key={i} style={styles.listItem}>
              • {q.questionText}
            </Text>
          ))}

          {/* --- Submit --- */}
          <TouchableOpacity
            style={[styles.submitBtn, { opacity: isFormValid ? 1 : 0.6 }]}
            disabled={!isFormValid || loading}
            onPress={submitEvent}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit Event</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddEventScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: COLORS.Primary,
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
