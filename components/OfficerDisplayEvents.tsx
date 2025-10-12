import { Event } from "@/app/Oop/Types";
import { COLORS } from "@/constants/ColorCpc";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearProgressBar from "./LinearProgressBar";

interface OfficerDisplayEventsProps {
  events: Event[];
}

const OfficerDisplayEvents: React.FC<OfficerDisplayEventsProps> = ({
  events,
}) => {

    const router = useRouter()
  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={()=> router.push(`../officerEventDetails/${item.id}`)}>
            <View style={styles.card}>
              <View style={{ flexDirection: "row" }}>
                {/* image */}
                <View>
                  <Image
                    source={require("@/assets/images/eventPic1.jpg")}
                    resizeMode="cover"
                    style={{ width: 150, height: "100%", borderRadius: 5 }}
                  />
                </View>

                {/* event basic info */}
                <View style={{ marginTop: 10, marginLeft: 5, flex: 1 }}>
                  <Text style={styles.title}>{item.eventTitle}</Text>
                  <Text style={styles.info}>{item.eventDate}</Text>
                  <Text style={styles.info}>{item.eventTime}</Text>
                  <Text style={styles.info}>{item.eventTimeLength}</Text>

                  {/* linear process */}
                  <LinearProgressBar
                    value={item.eventAttendances?.length || 0}
                    max={item.allStudentAttending}
                    title={"Attended"}
                  />
                  <LinearProgressBar
                    value={item.eventEvaluationDetails?.length || 0}
                    max={item.eventAttendances?.length || 0}
                    title={"Evaluated"}
                  />
                </View>

                {/*  eveny attendance and evaluation*/}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No events to display</Text>
        }
        contentContainerStyle={{maxHeight:270}}
      />
    </View>
  );
};

export default OfficerDisplayEvents;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // minWidth: 700,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: COLORS.Third,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  shortDesc: {
    color: "#555",
    marginBottom: 6,
  },
  info: {
    color: "#333",
    marginLeft: 5,
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
});
