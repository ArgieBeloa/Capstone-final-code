import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");

const Home = () => {
  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;

  const data = [
    { id: "1", color: "#FF6B6B", name: "Argie", location: "Manila" },
    { id: "2", color: "#4ECDC4", name: "John", location: "Cebu" },
    { id: "3", color: "#556270", name: "Jane", location: "Davao" },
    { id: "4", color: "#C7F464", name: "Mark", location: "Baguio" },
  ];

  const data1 = [
    {
      title: "PSIT DAY",
      organizer: "SSPC",
      location: "Slec",
      eventLenght: "1Pm - 5Pm",
      date: "August 31, 2025",
    },
    {
      title: "PSIT DAY",
      organizer: "SSPC",
      location: "Slec",
      eventLenght: "1Pm - 5Pm",
      date: "August 31, 2025",
    },
    {
      title: "PSIT DAY",
      organizer: "SSPC",
      location: "Slec",
      eventLenght: "1Pm - 5Pm",
      date: "August 31, 2025",
    },
    {
      title: "PSIT DAY",
      organizer: "SSPC",
      location: "Slec",
      eventLenght: "1Pm - 5Pm",
      date: "August 31, 2025",
    },
  ];

  const scrollX = useRef(new Animated.Value(0)).current;

  // const renderRegisterEvent = ({ item }: { item: any }) => {
  //   return (
  //     <View style={styles.flatlistViewRegisterEvent}>
  //       <Text>{item.name}</Text>
  //     </View>
  //   );
  // };

  return (
    <LinearbackGround>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.headContainer}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileText}>J</Text>
          </View>

          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good Evening</Text>
            <Text style={styles.name}>John Mark Gregorio</Text>
          </View>

          <View>
            <Ionicons
              name="notifications-outline"
              size={24}
              style={styles.icon}
            />
          </View>
        </View>

        {/* Register event */}
        <Text style={styles.eventTextTitle}>Events you registered for</Text>

        <View>
          <Animated.FlatList
            data={data}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            renderItem={({ item }) => (
              <View style={[styles.page, { backgroundColor: item.color }]}>
                <View style={styles.card}>
                  {/* <Text style={styles.cardName}>{item.name}</Text>
                  <Text style={styles.cardLocation}>{item.location}</Text> */}
                </View>
              </View>
            )}
            contentContainerStyle={{ flexGrow: 1 }}
          />
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {data.map((_, i) => {
              const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [10, 20, 10], // active dot is bigger
                extrapolate: "clamp",
              });
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3], // active dot is fully visible
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
        </View>
        {/* end of register flatlist */}

        {/* upcoming events */}

        <Text style={styles.eventTextTitle}>Upcoming events</Text>
        <Text style={{marginLeft:10, marginBottom: 6}}>10/50</Text>
        <Container>
          <Animated.FlatList
            data={data1}
            contentContainerStyle={{
              marginHorizontal: 10,
            }}
            renderItem={({ item }) => {

              const eventOrganizerAndLocation = item.organizer +" "+ item.location
              return (
                <View style={styles.upcomingEventView}>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{fontWeight: 600, fontSize: 19}}>{item.title}</Text>
                      <Text>{eventOrganizerAndLocation}</Text>
                     
                    </View>
                    {/* check icon */}
                    <AntDesign
                      name="checkcircle"
                      size={24}
                      color={COLORS.Primary}
                      style={{ margin: "auto" }}
                    />
                  </View>
                  {/* divider line */}
                  <View style={{
                   height: 3,
                   marginVertical: 10,
                   backgroundColor: "grey",
                   borderRadius:10,
                  }}></View>


                  <View style={{flexDirection: "row"}}>
                    <MaterialCommunityIcons
                      name="calendar-outline"
                      size={24}
                      color="black"
                    />
                    <View style={{flex:1, flexDirection: "column", marginLeft:5}}>
                      <Text>{item.eventLenght}</Text>
                      <Text>{item.date}</Text>


                    </View>
                  </View>
                </View>
              );
            }}
          />
        </Container>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Home;

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

  eventTextTitle: {
    fontSize: 20,
    fontWeight: 500,
    margin: 10,
  },

  page: {
    width: width - 20,
    maxWidth: 500,
    marginHorizontal: 10,
    height: 250,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.Primary,
    marginHorizontal: 5,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  cardName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  cardLocation: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  // upcoming events css
  upcomingEventView: {
    marginVertical: 7,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: COLORS.Third,
  },
  upcomingEventViewTitle: {},
  upcomingEventViewText: {},
});
