import { getAllEvents } from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import { StudentModel } from "@/api/students/model";
import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
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

const Events = () => {
  const { studentToken, studentData, eventData } = useUser();

  const navigationTitle: string[] = [
    "All",
    "Technology",
    "Academic",
    "Health",
    "Others",
  ];
  const [selectedTitle, setSelectedTitle] = useState("All");

  const [eventState, setEventState] = useState<EventModel[]>(eventData);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const router = useRouter();
  const student: StudentModel = studentData;
  const firstLetter = student.studentName.charAt(0);

  const [studentNotification, setStudentNotification] = useState<number>(
    studentData.studentNotifications.length || 0
  );
  const [searchText, setSearchText] = useState("");
  const [searchSuggestion, setSearchSuggestion] = useState<EventModel[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchId, setSearchId] = useState("no id");

  const haddleViewDetails = (id: string) => {
    router.push(`../EventDetails/${id}`);
  };

  const haddleNotificationClick = () => {
    router.push(`../Notification/studentNotication`);
  };

  const handleSelect = (id: string, title: string) => {
    setSearchText(title);
    setShowSuggestions(false);
    setSearchId(id);
  };

  const handleClickNavigation = (title: string) => {
    setSelectedTitle(title);
  };
  useEffect(() => {
    const getEvent = async () => {
      
      
      if (selectedIndex === 0) {
        setEventState(eventData);
      } else {
        // const event =  selectedTitle);
        const event = eventData.filter((event)=> event.eventCategory.toLowerCase() === selectedTitle.toLowerCase())
        setEventState(event);
      }
    };
    getEvent();
  }, [selectedTitle]);

  // Fetch & filter events for search
  useEffect(() => {
    const fetchFilteredEvents = async () => {
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

    fetchFilteredEvents();
  }, [searchText]);

  // Highlight matching letters
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
          <TouchableHighlight onPress={haddleNotificationClick}>
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
                size={22}
                style={styles.icon}
              />
            </View>
          </TouchableHighlight>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.eventsNavigationContainer}>
          {navigationTitle.map((title, index) => {
            const isActive = selectedIndex === index;
            return (
              <TouchableHighlight
                key={index}
                style={[
                  styles.eventsNavigationContainerButton,
                  isActive && styles.activeButton,
                ]}
                onPress={() => {
                  setSelectedIndex(index);
                  handleClickNavigation(title);
                }}
                underlayColor="#ddd"
              >
                <Text style={styles.eventsNavigationContainerButtonText}>
                  {title}
                </Text>
              </TouchableHighlight>
            );
          })}
        </View>

        {/* Events List */}

        {eventState.length !== 0 ? (
          <>
            <Animated.FlatList
              data={eventState}
              contentContainerStyle={{
                marginHorizontal: 10,
                paddingVertical: 5,
              }}
              renderItem={({ item }: { item: EventModel }) => (
                <TouchableHighlight onPress={() => haddleViewDetails(item.id)}>
                  <View style={styles.eventFlatListContainer}>
                    <ImageBackground
                      source={require("@/assets/images/auditorium.jpg")}
                      style={[styles.imageBgFlatlist]}
                      imageStyle={{ resizeMode: "cover" }}
                    >
                      <View style={{ marginTop: "auto", paddingLeft: 10 }}>
                        <Text style={styles.eventTitleFlatlist}>
                          {item.eventTitle}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 5,
                          paddingLeft: 5,
                          marginBottom: 5,
                        }}
                      >
                        <AntDesign
                          name="calendar"
                          size={17}
                          color={COLORS.textColorWhite}
                        />
                        <Text style={styles.eventTitleTextFlatlist}>
                          {item.eventDate}
                        </Text>
                        <AntDesign
                          name="clockcircleo"
                          size={17}
                          color={COLORS.textColorWhite}
                        />
                        <Text style={styles.eventTitleTextFlatlist}>
                          {item.eventTime}
                        </Text>
                        <Entypo
                          name="location"
                          size={17}
                          color={COLORS.textColorWhite}
                        />
                        <Text style={styles.eventTitleTextFlatlist}>
                          {item.eventLocation}
                        </Text>
                      </View>
                    </ImageBackground>
                  </View>
                </TouchableHighlight>
              )}
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
            <Text style={{ margin: "auto" }}>No events available!</Text>
          </View>
        )}
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Events;

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
  eventsNavigationContainer: {
    backgroundColor: COLORS.Forth,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    paddingLeft: 5,
    paddingVertical: 5,
    flexDirection: "row",
    gap: 10,
  },
  eventsNavigationContainerButton: {
    backgroundColor: COLORS.Forth,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginVertical: 2,
    borderRadius: 10,
  },
  eventsNavigationContainerButtonText: { fontWeight: "500" },
  activeButton: { backgroundColor: COLORS.Secondary },
  eventFlatListContainer: {
    backgroundColor: COLORS.Forth,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 10,
    overflow: "hidden",
    width: "100%",
    minHeight: 200,
    justifyContent: "flex-end"
  },
  imageBgFlatlist: { width: "100%", height: "100%" },
  eventTitleFlatlist: {
    color: COLORS.textColorWhite,
    fontSize: 18,
  },
  eventTitleTextFlatlist: {
    color: COLORS.textColorWhite,
  },
});
