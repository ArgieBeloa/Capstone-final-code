import { getStudentById } from "@/api/students/controller";
import { StudentEventAttended } from "@/api/students/utils";
import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { Entypo } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const Rates = () => {
  // student attended data
  const { studentData, setStudentData, studentToken, userId } = useUser();

  const [studentAttendentState, setStudentAttendedState] = useState<
    StudentEventAttended[]
  >(studentData.studentEventAttended);

  const router = useRouter();

  const haddleEvaluationPage = (id: string) => {
    router.push({
      pathname: `../Evaluation/${id}`,
    });
  };
  useFocusEffect(
    useCallback(() => {
      const getStudentData = async () => {
        const student = await getStudentById(studentToken, userId);
        setStudentData(student);
        setStudentAttendedState(student.studentEventAttended);
      };
      getStudentData();
    }, []),
  );

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.containerEventHeader}>
          <Text style={styles.containerEventHeaderText}>Event Attended</Text>
        </View>
        <View style={{ flex: 1 }}>
          {studentAttendentState.length !== 0 ? (
            <>
              <Animated.FlatList
                data={studentAttendentState}
                keyExtractor={(item) => item.eventId}
                contentContainerStyle={{ marginHorizontal: 10 }}
                renderItem={({ item }) => {
                  return (
                    <TouchableHighlight
                      onPress={() => haddleEvaluationPage(item.eventId)}
                    >
                      <Animated.View
                        entering={FadeInUp.duration(500)}
                        style={styles.eventCard}
                      >
                        <View>
                          <Text style={styles.eventText}>
                            {item.eventTitle}
                          </Text>
                          <Text style={styles.eventText}>
                            {item.studentDateAttended}
                          </Text>
                          {/* <Text style={styles.eventText}>{item.eventTime}</Text> */}
                        </View>
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {item.evaluated ? (
                            <View style={{ alignItems: "center" }}>
                              <Entypo name="check" size={22} color="green" />
                              <Text style={{ fontSize: 10, fontWeight: "500" }}>
                                Evaluated
                              </Text>
                            </View>
                          ) : (
                            <View style={{ alignItems: "center" }}>
                              <Entypo name="warning" size={22} color="red" />
                              <Text style={{ fontSize: 10, fontWeight: "500" }}>
                                Required
                              </Text>
                            </View>
                          )}
                        </View>
                      </Animated.View>
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
              <Text>No events Attended available!</Text>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Text>Please go to </Text>
                <TouchableHighlight
                  onPress={() => router.push("/(tabs)/qrscanner")}
                  underlayColor="transparent"
                >
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      color: COLORS.Primary,
                      fontWeight: "500",
                    }}
                  >
                    QR tab
                  </Text>
                </TouchableHighlight>
                <Text> to Scan.</Text>
              </View>
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
  infoText: { fontWeight: "500", marginBottom: 2 },
  eventCard: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 7,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventText: { fontWeight: "500", fontSize: 13 },
});
