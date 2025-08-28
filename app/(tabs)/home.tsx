import LinearbackGround from "@/components/LinearBackGround";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;

  const data = [
    { id: "1", name: "Item 1" },
    { id: "2", name: "Item 2" },
    { id: "3", name: "Item 3" },
    { id: "4", name: "Item 4" },
  ];

  //  function render item register event
  const renderRegisterEvent = ({ item }: { item: any }) => {
    return (
      <View style={styles.flatlistViewRegisterEvent}>
        <Text>{item.name}</Text>
      </View>
    );
  };

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

          <Ionicons
            name="notifications-outline"
            size={24}
            style={styles.icon}
          />
        </View>

        {/* Register event */}
        <Text style={styles.registerEventText}>Events you registered for</Text>

        <Container>
          <FlatList data={data} renderItem={renderRegisterEvent}
           horizontal={true}  
           style = {styles.flatlistRegisterContainer}
        
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
    alignItems: "center",
    margin: 10,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  profileText: { color: "#fff", fontWeight: "bold" },
  headerText: { flex: 1, marginLeft: 10 },
  greeting: { fontSize: 12, color: "#666" },
  name: { fontSize: 16, fontWeight: "bold", color: "#222" },
  icon: { marginHorizontal: 5 },

  registerEventText: {
    fontSize: 15,
    fontWeight: 500,
    margin: 10,
  },
  flatlistRegisterContainer:{

    backgroundColor: "grey",
    width: "100%",
    height: 200,
    paddingVertical:5

  },
  flatlistViewRegisterEvent:{
    width :200,
    backgroundColor: "white",
    marginHorizontal:5

  }
});
