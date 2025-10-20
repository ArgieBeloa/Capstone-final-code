import { getAllStudents, sendExpoNotification } from "@/api/admin/controller";
import { getAllEvents } from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import HeaderOfficer from "@/components/HeaderOfficer";
import LinearbackGround from "@/components/LinearBackGround";
import LinearProgressBar from "@/components/LinearProgressBar";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Statistic = () => {
  const { studentToken, studentData, eventData } = useUser();
  const router = useRouter();

  const [statisticEvent, setStatisticEvent] = useState<EventModel[]>([]);
  const [suggestedTitleState, setSuggestedTitleState] = useState<
    { eventId: string; eventTitle: string }[]
  >([]);
  const [allTokens, setAllTokens] = useState<{ notificationId: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // 🪄 Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // 🧠 Fetch events and students once, and whenever a new event is added
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // ✅ Fetch all students
        const students = await getAllStudents(studentToken);
        const notificationIds = students
          .filter((s) => !!s.notificationId)
          .map((student) => ({
            notificationId: student.notificationId,
          }));
        setAllTokens(notificationIds);

        // ✅ Fetch all events
        const allEvents = await getAllEvents(studentToken);
        console.log("📊 All events:", allEvents);

        // 🧮 Compute attendance & evaluation stats
        const rankedEvents = allEvents
          .map((event: EventModel) => {
            const attendanceCount = event.eventAttendances?.length || 0;
            const evaluationScores =
              event.eventEvaluationDetails?.map(
                (e: any) => e.studentAverageRate
              ) || [];
            const evaluationAvg = evaluationScores.length
              ? evaluationScores.reduce((sum, val) => sum + val, 0) /
                evaluationScores.length
              : 0;

            const attendanceRate =
              (attendanceCount / (event.allStudentAttending || 1)) * 100;
            const performanceScore =
              attendanceRate * 0.6 + (evaluationAvg / 5) * 40; // weighted score

            return {
              ...event,
              attendanceRate,
              evaluationAvg,
              performanceScore,
            };
          })
          .sort((a, b) => b.performanceScore - a.performanceScore);

        setStatisticEvent(rankedEvents);

        // 🧩 Prepare event suggestions for HeaderOfficer
        const eventIdAndTitles = allEvents.map((event) => ({
          eventId: event.id ?? "",
          eventTitle: event.eventTitle,
        }));
        setSuggestedTitleState(eventIdAndTitles);

        // 🎬 Trigger entry animation
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
        ]).start();
      } catch (error) {
        console.error("❌ Error loading data:", error);
        Alert.alert("Error", "Failed to load event statistics.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventData]); // ✅ Re-run when new event is added

  // 🏆 Rank icons
  const getRankIcon = (index: number) => {
    if (index === 0)
      return <Ionicons name="trophy" size={30} color="#FFD700" />; // gold
    if (index === 1)
      return <Ionicons name="trophy" size={28} color="#a19c9cff" />; // silver
    if (index === 2)
      return <Ionicons name="trophy" size={26} color="#CD7F32" />; // bronze
    return <Ionicons name="medal-outline" size={24} color="#999" />;
  };

  // 📢 Send announcement to all students
  const handleSendAnnouncement = async (title: string, message: string) => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Missing fields", "Please fill out both title and message!");
      return;
    }

    try {
      setLoading(true);

      const extractAllTokens = allTokens.map(
        (item) => item.notificationId
      ) as string[];

      await sendExpoNotification(studentToken, {
        tokens: extractAllTokens,
        title,
        body: message,
      });

      Alert.alert("✅ Success", "Announcement sent successfully!");
    } catch (error: any) {
      console.error("❌ Error sending announcement:", error);
      Alert.alert("Error", "Failed to send announcement!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        {/* 🧭 Header */}
        <HeaderOfficer
          officerName={studentData?.studentName ?? "Officer"}
          eventSuggestionData={suggestedTitleState}
          handleSendAnnouncement={handleSendAnnouncement}
        />

        <View style={{ flex: 1, padding: 15, zIndex: -1 }}>
          <Text style={styles.header}>🏆 Event Performance Ranking</Text>

          <Animated.FlatList
            data={statisticEvent}
            keyExtractor={(item) => item.id ?? Math.random().toString()}
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => router.push(`../officerEventDetails/${item.id}`)}
              >
                <Animated.View style={styles.card}>
                  <View style={styles.iconContainer}>{getRankIcon(index)}</View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{item.eventTitle}</Text>
                    <LinearProgressBar
                      value={item.eventAttendances?.length || 0}
                      max={item.allStudentAttending || 1}
                      title="Attendance"
                    />
                    <LinearProgressBar
                      value={item.eventEvaluationDetails?.length || 0}
                      max={item.eventAttendances?.length || 1}
                      title="Evaluated"
                    />
                  </View>
                </Animated.View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No event statistics available.
              </Text>
            }
          />

          {/* 🔄 Loading Modal */}
          <Modal visible={loading} transparent animationType="fade">
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Statistic;

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.TextColor,
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.Forth,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  iconContainer: {
    marginRight: 10,
    width: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TextColor,
    marginBottom: 6,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
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
