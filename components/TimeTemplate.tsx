// import React from "react";
// import { StyleSheet, Text, TouchableOpacity, View, Platform} from "react-native";

// type timeTemplateProp = {
//     label: string,
//     show: boolean,
//     setShow: (show: boolean) => void

// }

// const TimeTemplate = () => {
//   return (
//    <>
//    <TouchableOpacity
//             style={styles.rowInput}
//             onPress={() => {
//               if (Platform.OS !== "web") {
//                 setShowStartTimePicker(true);
//               }
//             }}
//           >
//             <Clock color={COLORS.Primary} />
//             <Text style={styles.rowText}>
//               {eventStartTime
//                 ? `Start: ${eventStartTime.toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}`
//                 : "Pick Start Time"}
//             </Text>
//           </TouchableOpacity>

//           {Platform.OS === "web" ? (
//             <View style={{ marginVertical: 6 }}>
//               <input
//                 type="time"
//                 value={
//                   eventStartTime
//                     ? eventStartTime.toLocaleTimeString("en-GB", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: false,
//                       })
//                     : ""
//                 }
//                 onChange={(e) => {
//                   const [hours, minutes] = e.target.value
//                     .split(":")
//                     .map(Number);

//                   const date = eventStartTime || new Date();
//                   date.setHours(hours);
//                   date.setMinutes(minutes);
//                   date.setSeconds(0);
//                   date.setMilliseconds(0);

//                   setEventStartTime(new Date(date));
//                 }}
//                 style={{
//                   padding: "12px",
//                   borderRadius: "10px",
//                   border: "1px solid #ccc",
//                   fontSize: "16px",
//                 }}
//               />
//             </View>
//           ) : (
//             showStartTimePicker && (
//               <DateTimePicker
//                 mode="time"
//                 value={eventStartTime || new Date()}
//                 display="default"
//                 onChange={handleStartTimeChange}
//               />
//             )
//           )}

//    </>
//   );
// };

// export default TimeTemplate;

// const styles = StyleSheet.create({
//   rowInput: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 12,
//     marginVertical: 6,
//   },
//   rowText: { fontSize: 16 },
// });
