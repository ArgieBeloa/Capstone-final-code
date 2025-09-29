import { StudentAttended } from "@/api/ApiType";
import { studentDataFunction } from "@/api/spring";
import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
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
  const { studentData, setStudentData, studentToken, studentNumber} = useUser();


  const studentDataAttended = studentData.studentEventAttended;

  const router = useRouter();

  const haddleEvaluationPage = (id: string) => {
    router.push({
      pathname: `../Evaluation/${id}`,
    });
  };

  useEffect(()=>{

    const getStudentData = async () => {
       
      const student = await studentDataFunction( studentNumber, studentToken)
      setStudentData(student)
    }

    getStudentData()

  },[])

  return (
    <LinearbackGround>
      <SafeAreaView style ={{flex: 1}}>
        <View style={styles.containerEventHeader}>
          <Text style={styles.containerEventHeaderText}>Event Attended</Text>
        </View>
        <View style={{ flex: 1 }}>
          {studentDataAttended.length !== 0 ? (
            <>
              <Animated.FlatList
                data={studentDataAttended}
                keyExtractor={(item) => item.eventId}
                renderItem={({ item }: { item: StudentAttended }) => {
                  return (
                    <TouchableHighlight
                      onPress={() => haddleEvaluationPage(item.eventId)}
                    >
                      <View style={styles.flatlistContainer}>
                        <Text>{item.eventTitle}</Text>
                        <Text>{item.studentDateAttended}</Text>
                      </View>
                    </TouchableHighlight>
                  );
                }}
              />
            </>
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text>No Event Attended </Text>
              <Text>
                Please Go To{" "}
                <TouchableHighlight
                  onPress={() => router.push("/(tabs)/qrscanner")}
                >
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      color: COLORS.Primary,
                    }}
                  >
                    QR Scanner
                  </Text>
                </TouchableHighlight>
              </Text>
            </View>
          )}
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
    paddingVertical: 10,
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
