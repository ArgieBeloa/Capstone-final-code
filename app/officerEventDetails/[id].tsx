import { getEventById } from "@/api/spring";
import LinearBackGround from "@/components/LinearBackGround";
import LinearProgressBar from "@/components/LinearProgressBar";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { Event, EventAttendance, EventEvaluationDetail } from "../Oop/Types";

const EventViewMore = () => {
  const router = useRouter();
  const { studentToken } = useUser();
  const { id } = useLocalSearchParams();
  const screenWidth = Dimensions.get("window").width;

  // 📏 Circle Config
  const radius = Math.max(40, Math.min(80, screenWidth / 6));
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const max = 5.0;

  const ratingFontSize = Math.min(screenWidth * 0.06, 20);
  const labelFontSize = Math.min(screenWidth * 0.045, 14);

  // 📊 States
  const [eventFeedback, setEventFeedback] = useState<EventEvaluationDetail[]>([]);
  const [event, setEvent] = useState<Event>();
  const [eventAttended, setEventAttended] = useState<EventAttendance[]>([]);
  const [numberOfEvaluated, setNumberOfEvaluated] = useState<number>(0);
  const [overallPerformance, setOverallPerformance] = useState<number>(0);
  const [numberOfStudentAttended, setNumberOfStudentAttended] = useState<number>(0);

  // 🧠 Fetch Event Details
  useEffect(() => {
    const getEvent = async () => {
      try {
        const res = await getEventById(studentToken, id as string);
        const fetchedEvent = res?.[0];

        if (!fetchedEvent) return;

        const feedback = fetchedEvent?.eventEvaluationDetails ?? [];
        const attendances = fetchedEvent?.eventAttendances ?? [];

        setEventFeedback(feedback);
        setEventAttended(attendances);
        setNumberOfEvaluated(feedback.length);
        setNumberOfStudentAttended(attendances.length);
        setEvent(fetchedEvent);

        const performance =
          feedback.length > 0
            ? feedback.reduce(
                (sum: number, item: EventEvaluationDetail) =>
                  sum + (item.studentAverageRate ?? 0),
                0
              ) / feedback.length
            : 0;

        setOverallPerformance(performance);
      } catch (error) {
        console.error("❌ Error fetching event:", error);
      }
    };

    getEvent();
  }, [studentToken, id]);

  const progress = (overallPerformance / max) * circumference;

  const handlePrint = async (id: string) => {
    router.push(`../PrintFolder/${id}`);
  };

  return (
    <LinearBackGround>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.statisticContainer]}>
          {/* Circular Performance Indicator */}
          <View style={styles.centerWrapper}>
            <Svg
              width={radius * 2 + strokeWidth}
              height={radius * 2 + strokeWidth}
            >
              <Circle
                cx={radius + strokeWidth / 2}
                cy={radius + strokeWidth / 2}
                r={radius}
                stroke="#E5E7EB"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={radius + strokeWidth / 2}
                cy={radius + strokeWidth / 2}
                r={radius}
                stroke={COLORS.Primary}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
              />
            </Svg>

            <View style={styles.textWrapper}>
              <Text style={[styles.ratingText, { fontSize: ratingFontSize }]}>
                {overallPerformance.toFixed(1)} / {max.toFixed(1)}
              </Text>
              <Text
                style={{
                  fontSize: labelFontSize,
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Performance
              </Text>
            </View>
          </View>

          {/* Event Stats */}
          <View style={{ flex: 1, marginVertical: 10, paddingHorizontal: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 6 }}>
              {event?.eventTitle ?? "Event Title"}
            </Text>

            <LinearProgressBar
              value={event?.eventAttendances?.length ?? 0}
              max={event?.allStudentAttending ?? 0}
              title="Attended"
            />
            <LinearProgressBar
              value={numberOfEvaluated ?? 0}
              max={eventAttended?.length ?? 0}
              title="Evaluated"
            />

            {/* Header for feedback */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "500" }}>
                Student Feedback
              </Text>
              <TouchableOpacity
                onPress={() => handlePrint(id as string)}
                style={{ padding: 6 }}
              >
                <Ionicons
                  name={
                    Platform.OS === "web" ? "print-outline" : "document-outline"
                  }
                  size={26}
                  color={COLORS.Primary}
                />
              </TouchableOpacity>
            </View>

            {/* Feedback List */}
            {eventFeedback?.length === 0 ? (
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 16,
                  color: "#666",
                }}
              >
                No evaluation yet
              </Text>
            ) : (
              <FlatList
                data={eventFeedback}
                style={{ flex: 1 }}
                contentContainerStyle={styles.flatlistContainer}
                keyExtractor={(item) => item.studentId}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  let iconName: keyof typeof Ionicons.glyphMap;
                  let iconColor;
                  let labelText;

                  if (item.studentAverageRate >= 4.7) {
                    iconName = "happy";
                    iconColor = "#059669";
                    labelText = "Very Good";
                  } else if (item.studentAverageRate >= 3.0) {
                    iconName = "thumbs-up";
                    iconColor = "#2563EB";
                    labelText = "Good";
                  } else {
                    iconName = "alert-circle";
                    iconColor = "#DC2626";
                    labelText = "Needs Improvement";
                  }

                  return (
                    <View style={styles.card}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {item.studentName?.charAt(0).toUpperCase() ?? "?"}
                        </Text>
                      </View>

                      <Text style={styles.name}>{item.studentName}</Text>

                      <View style={{ alignItems: "center" }}>
                        <Ionicons name={iconName} size={22} color={iconColor} />
                        <Text
                          style={{
                            fontSize: 12,
                            color: iconColor,
                            marginTop: 2,
                          }}
                        >
                          {labelText}
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearBackGround>
  );
};

export default EventViewMore;

const styles = StyleSheet.create({
  statisticContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: COLORS.Forth,
    borderRadius: 8,
    width: "90%",
    maxWidth: 600,
    alignSelf: "center",
  },
  centerWrapper: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  textWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    padding: 10,
  },
  ratingText: {
    color: COLORS.TextColor,
    fontWeight: "bold",
    textAlign: "center",
  },
  flatlistContainer: {
    marginTop: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#E5E5E5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginLeft: 10,
  },
});
