import { COLORS } from "@/constants/ColorCpc";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";
// props as parameter
interface EventDisplayProps {

  title?: string;
  date?: string;
  time?: string;
  location?: string;
}

const EventDisplay: React.FC<EventDisplayProps> = ({
 
  title = "No title",
  date = "no date",
  time = "no time",
  location = "no location",
}) => {
  const router = useRouter();

  const dateAndTime = date + " " + time;
  return (
 
        <View style={styles.container}>
          <AntDesign name="calendar" size={17} color={COLORS.textColorWhite} />
          <Text>{title}</Text>
          <AntDesign
            name="clockcircleo"
            size={17}
            color={COLORS.textColorWhite}
          />
          <Text>{dateAndTime}</Text>
          <Entypo name="location" size={17} color={COLORS.textColorWhite} />
          <Text>{location}</Text>
        </View>
 
  );
};

export default EventDisplay;

const styles = StyleSheet.create({
  imageBG: { minHeight: 100, resizeMode: "cover", flex: 1 },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,

    marginTop: "auto",
    marginBottom: 10,
  },
});
