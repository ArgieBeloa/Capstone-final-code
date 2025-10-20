import { getAllEvents, getEventImageByLocation } from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import { getStudentById } from "@/api/students/controller";
import { StudentModel } from "@/api/students/model";
import {
  StudentNotification,
  StudentUpcomingEvents
} from "@/api/students/utils";
import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const Home = () => {
  const { studentToken, userId, studentData, setStudentData, eventData } =
    useUser();
  const student: StudentModel = studentData;
  const firstLetter = student.studentName.charAt(0);

  const [studentNotification, setStudentNotification] = useState<
    StudentNotification[]
  >([]);
  const [hasEventRegister, setHasEventRegister] = useState<boolean>(false);
  const [studentUpcomingEvents, setStudentUpcomingEvents] = useState<
    StudentUpcomingEvents[]
  >([]);
  // const [studenRecentEvaluation, setStudenRecentEvaluation] = useState<StudentRecentEvaluation[]>([]);
  const [searchSuggestion, setSearchSuggestion] = useState<EventModel[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchId, setSearchId] = useState("no id");
  const scrollX = useRef(new Animated.Value(0)).current;
  const [events, setEvent] = useState<EventModel[]>([]);

  const haddleRegisterClick = (id: string) => {
    router.push(`../EventDetails/${id}`);
  };

  const haddleNotificationClick = () => {
    router.push(`../Notification/studentNotication`);
  };

  const handleSelect = (id: string, title: string) => {
    setSearchText(title);
    setShowSuggestions(false);
    // router.push(`../EventDetails/${id}`);
    setSearchId(id);
  };

  // Fetch student data on mount
  useFocusEffect(
    useCallback(() => {
      const getStudentData = async () => {
        const student = await getStudentById(studentToken, userId);
        setStudentData(student);
        const upcomingEvents = student.studentUpcomingEvents;
        const recentEvaluation = student.studentRecentEvaluations;
        const updatedUpcomingEvents = upcomingEvents.filter(
          (upEvent) =>
            !recentEvaluation.some(
              (evalEvent) => evalEvent.eventId === upEvent.eventId
            )
        );

        setStudentUpcomingEvents(updatedUpcomingEvents);
        setStudentNotification(student.studentNotifications)

        const events = await getAllEvents(studentToken);
        setEvent(events);
      };
      getStudentData();
    }, [])
  );

  // 🔍 Smart search with sorting and live update
  useEffect(() => {
    const getAllEventsFunction = async () => {
      if (!studentToken || searchText.trim() === "") {
        setSearchSuggestion([]);
        return;
      }

      const allEvents = await getAllEvents(studentToken);
      const query = searchText.toLowerCase();

      const filtered = allEvents
        .filter((event: EventModel) =>
          event.eventTitle.toLowerCase().includes(query)
        )
        .sort((a: EventModel, b: EventModel) => {
          const aTitle = a.eventTitle.toLowerCase();
          const bTitle = b.eventTitle.toLowerCase();

          if (aTitle === query) return -1;
          if (bTitle === query) return 1;
          if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
          if (bTitle.startsWith(query) && !aTitle.startsWith(query)) return 1;

          return aTitle.indexOf(query) - bTitle.indexOf(query);
        });

      setSearchSuggestion(filtered);
    };

    getAllEventsFunction();
  }, [searchText]);

  // ✨ Highlight matched part in title
  const highlightMatch = (text: string, query: string) => {
    if (!query) return <Text>{text}</Text>;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const startIndex = lowerText.indexOf(lowerQuery);

    if (startIndex === -1) return <Text>{text}</Text>;

    const endIndex = startIndex + query.length;

    return (
      <Text>
        {text.substring(0, startIndex)}
        <Text style={{ fontWeight: "bold", color: COLORS.Primary }}>
          {text.substring(startIndex, endIndex)}
        </Text>
        {text.substring(endIndex)}
      </Text>
    );
  };

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

          {/* 🔎 Search bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 10,
              minWidth: 135,
              position: "relative",
              paddingRight: 8,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                paddingLeft: 10,
                fontSize: 12,
                color: "#000",
              }}
              placeholder="Search..."
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                setShowSuggestions(text.length > 0);
              }}
              onSubmitEditing={async () => {
                const query = searchText.trim();
                if (!query) return;

                try {
                  const allEvents = await getAllEvents(studentToken);
                  const filtered = allEvents.filter((event: EventModel) =>
                    event.eventTitle.toLowerCase().includes(query.toLowerCase())
                  );
                  setSearchSuggestion(filtered);
                  setShowSuggestions(true);
                } catch (error) {
                  console.log("Search error:", error);
                }
              }}
              placeholderTextColor="#999"
              returnKeyType="search"
            />

            {/* 💡 Popup suggestion */}
            {showSuggestions && searchSuggestion.length > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: 25,
                  left: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  elevation: 5,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  maxHeight: 100,
                  zIndex: 1000,
                }}
              >
                <FlatList
                  data={searchSuggestion}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelect(item.id, item.eventTitle)}
                      style={{
                        paddingVertical: 5,
                        paddingHorizontal: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: "#eee",
                      }}
                    >
                      <Text style={{ fontSize: 10 }}>
                        {highlightMatch(item.eventTitle, searchText)}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {/* 🔍 Search button */}
            <TouchableOpacity
              //
              onPress={() => router.push(`../EventDetails/${searchId}`)}
            >
              <Ionicons
                name="search"
                size={18}
                color="#555"
                style={{ marginRight: 6 }}
              />
            </TouchableOpacity>

            {/* ❌ Clear */}
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchText("");
                  setShowSuggestions(false);
                }}
              >
                <Ionicons name="close-circle" size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>

          {/* 🔔 Notification */}
          <TouchableHighlight onPress={() => haddleNotificationClick()}>
            <View>
              {studentNotification.length !== 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>
                    {studentNotification.length}
                  </Text>
                </View>
              )}
              <Ionicons
                name="notifications-outline"
                size={22}
                style={styles.icon}
              />
            </View>
          </TouchableHighlight>
        </View>

        {/* Registered Events */}
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
                      source={getEventImageByLocation(item.eventLocation)}
                      style={[styles.page, { flex: 1 }]}
                      resizeMode="cover"
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
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Text>Please go to </Text>
                <TouchableHighlight
                  onPress={() => router.push("/(tabs)/events")}
                  underlayColor="transparent"
                >
                  <Text
                    style={{
                      textDecorationLine: "underline",
                      color: COLORS.Primary,
                      fontWeight: "500",
                    }}
                  >
                    Event tab
                  </Text>
                </TouchableHighlight>
                <Text> to register.</Text>
              </View>
            </View>
          )}
        </View>

        {/* Upcoming Events */}
        <Text style={styles.eventTextTitle}>Upcoming events</Text>
        <Animated.FlatList
          data={events}
          contentContainerStyle={{ marginHorizontal: 10 }}
          renderItem={({ item }: { item: EventModel }) => (
            <TouchableHighlight onPress={() => haddleRegisterClick(item.id)}>
              <View style={styles.upcomingEventView}>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "600", fontSize: 19 }}>
                      {item.eventTitle}
                    </Text>
                    <Text>{item.eventLocation}</Text>
                  </View>
                </View>
                <View style={styles.dividerLine} />
                <View style={{ flexDirection: "row" }}>
                  <MaterialCommunityIcons
                    name="calendar-outline"
                    size={24}
                    color="black"
                  />
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      marginLeft: 5,
                    }}
                  >
                    <Text>{item.eventTimeLength}</Text>
                    <Text>{item.eventDate}</Text>
                  </View>
                </View>
              </View>
            </TouchableHighlight>
          )}
          ListEmptyComponent={
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                  margin: "auto",
                }}
              >
                No Event for Now
              </Text>
            </View>
          }
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
    position: "relative",
    zIndex: 10,
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
    width: 14,
    height: 14,
    right: 5,
    position: "absolute",
    backgroundColor: "red",
    borderRadius: 40,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: { color: "white", fontSize: 9 },
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
