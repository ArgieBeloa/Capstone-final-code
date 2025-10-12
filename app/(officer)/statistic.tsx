import { getAllEvents } from "@/api/EventService";
import { getAllStudents, sendExpoNotification } from "@/api/StudentService";
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
import { Event } from "../Oop/Types";

const Statistic = () => {
  const { studentToken, studentData, eventData } = useUser();
  const router = useRouter();
  const [statisticEvent, setStatisticEvent] = useState<Event[]>([]);
  const [allTokens, setAllTokens] = useState<string[]>([]);
  const [suggestionTitleState, setSuggestedTitleState] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🪄 Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // 📢 Send announcement
  const handleSendAnnouncement = async (title: string, message: string) => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Missing fields", "Please fill out both title and message!");
      return;
    }

    try {
      setLoading(true);
      await sendExpoNotification({ tokens: allTokens, title, message });
      Alert.alert("✅ Success", "Announcement sent successfully!");
    } catch (error: any) {
      console.error("❌ Error sending announcement:", error);
      Alert.alert("Error", "Failed to send announcement!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const allEvents = await getAllEvents(studentToken);
        console.log("📊 All events:", allEvents);

        // 🧮 Calculate performance and rank
        const rankedEvents = allEvents
          .map((event: Event) => {
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
              attendanceRate * 0.6 + (evaluationAvg / 5) * 40; // weighted formula

            return {
              ...event,
              attendanceRate,
              evaluationAvg,
              performanceScore,
            };
          })
          .sort(
            (
              a: { performanceScore: number },
              b: { performanceScore: number }
            ) => b.performanceScore - a.performanceScore
          );

        setStatisticEvent(rankedEvents);

        // Trigger animation
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
        console.error("❌ Error loading events:", error);
      }
    };

    const loadData = async () => {
      try {
        // 🎯 Suggested event titles
        if (eventData?.length) {
          const eventIdAndTitles = eventData.map(
            (event: { id: any; eventTitle: any }) => ({
              eventId: event.id,
              eventTitle: event.eventTitle,
            })
          );
          setSuggestedTitleState(eventIdAndTitles);
        }

        // 🎯 Fetch all students (for notification tokens)
        const students = await getAllStudents(studentToken);
        const tokens = students
          .map((s: { tokenId?: string }) => s.tokenId)
          .filter(Boolean);
        setAllTokens(tokens);
      } catch (e) {
        console.log(e);
      }
    };
    loadData();
    loadEvents();
  }, [studentToken]);

  const getRankIcon = (index: number) => {
    if (index === 0)
      return <Ionicons name="trophy" size={30} color="#FFD700" />; // gold
    if (index === 1)
      return <Ionicons name="trophy" size={28} color="#a19c9cff" />; // silver
    if (index === 2)
      return <Ionicons name="trophy" size={26} color="#CD7F32" />; // bronze
    return <Ionicons name="medal-outline" size={24} color="#999" />;
  };

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <HeaderOfficer
          officerName={studentData?.studentName ?? "Officer"}
          eventSuggestionData={suggestionTitleState}
          handleSendAnnouncement={handleSendAnnouncement}
        />
        <View style={{ flex: 1, padding: 15, zIndex: -1 }}>
          <Text style={styles.header}>🏆 Event Performance Ranking</Text>

          <Animated.FlatList
            data={statisticEvent}
            keyExtractor={(item) => item.id}
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
                      max={item.allStudentAttending}
                    // title={`Attendance (${(item?.attendanceRate ?? 0).toFixed(1)}%)`}
                    title="Attendance"

                    />
                    <LinearProgressBar
                      value={item.eventEvaluationDetails?.length || 0}
                      max={item.eventAttendances?.length || 1}
                      // title={`Evaluations (${(item?.attendanceRate ?? 0).toFixed(
                      //   1
                      // )}★ avg)`}
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
          {/* Loading Modal */}
          <Modal visible={loading} transparent animationType="fade">
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Sending Announcement...</Text>
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
