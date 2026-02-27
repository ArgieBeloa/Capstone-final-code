import { getEventById, updateEvent } from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const EditEvent = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { studentToken } = useUser();

  const [event, setEvent] = useState<EventModel>();
  const [eventTitle, setEventTitle] = useState("");
  const [eventShortDescription, setEventShortDescription] = useState("");
  const [eventBody, setEventBody] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");

  const [loading, setLoading] = useState(false);

  // --- SUBMIT ---
  const updateEventToCloud = async () => {
    if (!id) {
      Alert.alert("Error", "Event ID not found.");
      return;
    }

    setLoading(true);

    try {
      const updatedEvent: EventModel = {
        ...event, // keep existing values
        eventTitle,
        eventShortDescription,
        eventBody,
        eventLocation,
        eventCategory,
        eventTimeLength: eventTime,
        eventDate,
        eventOrganizer: {
          organizerName,
          organizerEmail,
        },
      } as EventModel;

      const res = await updateEvent(id as string, updatedEvent, studentToken);

      Alert.alert("✅ Success", "Event updated successfully!");

      router.back();
    } catch (error: any) {
      console.error("❌ Update failed:", error);
      Alert.alert("❌ Error", error?.message || "Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getEvent = async () => {
      try {
        const res = await getEventById(studentToken, id as string);
        setEvent(res);
        setEventTitle(res.eventTitle);
        setEventShortDescription(res.eventShortDescription);
        setEventBody(res.eventBody);
        setEventLocation(res.eventLocation);
        setEventCategory(res.eventCategory);
        const eventTimeLength = res.eventTimeLength;
        setEventTime(eventTimeLength);
        setEventDate(res.eventDate);
        setOrganizerName(res.eventOrganizer.organizerName);
        setOrganizerEmail(res.eventOrganizer.organizerEmail);
      } catch (e) {
        console.error("❌ Error fetching event:", e);
      }
    };

    getEvent();
  }, []);

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
          <TextInput
            style={styles.input}
            value={eventTime}
            onChangeText={setEventTime}
          />

          {/* event date*/}
          <Text style={styles.textInfo}>Event Date</Text>
          <TextInput
            style={styles.input}
            value={eventDate}
            onChangeText={setEventDate}
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

          {/* --- Update event --- */}
          <TouchableOpacity
            style={[styles.submitBtn]}
            onPress={updateEventToCloud}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Update Event</Text>
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
