import { studentDataFunction } from "@/api/spring";
import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";

import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event, Student, StudentUpcomingEvents } from "../Oop/Types";
const { width } = Dimensions.get("window");

const Home = () => {
  const {
    studentToken,
    studentNumber,
    studentData,
    setStudentData,
    eventData,
  } = useUser();
  const student: Student = studentData;
  const firstLetter = student.studentName.charAt(0);

  const [studentNotification, setStudentNotification] = useState(Number);
  const [hasEventRegister, setHasEventRegister] = useState<boolean>(false);
  const [studentUpcomingEvents, setStudentUpcomingEvents] = useState([]);
  const scrollX = useRef(new Animated.Value(0)).current;

  // program event
  const haddleRegisterClick = (id: string) => {
    router.push(`../EventDetails/${id}`);
  };
  const haddleNotificationClick = () => {
    router.push(`../Notification/studentNotication`);
  };

  // Fetch student data on mount
  useEffect(() => {
    const getStudentData = async () => {
      try {
        if (!studentNumber || !studentToken) return;

        const data = await studentDataFunction(studentNumber, studentToken);
        setStudentUpcomingEvents(data.studentUpcomingEvents);
        // console.log("Student upcoming events ", data.studentUpcomingEvents);
        setHasEventRegister(true);
        setStudentData(data);
        setStudentNotification(data.numberOfNotification);
        // setHasEventRegister(true);
        // // Check if student has upcoming events
        // if (data.studentUpcomingEvents && data.studentUpcomingEvents.length > 0) {
        //   setHasEventRegister(true);
        // } else {
        //   setHasEventRegister(false);
        // }
      } catch (error) {
        console.log("Failed to fetch student data:", error);
        // setHasEventRegister(false);
      }
    };

    getStudentData();
  }, []);

  // console.log(hasEventRegister);

  return (
    <LinearbackGround>
      <SafeAreaView style={styles.safeAreaView}>
        {/* Header */}
        <View style={styles.headContainer}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>{firstLetter}</Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good Day</Text>
            <Text style={styles.name}>{student.studentName}</Text>
          </View>

          {/* //  notication area */}

          <TouchableHighlight onPress={()=> haddleNotificationClick()}>
            <View>
              {studentNotification !== 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>
                    {studentNotification}
                  </Text>
                </View>
              )}
              <Ionicons
                name="notifications-outline"
                size={30}
                style={styles.icon}
              />
            </View>
          </TouchableHighlight>
        </View>

        {/* Registered events */}
        <Text style={styles.eventTextTitle}>Events you registered for</Text>
        <View style={{ minHeight: 250 }}>
          {studentUpcomingEvents.length !== 0 ? (
            <>
              <Animated.FlatList
                data={studentUpcomingEvents}
                keyExtractor={(item) => item.eventId}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: false }
                )}
                renderItem={({ item }: { item: StudentUpcomingEvents }) => (
                  <TouchableHighlight
                    onPress={() => haddleRegisterClick(item.eventId)}
                  >
                    <ImageBackground
                      source={require("@/assets/images/auditorium.jpg")}
                      style={[styles.page, { flex: 1 }]}
                      imageStyle={{ resizeMode: "cover" }}
                    >
                      <View style={styles.page}>
                        <Text style={styles.pageTitle}>{item.eventTitle}</Text>
                        <View style={styles.pageInfoRow}>
                          <AntDesign
                            name="calendar"
                            size={17}
                            color={COLORS.textColorWhite}
                          />
                          <Text style={styles.pageConatinerText}>
                            {item.eventDate}
                          </Text>
                          <AntDesign
                            name="clockcircleo"
                            size={17}
                            color={COLORS.textColorWhite}
                          />
                          <Text style={styles.pageConatinerText}>
                            {item.eventTime}
                          </Text>
                          <Entypo
                            name="location"
                            size={17}
                            color={COLORS.textColorWhite}
                          />
                          <Text style={styles.pageConatinerText}>
                            {item.eventLocation}
                          </Text>
                        </View>
                      </View>
                    </ImageBackground>
                  </TouchableHighlight>
                )}
              />

              {/* Pagination Dots */}
              <View style={styles.pagination}>
                {studentUpcomingEvents.map((_: any, i: number) => {
                  const inputRange = [
                    (i - 1) * width,
                    i * width,
                    (i + 1) * width,
                  ];
                  const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: "clamp",
                  });
                  const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: "clamp",
                  });
                  return (
                    <Animated.View
                      key={i.toString()}
                      style={[styles.dot, { width: dotWidth, opacity }]}
                    />
                  );
                })}
              </View>
            </>
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text>No events available!</Text>
              <Text>
                Please Go To{" "}
                <TouchableHighlight
                  onPress={() => router.push("/(tabs)/events")}
                >
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      color: COLORS.Primary,
                    }}
                  >
                    Event tab to register
                  </Text>
                </TouchableHighlight>
              </Text>
            </View>
          )}
        </View>

        {/* Upcoming events */}
        <Text style={styles.eventTextTitle}>Upcoming events</Text>
        <Animated.FlatList
          data={eventData}
          contentContainerStyle={{ marginHorizontal: 10 }}
          renderItem={({ item }: { item: Event }) => (

             <TouchableHighlight
                    onPress={() => haddleRegisterClick(item.id)}
                  >
            <View style={styles.upcomingEventView}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "600", fontSize: 19 }}>
                    {item.eventTitle}
                  </Text>
                  <Text>{item.eventLocation}</Text>
                </View>
                {/* <AntDesign
                  name="checkcircle"
                  size={24}
                  color={COLORS.Primary}
                  style={{ margin: "auto" }}
                /> */}
              </View>

              <View style={styles.dividerLine} />

              <View style={{ flexDirection: "row" }}>
                <MaterialCommunityIcons
                  name="calendar-outline"
                  size={24}
                  color="black"
                />
                <View
                  style={{ flex: 1, flexDirection: "column", marginLeft: 5 }}
                >
                  <Text>{item.eventTimeLength}</Text>
                  <Text>{item.eventDate}</Text>
                </View>
              </View>
            </View>
            </TouchableHighlight>
          )}
        />
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeAreaView: { width: "100%", height: "100%" },
  headContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 10,
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: { color: "#fff", fontWeight: "700", fontSize: 20 },
  headerText: { flex: 1, marginLeft: 10 },
  greeting: { fontSize: 12, color: "#666" },
  name: { fontSize: 16, fontWeight: "bold", color: "#222" },
  icon: { marginHorizontal: 5 },
  notificationBadge: {
    width: 20,
    height: 20,
    right: 5,
    position: "absolute",
    backgroundColor: "black",
    borderRadius: 40,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: { color: "white", fontSize: 12 },
  //end of header
  
  eventTextTitle: { fontSize: 20, fontWeight: "500", margin: 10 },
  page: {
    width: width - 20,
    maxWidth: 500,
    marginHorizontal: 10,
    height: 250,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  pageTitle: { color: COLORS.textColorWhite, fontSize: 24, fontWeight: "600" },
  pageInfoRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  pageConatinerText: { color: COLORS.textColorWhite },
  pagination: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.Primary,
    marginHorizontal: 5,
  },
  upcomingEventView: {
    marginVertical: 7,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: COLORS.Third,
  },
  dividerLine: {
    height: 3,
    marginVertical: 10,
    backgroundColor: "grey",
    borderRadius: 10,
  },
});
