import LinearbackGround from "@/components/LinearBackGround";
import { COLORS } from "@/constants/ColorCpc";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Rates = () => {
  const data = [
    { id: "123", title: "PSIT DAY", dateAttended: "September 02, 2025" },
    { id: "124", title: "PSIT DAY", dateAttended: "September 02, 2025" },
  ];

  const router = useRouter();

  const haddleEvaluationPage = (id: string) => {
    router.push({
      pathname: `../Evaluation/${id}`,
      params: { id },
    });
  };

  return (
    <LinearbackGround>
      <SafeAreaView>
        <View style={styles.containerEventHeader}>
          <Text style={styles.containerEventHeaderText}>Event Attended</Text>
        </View>
        <View>
          <Animated.FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <TouchableHighlight
                onPress={()=>haddleEvaluationPage(item.id)}
                >
                  <View style={styles.flatlistContainer}>
                    <Text>{item.title}</Text>
                    <Text>{item.dateAttended}</Text>
                  </View>
                </TouchableHighlight>
              );
            }}
          />
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
    paddingVertical: 5,
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
});
