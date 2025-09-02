import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { Ionicons } from "@expo/vector-icons";
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

const Events = () => {
  const [hasNotification, setHasNotification] = useState(true);

  const navigationTitle: string[] = ["All", "Technology", "Academic"];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);

  const data = [
    {
      id: "123",
      title: "PSIT",
      imagePath: require("@/assets/images/auditorium.jpg"),
    },
    {
      id: "124",
      title: "PSIT",
      imagePath: require("@/assets/images/auditorium.jpg"),
    },
    {
      id: "125",
      title: "PSIT",
      imagePath: require("@/assets/images/auditorium.jpg"),
    },
  ];
  return (
    <LinearbackGround>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.headContainer}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>J</Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good Day</Text>
            <Text style={styles.name}>John Mark Gregorio</Text>
          </View>

          <View>
            {hasNotification && (
              <View
                style={{
                  width: 20,
                  height: 20,
                  right: 5,
                  position: "absolute",
                  backgroundColor: "black",
                  borderRadius: 40,

                  zIndex: 10,
                }}
              >
                <Text style={{ color: "white", margin: "auto", fontSize: 12 }}>
                  1
                </Text>
              </View>
            )}
            <Ionicons
              name="notifications-outline"
              size={30}
              style={styles.icon}
            />
          </View>
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
          data={data}
          contentContainerStyle={{
            marginHorizontal: 10,
            // marginTop: 30,

            // overflow: "hidden",
            paddingVertical: 5,

            

            // backgroundColor: COLORS.EGGWHITE,
          }}
          renderItem={({ item }) => {
            return (
              <View style={styles.eventFlatListContainer}>
                <ImageBackground
                  style={styles.imageBgFlatlist}
                  source={item.imagePath}
                >
                  <Text>{item.id}</Text>
                  <Text>{item.title}</Text>
                </ImageBackground>
              </View>
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
    backgroundColor: COLORS.Third,
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
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // These elevation properties are for Android
    elevation: 10,
    overflow: "hidden",

    width: "100%",
    // marginTop:10,
  },
  imageBgFlatlist: {
    // borderRadius: 10,
    width: "100%",
    height: 200,
  },
});
