import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getAllStudents, sendExpoNotification } from "@/api/admin/controller";
import {
  deleteEvent,
  fetchEventImageById,
  getAllEvents,
  getEventImageByLocation,
} from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { useFocusEffect, useRouter } from "expo-router";
import eventStyles from "../styles/events.styles";
import Styles from "../styles/globalCss";

const Events = () => {
  const { studentToken } = useUser();
  const router = useRouter();

  const [events, setEvents] = useState<EventModel[]>([]);
  const [allEvents, setAllEvents] = useState<EventModel[]>([]);
  const [eventTitles, setEventTitles] = useState<
    { id: string; eventTitle: string }[]
  >([]);
  const [filteredEvents, setFilteredEvents] = useState<
    { id: string; eventTitle: string }[]
  >([]);
  const [searchText, setSearchText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idDelete, setIdDelete] = useState<string>("");

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [allTokens, setAllTokens] = useState<{ notificationId: string }[]>([]);

  const officerName = "OSA Officer";
  const firstLetterName = officerName.charAt(0).toUpperCase();

  // ✅ Load all events and student notification tokens (refresh each time you revisit screen)
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          setLoading(true);
          const eventsData = await getAllEvents(studentToken);
          setEvents(eventsData);
          setAllEvents(eventsData);

          const titles = eventsData.map((e) => ({
            id: e.id,
            eventTitle: e.eventTitle,
          }));
          setEventTitles(titles);

          const students = await getAllStudents(studentToken);
          const notificationIds = students
            .filter((s) => !!s.notificationId)
            .map((s) => ({ notificationId: s.notificationId }));
          setAllTokens(notificationIds);
        } catch (err) {
          console.error("❌ Error loading events:", err);
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }, [studentToken]),
  );

  // ✅ Filter dropdown logic
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredEvents([]);
      setShowResults(false);
      return;
    }

    const lower = searchText.toLowerCase();
    const filtered = eventTitles.filter((e) =>
      e.eventTitle.toLowerCase().includes(lower),
    );
    setFilteredEvents(filtered);
    setShowResults(filtered.length > 0);
  }, [searchText, eventTitles]);

  // ✅ When user selects an event from dropdown
  const handleSelectEvent = (item: { id: string; eventTitle: string }) => {
    setSearchText(item.eventTitle);
    setShowResults(false);

    const selectedEvent = allEvents.filter((ev) => ev.id === item.id);
    setEvents(selectedEvent);

    // ❌ Removed the part that clears search text automatically
    setTimeout(() => setShowResults(false), 300);
  };

  // ✅ Reset to all events when search text manually cleared
  useEffect(() => {
    if (searchText.trim() === "") {
      setEvents(allEvents);
    }
  }, [searchText, allEvents]);

  // ✅ Send announcement
  const handleSendAnnouncement = async (title: string, message: string) => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Missing fields", "Please fill out both title and message!");
      return;
    }

    try {
      setLoading(true);
      const tokens = allTokens.map((t) => t.notificationId);
      await sendExpoNotification(studentToken, {
        tokens,
        title,
        body: message,
      });

      setAnnouncementTitle("");
      setAnnouncementMessage("");
      setShowAnnouncementModal(false);
      Alert.alert("✅ Success", "Announcement sent successfully!");
    } catch (err) {
      console.error("❌ Failed to send announcement:", err);
      Alert.alert("Error", "Failed to send announcement!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBackEnd = async () => {
    setLoading(true);
    console.log(idDelete);
    try {
      await deleteEvent(idDelete, studentToken);
      const events = await getAllEvents(studentToken);
      setAllEvents(events);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Navigation
  const handlePrintAttendance = (id: string) =>
    router.push(`../../PrintAttendances/${id}`);
  const handlePrint = (id: string) => router.push(`../../PrintFolder/${id}`);

  const platformIcon = Platform.OS === "web" ? "print" : "save";

  // ✅ Render Event Card
  const RenderEventItem = ({ item }: { item: EventModel }) => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
      const loadImage = async () => {
        if (!item.eventImageUrl) {
          setLoadingImage(false);
          return;
        }
        try {
          const uri = await fetchEventImageById(
            item.eventImageUrl,
            studentToken,
          );
          setImageUri(uri);
        } catch (error) {
          console.error(`❌ Failed to load image for event ${item.id}:`, error);
        } finally {
          setLoadingImage(false);
        }
      };
      loadImage();
    }, [item.eventImageUrl]);

    return (
      <View style={eventStyles.containerItem}>
        {/* Presable */}
        <Pressable
          onLongPress={() =>
            // handleDeleteEventById(item.id)
            {
              setIdDelete(item.id);
              setShowDeleteModal(true);
            }
          }
        >
          {loadingImage ? (
            <View
              style={[
                eventStyles.image,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <ActivityIndicator size="large" color={COLORS.Primary} />
            </View>
          ) : (
            <Image
              source={
                imageUri
                  ? { uri: imageUri }
                  : getEventImageByLocation(item.eventLocation)
              }
              style={eventStyles.image}
              resizeMode="cover"
            />
          )}

          <View style={{ padding: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "#222" }}>
              {item.eventTitle}
            </Text>
            <Text style={{ fontSize: 14, color: "#555" }}>
              {item.eventShortDescription}
            </Text>
            <Text style={{ fontSize: 12, color: "#777", marginTop: 4 }}>
              {item.eventDate} • {item.eventTimeLength}
            </Text>
            <Text style={{ marginTop: 4 }}>
              Posted By: {item.whoPostedName}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Pressable
                style={eventStyles.iconButton}
                onPress={() => handlePrintAttendance(item.id)}
              >
                <FontAwesome5 name={platformIcon} size={18} color="#000" />
                <Text style={eventStyles.iconText}>Attendance</Text>
              </Pressable>

              <Pressable
                style={eventStyles.iconButton}
                onPress={() => handlePrint(item.id)}
              >
                <FontAwesome5 name={platformIcon} size={18} color="#000" />
                <Text style={eventStyles.iconText}>Evaluation</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <LinearbackGround>
      <SafeAreaView style={[Styles.safeAreaView, { flex: 1 }]}>
        <View style={[Styles.container, { flex: 1 }]}>
          {/* Header */}
          <View style={eventStyles.headerContainer}>
            <View style={eventStyles.avatar}>
              <Text style={eventStyles.avatarText}>{firstLetterName}</Text>
            </View>

            {/* Search */}
            <View style={eventStyles.searchContainer}>
              <TextInput
                style={eventStyles.input}
                placeholder="Search event..."
                placeholderTextColor="#777"
                value={searchText}
                onChangeText={setSearchText}
              />
              <TouchableOpacity>
                <Ionicons name="search" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            {/* Announcement */}
            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              onPress={() => setShowAnnouncementModal(true)}
            >
              <FontAwesome5 name="bullhorn" size={18} color="black" />
            </TouchableOpacity>
          </View>

          {/* Search dropdown */}
          {showResults && filteredEvents.length > 0 && (
            <View style={Styles.resultsContainer}>
              <FlatList
                data={filteredEvents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={Styles.resultItem}
                    onPress={() => handleSelectEvent(item)}
                  >
                    <Text style={Styles.resultText}>{item.eventTitle}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* All Events */}
          <Text style={Styles.title}>All Events</Text>

          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <RenderEventItem item={item} />}
            ListEmptyComponent={
              <View style={Styles.emptyContainer}>
                <Text style={{ color: "black" }}>No events available!</Text>
              </View>
            }
            contentContainerStyle={[
              eventStyles.containerFlatlist,
              { paddingBottom: 100 },
            ]}
            showsVerticalScrollIndicator={false}
          />

          {/* Announcement Modal */}
          <Modal
            visible={showAnnouncementModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowAnnouncementModal(false)}
          >
            <View style={Styles.modalOverlay}>
              <View style={Styles.modalContainer}>
                <Text style={Styles.modalHeader}>📢 Send Announcement</Text>

                <TextInput
                  style={Styles.modalInput}
                  placeholder="Title"
                  value={announcementTitle}
                  onChangeText={setAnnouncementTitle}
                />
                <TextInput
                  style={[
                    Styles.modalInput,
                    { height: 100, textAlignVertical: "top" },
                  ]}
                  placeholder="Message"
                  multiline
                  value={announcementMessage}
                  onChangeText={setAnnouncementMessage}
                />

                <View style={Styles.modalButtons}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowAnnouncementModal(false)}
                  />
                  <Button
                    title="Send"
                    onPress={() =>
                      handleSendAnnouncement(
                        announcementTitle,
                        announcementMessage,
                      )
                    }
                  />
                </View>
              </View>
            </View>

            {loading && (
              <View style={Styles.loadingOverlay}>
                <View style={Styles.loadingBox}>
                  <ActivityIndicator size="large" color={COLORS.Primary} />
                  <Text style={Styles.loadingText}>
                    Sending announcement...
                  </Text>
                </View>
              </View>
            )}
          </Modal>

          {/* modal delete */}
          <Modal
            visible={showDeleteModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDeleteModal(false)}
          >
            <View style={Styles.modalContainerDelete}>
              <Text
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  marginVertical: 15,
                }}
              >
                Are you sure to delete this event?
              </Text>
              <View
                style={{
                  marginVertical: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  flexDirection: "row",
                }}
              >
                <Pressable
                  style={{
                    paddingVertical: 3,
                    paddingHorizontal: 10,
                    backgroundColor: "green",
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      marginHorizontal: 10,
                    }}
                    onPress={() => {
                      setShowDeleteModal(false);
                      handleDeleteBackEnd();
                    }}
                  >
                    Yes
                  </Text>
                </Pressable>
                <Pressable
                  style={{
                    paddingVertical: 3,
                    paddingHorizontal: 10,
                    backgroundColor: "red",
                    borderRadius: 20,
                  }}
                  onPress={() => setShowDeleteModal(false)}
                >
                  <Text style={{ color: "white", marginHorizontal: 10 }}>
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Events;
