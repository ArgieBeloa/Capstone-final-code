import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import React, { useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Example questions
const questions = [
  { id: 1, text: "How do you like feature A?" },
  { id: 2, text: "How do you like feature B?" },
  { id: 3, text: "How do you like feature B?" },
  { id: 4, text: "How do you like feature B?" },
];

type RatingWithSuggestion = {
  questionId: number;
  rating: number;
  suggestion?: string;
};

export default function RatingsScreen() {
  const [ratings, setRatings] = useState<RatingWithSuggestion[]>([]);
  const [suggestion, setSuggestion] = useState("");

  // Handle star rating
  const handleRating = (questionId: number, rating: number) => {
    const existing = ratings.find((r) => r.questionId === questionId);
    if (existing) {
      setRatings((prev) =>
        prev.map((r) => (r.questionId === questionId ? { ...r, rating } : r))
      );
    } else {
      setRatings((prev) => [...prev, { questionId, rating }]);
    }
  };

  // Handle suggestion input
  const handleSuggestion = () => {
    console.log(suggestion);
  };

  const uploadRatings = () => {
    handleSuggestion();
    console.log("Uploading ratings:", ratings);
    // Replace with your API call
  };

 


  const foooter = (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Add a suggestion..."
        value={suggestion}
        onChangeText={setSuggestion}
      
        multiline
      />

   <TouchableOpacity onPress={uploadRatings} style={{marginVertical:10, marginTop:10, borderRadius: 10, backgroundColor: COLORS.Secondary, paddingVertical: 10}}><Text style={{textAlign: "center", color: COLORS.textColorWhite, fontSize: 15, }}>Submit</Text></TouchableOpacity>
    </View>
  );


  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{backgroundColor: COLORS.Forth, padding: 10}}>
          <Text style={{textAlign: "center", fontSize: 24, fontWeight: 600}}>Evaluation Page</Text>
        </View>
        <Animated.FlatList
          data={questions}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => {
            const current = ratings.find((r) => r.questionId === item.id);
            const currentRating = current?.rating ?? 0;
            const currentSuggestion = current?.suggestion ?? "";

            return (
              <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{item.text}</Text>

                {/* Rating Stars */}
                <View style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => handleRating(item.id, star)}
                      style={[
                        styles.star,
                        currentRating >= star
                          ? styles.filledStar
                          : styles.emptyStar,
                      ]}
                    >
                      <Text style={{ color: "white", fontSize: 18 }}>★</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          }}
          ListFooterComponent={foooter}
        />

        {/* Suggestion Input */}
      </SafeAreaView>
    </LinearbackGround>
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
  ratingRow: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "center",
  },
  star: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  filledStar: {
    backgroundColor: "gold",
  },
  emptyStar: {
    backgroundColor: "gray",
  },
  input: {
    backgroundColor: COLORS.Forth,
    padding: 10,
    minHeight: 100,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16
  },
});
