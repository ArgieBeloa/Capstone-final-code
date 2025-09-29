import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event, Student } from "../Oop/Types";

const Events = () => {
  const [hasNotification, setHasNotification] = useState(true);
  const {
    studentToken,
    studentNumber,
    studentData,
    setStudentData,
    eventData,
  } = useUser();
  const navigationTitle: string[] = ["All", "Technology", "Academic"];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const router = useRouter();

  const student: Student = studentData;
  const firstLetter = student.studentName.charAt(0);

  const [studentNotification, setStudentNotification] = useState(Number);

  const haddleViewDetails = (id: string) => {
    router.push(`../EventDetails/${id}`);
  };
  const haddleNotificationClick = () => {
    router.push(`../Notification/studentNotication`);
  };
  return (
    <LinearbackGround>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.headContainer}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>{firstLetter}</Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good Day</Text>
            <Text style={styles.name}>{student.studentName}</Text>
          </View>

          <TouchableHighlight onPress={() => haddleNotificationClick()}>
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

        <View style={styles.eventsNavigationContainer}>
          {navigationTitle.map((title, index) => {
            const isActive = selectedIndex === index;
            return (
              <TouchableHighlight
                key={index} // key goes here
                style={[
                  styles.eventsNavigationContainerButton, // base style
                  isActive && styles.activeButton, // active style if selected
                ]}
                onPress={() => setSelectedIndex(index)} // update active index
                underlayColor="#ddd"
              >
                <Text style={styles.eventsNavigationContainerButtonText}>
                  {title}
                </Text>
              </TouchableHighlight>
            );
          })}
        </View>

        {/* events data */}
        <Animated.FlatList
          data={eventData}
          contentContainerStyle={{
            marginHorizontal: 10,
            // marginTop: 30,

            // overflow: "hidden",
            paddingVertical: 5,

            // backgroundColor: COLORS.EGGWHITE,
          }}
          renderItem={({ item }: { item: Event }) => {
            return (
              <TouchableHighlight onPress={() => haddleViewDetails(item.id)}>
                <View style={styles.eventFlatListContainer}>
                  <ImageBackground
                    source={require("@/assets/images/auditorium.jpg")}
                    style={[styles.imageBgFlatlist, { flex: 1 }]}
                    imageStyle={{ resizeMode: "cover" }}
                  >
                    <View style={{ marginTop: "auto", paddingLeft: 10 }}>
                      {/* <Text>{item.id}</Text> */}
                      <Text style={[styles.eventTitleFlatlist, {}]}>
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
            );
          }}
        />
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Events;

const styles = StyleSheet.create({
  safeAreaView: {
    width: "100%",
    height: "100%",
  },

  headContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 10,
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: { color: "#fff", fontWeight: 700, fontSize: 20 },
  headerText: { flex: 1, marginLeft: 10 },
  greeting: { fontSize: 12, color: "#666" },
  name: { fontSize: 16, fontWeight: "bold", color: "#222" },
  icon: { marginHorizontal: 5 },

  // events navigation container
  eventsNavigationContainer: {
    backgroundColor: COLORS.Forth,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    paddingLeft: 5,
    paddingVertical: 5,
    // flex properties
    flexDirection: "row",
    gap: 10,
    // marginBottom: 10,
  },
  eventsNavigationContainerButton: {
    backgroundColor: COLORS.Forth,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginVertical: 2,
    borderRadius: 10,
  },
  eventsNavigationContainerButtonText: {
    fontWeight: 500,
  },
  activeButton: {
    backgroundColor: COLORS.Secondary,
  },
  // flatlist events

  eventFlatListContainer: {
    backgroundColor: COLORS.Forth,
    marginVertical: 5,
    borderRadius: 10,
    shadowOffset: {
      width: 5, // Horizontal offset
      height: 5, // Vertical offset
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    // These elevation properties are for Android
    elevation: 10,
    overflow: "hidden",

    width: "100%",
    // width: "100%",
    height: 200,
    // marginTop:10,
  },
  imageBgFlatlist: {
    // borderRadius: 10,
    width: "100%",
    height: 200,
  },
  eventTitleFlatlist: {
    color: COLORS.textColorWhite,
    fontSize: 18,
  },
  eventTitleTextFlatlist: {
    color: COLORS.textColorWhite,
  },
  eventFlatlistButton: {
    // paddingHorizontal:4,
    // paddingVertical:2,
    // backgroundColor: COLORS.Primary,
    marginLeft: "auto",
    marginRight: 5,
    borderRadius: 5,
  },
  eventFlatlistButtonText: {
    textDecorationLine: "underline",
    // color: "#2f2ff0ff",
    color: COLORS.Third,
    textAlign: "center",
    marginBottom: 0,
    fontSize: 12,
    fontWeight: "600",
  },
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
});
