import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// API imports
import {
  addEventEvaluation,
  deleteStudentAttendance,
  getEventById,
} from "@/api/EventService";

// Icons
import { FontAwesome } from "@expo/vector-icons";

// Types
import Loading from "@/components/Loading";
import {
  EvaluationQuestion
} from "../Oop/Types";

// navigation
import { useRouter } from "expo-router";
export default function RatingsScreen() {
  const { id } = useLocalSearchParams();

  // user context data
  const { studentNumber, studentToken, studentData } = useUser();

  const [evaluationData, setEvaluationData] = useState<EvaluationQuestion[]>(
    []
  );
  const [studentRate, setStudentRate] = useState<Record<string, number>>({});
  const [suggestion, setSuggestion] = useState("");

  // loading and modals
  const [loading, setLoading] = useState<boolean>(false);
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false);

  const router = useRouter()

  // generate stars for each question
  const renderStars = (questionId: string) => {
    const currentRate = studentRate[questionId] || 0;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
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
      );
    }

    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {stars}
      </View>
    );
  };

  // handle star click
  const handleStarClick = (questionId: string, rate: number) => {
    setStudentRate((prev) => ({ ...prev, [questionId]: rate }));
  };

  // Upload ratings (final payload structure)
  const uploadRatings = async () => {
    setLoading(true);
    try {
      if (evaluationData.length === 0) return;

      // Build studentEvaluationInfos with questionText + rate
      const studentEvaluationInfos = evaluationData.map((q) => ({
        question: q.questionText,
        studentRate: studentRate[q.questionId] || 0,
      }));

      // Compute average (avoid divide by zero)
      const total = Object.values(studentRate).reduce((sum, r) => sum + r, 0);
      const avgRate =
        Object.values(studentRate).length > 0
          ? total / Object.values(studentRate).length
          : 0;

      // Final payload (array with one student record)
       const evaluation: any = {
    studentName: "Juan Dela Cruz",
    studentAverageRate: 4,
    studentSuggestion: "",
    studentEvaluationInfos: [
      { question: "How satisfied are you with the event?", studentRate: 4 },
    ],
  };

  try {
    const evaluationResult = await addEventEvaluation(
      studentToken,
      id as string,
      evaluation
    );

    console.log("✅ Evaluation submitted:", evaluationResult);

  } catch (error) {
    console.error("❌ Failed to submit evaluation:", error);
  }

     
    

      // delete student attendance to avoid duplication
      await deleteStudentAttendance(
        studentToken,
        studentNumber,
        id as string
      );

      setLoading(false);
      setSuccessModalVisible(true)
    } catch (e) {
      console.log(e);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Footer with suggestion + submit button
  const footer = (
    <View>
      <TextInput
        style={styles.input}
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

  // Fetch evaluation questions
  useEffect(() => {
    const getEvent = async () => {
      const event = await getEventById(studentToken, id);
      if (event && event[0]?.evaluationQuestions) {
        setEvaluationData(event[0].evaluationQuestions);
      }
    };
    getEvent();




  }, []);

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        <Animated.FlatList
          data={evaluationData}
          keyExtractor={(item) => item.questionId}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }: { item: EvaluationQuestion }) => (
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>{item.questionText}</Text>
              {renderStars(item.questionId)}
            </View>
          )}
          ListFooterComponent={footer}
        />

        {/* loading */}
        <Loading text="Please wait..." color="#4F46E5" visible={loading} />

        {/* modal */}
         <Modal
          animationType="fade"
          transparent={true}
          visible={successModalVisible}
          onRequestClose={() => setSuccessModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalView}>
              <Text style={[styles.modalTitle, { color: "green" }]}>
                Success 🎉
              </Text>
              <Text style={styles.modalText}>
                Evaluation added successfully !
              </Text>

              <Pressable
                style={[styles.button, { backgroundColor: "green", marginTop: 15 }]}
                onPress={() => {
                  setSuccessModalVisible(false);
                  router.push("/(tabs)/home"); // ✅ redirect to home after success
                }}
              >
                <Text style={styles.buttonText}>Go to Home</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearbackGround>
  );
};



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
    backgroundColor: COLORS.Secondary,
    paddingVertical: 10,
  },
  submitText: {
    textAlign: "center",
    color: COLORS.textColorWhite,
    fontSize: 15,
  },

  // modal
   button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: { backgroundColor: "red", marginTop: 15 },
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
