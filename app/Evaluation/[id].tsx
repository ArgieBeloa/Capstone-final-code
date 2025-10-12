import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// API
import { addEventEvaluation, getEventById } from "@/api/EventService";
import {
  addStudentRecentEvaluation,
  updateProfileData,
  updateStudentEventEvaluated,
} from "@/api/StudentService";
import { eventsDataFunction, studentDataFunction } from "@/api/spring";

// Icons & Components
import Loading from "@/components/Loading";
import { FontAwesome } from "@expo/vector-icons";

// Types
import {
  EvaluationQuestion,
  Event,
  EventEvaluationDetail,
  StudentEvaluationInfo,
  StudentRecentEvaluation,
} from "../Oop/Types";

export default function RatingsScreen() {
  const { id } = useLocalSearchParams();
  const {
    studentNumber,
    studentToken,
    studentData,
    setStudentData,
    setEventData,
  } = useUser();
  const router = useRouter();

  const [evaluationData, setEvaluationData] = useState<EvaluationQuestion[]>(
    []
  );
  const [event, setEvent] = useState<Event>();
  const [alreadyEvaluated, setAlreadyEvaluated] = useState(
    studentData?.studentRecentEvaluations || []
  );

  const [studentRate, setStudentRate] = useState<Record<string, number>>({});
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // ⭐ Render stars
  const renderStars = (questionId: string) => {
    const currentRate = studentRate[questionId] || 0;

    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handleStarClick(questionId, i)}
          >
            <FontAwesome
              name={i <= currentRate ? "star" : "star-o"}
              size={30}
              color={COLORS.Primary}
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleStarClick = (questionId: string, rate: number) => {
    setStudentRate((prev) => ({ ...prev, [questionId]: rate }));
  };

  // 📌 Upload ratings
  const uploadRatings = async () => {
    const isAlreadyEvaluated = alreadyEvaluated.some(
      (e: { eventId: string }) => e.eventId === (id as string)
    );

    if (isAlreadyEvaluated) {
      Alert.alert(
        "✨ Already Evaluated",
        "You’ve already rated this event. Thank you for your feedback! 🙌"
      );

      return;
    }

    if (evaluationData.length === 0) {
      Alert.alert(
        "No Questions",
        "No evaluation questions found for this event."
      );
      return;
    }

    setLoading(true);

    try {
      // Build answers
      const studentEvaluationInfos: StudentEvaluationInfo[] =
        evaluationData.map((q) => ({
          question: q.questionText,
          studentRate: studentRate[q.questionId] || 0,
        }));

      // Compute average
      const total = Object.values(studentRate).reduce((sum, r) => sum + r, 0);
      const avgRate =
        Object.values(studentRate).length > 0
          ? total / Object.values(studentRate).length
          : 0;

      // Build evaluation payload
      const evaluation: EventEvaluationDetail = {
        studentId: studentData.id ?? "unknown",
        studentName: studentData.studentName ?? "Anonymous",
        studentAverageRate: avgRate,
        studentSuggestion: suggestion ?? "no suggestion",
        studentEvaluationInfos,
      };

      // 🔥 Submit
      await addEventEvaluation(studentToken, id as string, evaluation);

      // Update profile data
      await updateProfileData(
        studentToken,
        studentData.id,
        id as string,
        true,
        true
      );
      await updateStudentEventEvaluated(
        studentToken,
        studentData.id,
        id as string,
        true
      );

      // Add to recent evaluations
      const evaluatedEvent: StudentRecentEvaluation[] = [
        {
          eventId: id as string,
          eventTitle: event?.eventTitle || "No Title",
          studentRatingsGive: avgRate,
          studentDateRated: new Date().toLocaleString(),
        },
      ];

      await addStudentRecentEvaluation(
        studentToken,
        studentData.id,
        evaluatedEvent
      );

      // then delete the event in student upcoming event
      // await deleteSpecificStudentUpcomingEvents(
      //   studentToken,
      //   studentData.id,
      //   id as string
      // );

      // refresh student data
      const refreshStudentData = await studentDataFunction(
        studentNumber,
        studentToken
      );
      setStudentData(refreshStudentData);

      const events = await eventsDataFunction(studentToken);
      setEventData(events);

      setSuccessModalVisible(true);
    } catch (error) {
      console.error("❌ Failed to submit evaluation:", error);
      Alert.alert("Error", "Failed to submit evaluation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Fetch evaluation questions
  useEffect(() => {
    const getEvent = async () => {
      const event = await getEventById(studentToken, id);
      if (event && event[0]?.evaluationQuestions) {
        setEvaluationData(event[0].evaluationQuestions);
        setEvent(event[0]);
      }
    };
    getEvent();
  }, []);

  const footer = (
    <View>
      <TextInput
        style={[styles.input, { padding: 10 }]}
        placeholder="Add a suggestion..."
        value={suggestion}
        onChangeText={setSuggestion}
        multiline
      />

      <TouchableOpacity onPress={uploadRatings} style={styles.submitBtn}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearbackGround>
        <SafeAreaView style={{ flex: 1 }}>
          <Animated.FlatList
            data={evaluationData}
            keyExtractor={(item) => item.questionId}
            contentContainerStyle={{ padding: 20 }}
            renderItem={({ item }) => (
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{item.questionText}</Text>
                {renderStars(item.questionId)}
              </View>
            )}
            ListFooterComponent={footer}
          />

          {/* Loading */}
          <Loading text="Please wait..." color="#4F46E5" visible={loading} />

          {/* Success Modal */}
          <Modal
            animationType="fade"
            transparent
            visible={successModalVisible}
            onRequestClose={() => setSuccessModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalView}>
                <Text style={[styles.modalTitle, { color: "green" }]}>
                  Success 🎉
                </Text>
                <Text style={styles.modalText}>
                  Evaluation added successfully!
                </Text>

                <Pressable
                  style={[
                    styles.button,
                    { backgroundColor: "green", marginTop: 15 },
                  ]}
                  onPress={() => {
                    setSuccessModalVisible(false);
                    router.push("/(tabs)/home");
                  }}
                >
                  <Text style={styles.buttonText}>Go to Home</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </LinearbackGround>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  questionContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    backgroundColor: COLORS.Forth,
    textAlignVertical: "top",
    padding: 5,
    minHeight: 100,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  submitBtn: {
    marginVertical: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: COLORS.Primary,
    paddingVertical: 10,
  },
  submitText: {
    textAlign: "center",
    color: COLORS.textColorWhite,
    fontSize: 15,
  },
  // Modal
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 14, textAlign: "center" },
});
