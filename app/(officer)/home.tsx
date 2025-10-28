import FloatingButton from "@/components/FloatingButton";
import HeaderOfficer from "@/components/HeaderOfficer";
import LinearbackGround from "@/components/LinearBackGround";
import LinearProgressBar from "@/components/LinearProgressBar";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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

import { getAllStudents, sendExpoNotification } from "@/api/admin/controller";
import {
  fetchEventImageById,
  getAllEvents,
  getEventImageByLocation,
} from "@/api/events/controller";
import { EventModel } from "@/api/events/model";

const Home = () => {
  const router = useRouter();
  const { eventData, studentToken, studentData } = useUser();

  const [suggestedTitleState, setSuggestedTitleState] = useState<
    { eventId: string; eventTitle: string }[]
  >([]);

  const [latestEventState, setLatestEventState] = useState<
    EventModel | undefined
  >();
  const [eventState, setEventState] = useState<EventModel[]>([]);
  const [allTokens, setAllTokens] = useState<{ notificationId: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // useFocusEffect(
  //   useCallback(() => {
  //     const refeshEvents = async () => {
  //       const events = await getAllEvents(studentToken);
  //       setEventState(events);
  //     };
  //     refeshEvents();
  //   }, [])
  // );

  // 🧠 Fetch all data
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          if (eventData?.length) {
            const students = await getAllStudents(studentToken);

            // get students expo token
            const notificationIds = students
              .filter((s) => !!s.notificationId)
              .map((student) => ({
                notificationId: student.notificationId,
              }));

            setAllTokens(notificationIds);

            // 🎯 Fetch all events
            const events = await getAllEvents(studentToken);
            setEventState(events);

            const eventIdAndTitles = events.map(
              (event: { id: any; eventTitle: any }) => ({
                eventId: event.id,
                eventTitle: event.eventTitle,
              })
            );
            setSuggestedTitleState(eventIdAndTitles);

            // 🎯 Get latest event
            const allEventsData = await getAllEvents(studentToken);

            if (allEventsData?.length) {
              const lastItem = allEventsData.at(-1);
              setLatestEventState(lastItem);
            } else {
              setLatestEventState(undefined);
            }
          }
        } catch (error) {
          console.error("❌ Error loading data:", error);
        }
      };

      loadData();
    }, [])
  );
  // 📢 Send announcement
  const handleSendAnnouncement = async (title: string, message: string) => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Missing fields", "Please fill out both title and message!");
      return;
    }

    try {
      setLoading(true);

      const extactAllTokens: string[] = allTokens.map(
        (item) => item.notificationId
      );

      console.log(extactAllTokens);
      await sendExpoNotification(studentToken, {
        tokens: extactAllTokens,
        title,
        body: message,
      });
      console.log(title);

      Alert.alert("✅ Success", "Announcement sent successfully!");
    } catch (error: any) {
      console.error("❌ Error sending announcement:", error);
      Alert.alert("Error", "Failed to send announcement!");
    } finally {
      setLoading(false);
    }
  };
  const RenderLatestEvent = ({
    latestEventState,
  }: {
    latestEventState: EventModel;
  }) => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
      const loadImage = async () => {
        console.log(latestEventState.eventImageUrl);
        try {
          const uri = await fetchEventImageById(
            latestEventState.eventImageUrl!,
            studentToken
          );
          setImageUri(uri);
        } catch (error) {
          console.error(
            `❌ Failed to load image for event ${latestEventState.id}:`,
            error
          );
        } finally {
          setLoadingImage(false);
        }
      };

      loadImage();
    }, [latestEventState.eventImageUrl]);

    return (
      <TouchableOpacity
        onPress={() =>
          router.push(`../officerEventDetails/${latestEventState.id}`)
        }
        style={styles.card}
      >
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : getEventImageByLocation(latestEventState.eventLocation)
          }
          resizeMode="cover"
          style={styles.eventImage}
        />
        {/* Loading overlay */}
        {loadingImage && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0,0.2)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
        <View style={styles.eventInfo}>
          <Text style={styles.title}>{latestEventState.eventTitle}</Text>
          <Text style={styles.info}>{latestEventState.eventDate}</Text>
          <Text style={styles.info}>{latestEventState.eventTime}</Text>
          <Text style={styles.info}>{latestEventState.eventTimeLength}</Text>

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
    );
  };

  const RenderAllEvents = ({ item }: { item: EventModel }) => {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
      const loadImage = async () => {
        console.log(item.eventImageUrl);
        try {
          const uri = await fetchEventImageById(
            item.eventImageUrl!,
            studentToken
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
      <TouchableOpacity
        onPress={() => router.push(`../officerEventDetails/${item.id}`)}
        style={styles.card}
      >
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : getEventImageByLocation(item.eventLocation)
          }
          resizeMode="cover"
          style={styles.eventImage}
        />
        {/* Loading overlay */}
        {loadingImage && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0,0,0,0.2)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}
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
    );
  };

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
          <HeaderOfficer
            officerName={studentData?.studentName ?? "Officer"}
            eventSuggestionData={suggestedTitleState}
            handleSendAnnouncement={handleSendAnnouncement}
          />
        <View style={styles.container}>

          {/* Header */}
        

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Latest Event */}
            <Text style={styles.subTitleText}>Latest Event</Text>

            {latestEventState ? (
              <RenderLatestEvent latestEventState={latestEventState} />
            ) : (
              <Text style={styles.emptyText}>Loading latest event...</Text>
            )}

            {/* All Events */}
            <Text style={styles.subTitleText}>All Events</Text>

            <FlatList
              data={eventState}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => <RenderAllEvents item={item} />}
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
          // onPress={() => router.push("../test")}
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
    // flex: 1,
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
