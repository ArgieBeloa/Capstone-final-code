import { StudentAttended } from "@/api/ApiType";
import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Rates = () => {
  // student attended data
  const {studentData} = useUser()

  const studentDataAttended = studentData.studentEventAttended

  const router = useRouter();

  const haddleEvaluationPage = (id: string) => {
    router.push({
      pathname: `../Evaluation/${id}`,
      params: { id },
    });
  };

  return (
    <LinearbackGround>
      <SafeAreaView>
        <View style={styles.containerEventHeader}>
          <Text style={styles.containerEventHeaderText}>Event Attended</Text>
        </View>
        <View>
          <Animated.FlatList
            data={studentDataAttended}
            keyExtractor={(item) => item.eventId}
            renderItem={({ item}: {item: StudentAttended}) => {
              return (
                <TouchableHighlight
                onPress={()=>haddleEvaluationPage(item.eventId)}
                >
                  <View style={styles.flatlistContainer}>
                    <Text>{item.eventId}</Text>
                    <Text>{item.studentDateAttended}</Text>
                  </View>
                </TouchableHighlight>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Rates;

const styles = StyleSheet.create({
  containerEventHeader: {
    margin: 10,
    backgroundColor: COLORS.Forth,
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 5,
  },
  containerEventHeaderText: {
    fontWeight: 600,
    fontSize: 19,
  },
  flatlistContainer: {
    margin: 10,
    borderRadius: 10,
    padding: 10,
    backgroundColor: COLORS.Forth,
  },
});
