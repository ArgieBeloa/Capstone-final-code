import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StudentNotification } from "../Oop/Types";

const StudentNoticationPage = () => {
  // useContext data
  const { studentData, studentToken } = useUser();
  const router = useRouter();

  // useState data (must be array, not single object)
  const [studentNoticationData, setStudentNoticationData] = useState<
    StudentNotification[]
  >([]);
  const [studentId, setStudentId] = useState<string | undefined>();

  const haddleExploreClick = (id: string) => {
    router.push(`../EventDetails/${id}`);
  };

  useEffect(() => {
    if (studentData) {
      setStudentNoticationData(studentData.studentNotifications || []);
      setStudentId(studentData.id);
    }
  }, [studentData]);

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {studentNoticationData.length !== 0 ? (
            <Animated.FlatList
              data={studentNoticationData}
              keyExtractor={(item, index) => item.eventId ?? index.toString()}
              contentContainerStyle={{ padding: 20 }}
              renderItem={({ item }: { item: StudentNotification }) => (
                <View style={styles.notificationItem}>
                  <Text style={styles.title}>{item.eventTitle}</Text>
                  <Text style={styles.desc}>
                    {item.eventShortDescription}
                  </Text>
                  <TouchableHighlight
                    style={{ marginVertical: 5 }}
                    onPress={() => haddleExploreClick(item.eventId)}
                  >
                    <Text style={{ fontSize: 16, color: COLORS.Primary }}>
                      Explore
                    </Text>
                  </TouchableHighlight>
                </View>
              )}
            />
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text>No Notification</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default StudentNoticationPage;

const styles = StyleSheet.create({
  notificationItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 14,
    color: "#666",
  },
});
