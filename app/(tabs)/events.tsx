import LinearbackGround from "@/components/LinearBackGround";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Events = () => {
  const [hasNotification, setHasNotification] = useState(true);

  const data = [
    {
      id: "123",
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

        {/* events data */}
        <Animated.FlatList
          data={data}
          contentContainerStyle={{
            marginHorizontal: 10,
          }}
          renderItem={({ item }) => {
            const name = "Argie"
            return (
              <View>
                <Text>{item.id}</Text>
                <Text>{name}</Text>
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
});
