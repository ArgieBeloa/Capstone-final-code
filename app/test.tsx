// // import { EventModel } from "@/api/events/model";
// // import { EventAttendance } from "@/api/events/utils";
// // import { getOfflineEvents, getOfflineStudents } from "@/api/local/userOffline";
// // import { getStudentById } from "@/api/students/controller";
// // import { StudentModel } from "@/api/students/model";
// // import { StudentEventAttendedAndEvaluationDetails } from "@/api/students/utils";
// // import LinearbackGround from "@/components/LinearBackGround";
// // import { COLORS } from "@/constants/ColorCpc";
// // import { useUser } from "@/src/userContext";
// // import { Entypo, MaterialIcons } from "@expo/vector-icons";
// // import { useFocusEffect } from "@react-navigation/native";
// // import { useRouter } from "expo-router";
// // import React, { useCallback, useState } from "react";
// // import {
// //   Dimensions,
// //   Modal,
// //   Pressable,
// //   StyleSheet,
// //   Text,
// //   TouchableHighlight,
// //   View,
// // } from "react-native";
// // import QRCode from "react-native-qrcode-svg";
// // import Animated, { FadeInUp } from "react-native-reanimated";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import Svg, { Circle } from "react-native-svg";

// // const Profile = () => {
// //   const screenWidth = Dimensions.get("window").width;
// //   const ratingFontSize = Math.min(screenWidth * 0.06, 20);
// //   const labelFontSize = Math.min(screenWidth * 0.045, 14);
// //   const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
// //   const [studentDataQR, setStudentDataQR] = useState<EventAttendance>();
// //   const [student, setStudent] = useState<StudentModel>();
// //   const [events, setEvents] = useState<EventModel[]>();

// //   const {
// //     studentData,
// //     setStudentData,
// //     studentToken,
// //     eventData,
// //     userId,
// //     isUserHasInternet,
// //     eventDataOffline,
// //   } = useUser();

// //   const names = ["John", "mary", "Jane", "micheal", "Rose"];
// //   const departments = ["It", "marketing", "finance", " registrar"];
// //   let studentNumber = Math.floor(Math.random() * 1_000_000);

// //   const randomQRData = {
// //     id: Math.floor(Math.random() * 1_000_000),
// //     studentName: names[Math.floor(Math.random() * names.length)],
// //     department: departments[Math.floor(Math.random() * departments.length)],
// //     studentNumber,
// //   };

// //   const [studentAttendedData, setStudentAttendedData] = useState<
// //     StudentEventAttendedAndEvaluationDetails[]
// //   >(student?.studentEventAttendedAndEvaluationDetails || []);

// //   const [isLogout, setIsLogout] = useState<boolean>(false);
// //   const router = useRouter();

// //   const radius = Math.max(40, Math.min(80, screenWidth / 6));
// //   const strokeWidth = 14;
// //   const circumference = 2 * Math.PI * radius;

// //   const attendedCount = student?.studentEventAttended?.length || 0;
// //   const totalCount = events?.length || 0;
// //   const progress = (attendedCount / (totalCount || 1)) * circumference;

// //   // Get PH time
// //   const now = new Date();
// //   const phOffset = 8 * 60; // UTC+8 in minutes
// //   const phTime = new Date(now.getTime() + phOffset * 60 * 1000);

// //   // Format date
// //   const year = phTime.getUTCFullYear();
// //   const month = String(phTime.getUTCMonth() + 1).padStart(2, "0");
// //   const day = String(phTime.getUTCDate()).padStart(2, "0");

// //   // Format 12-hour time with am/pm
// //   let hours = phTime.getUTCHours();
// //   const minutes = String(phTime.getUTCMinutes()).padStart(2, "0");
// //   const ampm = hours >= 12 ? "pm" : "am";
// //   hours = hours % 12;
// //   hours = hours ? hours : 12; // the hour '0' should be '12'
// //   const timeString = `${hours}:${minutes} ${ampm}`;

// //   // Combine date + time
// //   const dateString = `${year}-${month}-${day}T${timeString}`;

// //   useFocusEffect(
// //     useCallback(() => {
// //       // offline mode
// //       const getOfflineData = async () => {
// //         const localData = await getOfflineStudents();
// //         const localDataEvents = await getOfflineEvents();

// //         console.log("all local student data ", localData);
// //         const studentLocal = localData.find((item: null) => item !== null);
// //         const eventsLocal = localDataEvents.find((item: null) => item !== null);

// //         // set data
// //         setStudent(studentLocal);
// //         setStudentAttendedData(
// //           studentLocal.studentEventAttendedAndEvaluationDetails,
// //         );
// //         setEvents(eventsLocal);
// //       };

// //       // online mode
// //       const getStudentData = async () => {
// //         const studentResponse = await getStudentById(studentToken, userId);
// //         setStudent(studentResponse);
// //         setStudentAttendedData(
// //           studentResponse.studentEventAttendedAndEvaluationDetails,
// //         );

// //         setEvents(eventData);
// //       };

// //       // check internet
// //       if (isUserHasInternet) {
// //         getStudentData();
// //       } else {
// //         getOfflineData();
// //       }
// //     }, []),
// //   );

// //   const handleLogout = () => {
// //     setIsLogout(false);
// //     router.push("/");
// //   };

// //   // student qr generated
// //   const handleStudentQR = (
// //     studentId: string,
// //     studentNumber: string,
// //     studentName: string,
// //     role: string,
// //     department: string,
// //     dateScanned: string,
// //   ) => {
// //     const qrPayload: EventAttendance = {
// //       studentId,
// //       studentNumber,
// //       studentName,
// //       role,
// //       department,
// //       dateScanned,
// //     };

// //     console.log(qrPayload);

// //     setStudentDataQR(qrPayload);
// //     setModalIsVisible(true);
// //   };

// //   return (
// //     <LinearbackGround>
// //       <SafeAreaView style={{ flex: 1 }}>
// //         <View style={styles.container}>
// //           {/* Header */}
// //           <View style={styles.header}>
// //             <View style={styles.headerLeft}>
// //               <View style={styles.avatarArea}>
// //                 <Text style={styles.avatarText}>
// //                   {student?.studentName?.charAt(0)?.toUpperCase() || "?"}
// //                 </Text>
// //               </View>
// //               <Text style={styles.headerTitle}>Profile</Text>
// //             </View>

// //             {/* qr generated students data */}
// //             <View style={{ flexDirection: "row", gap: 10 }}>
// //               <TouchableHighlight
// //                 onPress={() => {
// //                   // random id, name, number and deparment

// //                   handleStudentQR(
// //                     randomQRData.id.toString(),
// //                     randomQRData.studentName,
// //                     randomQRData.department,
// //                     randomQRData.studentNumber.toString(),
// //                     "Student",
// //                     dateString,
// //                   );
// //                 }}
// //               >
// //                 <View style={{ flexDirection: "row", alignItems: "center" }}>
// //                   <MaterialIcons
// //                     name="qr-code-scanner"
// //                     size={24}
// //                     color="black"
// //                   />
// //                   <Text style={{ textAlign: "center" }}>QR</Text>
// //                 </View>
// //               </TouchableHighlight>
// //               {/* QR MODAL */}
// //               <Modal
// //                 visible={modalIsVisible}
// //                 animationType="fade"
// //                 transparent={true}
// //                 onRequestClose={() => setModalIsVisible(false)}
// //               >
// //                 <View style={styles.modalBackground}>
// //                   <View style={styles.modalContainer}>
// //                     <Text
// //                       style={{
// //                         marginBottom: 20,
// //                         fontSize: 18,
// //                         fontWeight: "bold",
// //                       }}
// //                     >
// //                       Student QR
// //                     </Text>
// //                     <QRCode
// //                       value={JSON.stringify(studentDataQR)}
// //                       size={200}
// //                       backgroundColor="white"
// //                       color="black"
// //                     />
// //                     <Pressable
// //                       style={styles.closeButton}
// //                       onPress={() => setModalIsVisible(false)}
// //                     >
// //                       <Text>Close</Text>
// //                     </Pressable>
// //                   </View>
// //                 </View>
// //               </Modal>

// //               {/* 🔘 Logout icon */}
// //               <TouchableHighlight
// //                 onPress={() => setIsLogout(true)}
// //                 underlayColor="transparent"
// //               >
// //                 <View
// //                   style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
// //                 >
// //                   <Entypo name="log-out" size={24} color="black" />
// //                   <Text>Logout</Text>
// //                 </View>
// //               </TouchableHighlight>
// //             </View>
// //           </View>

// //           {/* Student Info */}
// //           <View style={styles.studentInfo}>
// //             <Text style={styles.infoText}>
// //               Student Name: {student?.studentName ?? "no name"}
// //             </Text>
// //             <Text style={styles.infoText}>
// //               Student #: {student?.studentNumber ?? "No Numer"}
// //             </Text>
// //             <Text style={styles.infoText}>
// //               Course: {student?.course.toUpperCase() ?? "?"}
// //             </Text>
// //           </View>

// //           {/* Circle Progress */}
// //           <View style={styles.circleContainer}>
// //             <Svg
// //               width={radius * 2 + strokeWidth}
// //               height={radius * 2 + strokeWidth}
// //             >
// //               {/* Background Circle */}
// //               <Circle
// //                 cx={radius + strokeWidth / 2}
// //                 cy={radius + strokeWidth / 2}
// //                 r={radius}
// //                 stroke="#E5E7EB"
// //                 strokeWidth={strokeWidth}
// //                 fill="none"
// //               />

// //               {/* Progress Circle */}
// //               <Circle
// //                 cx={radius + strokeWidth / 2}
// //                 cy={radius + strokeWidth / 2}
// //                 r={radius}
// //                 stroke="green"
// //                 strokeWidth={strokeWidth}
// //                 fill="none"
// //                 strokeDasharray={circumference}
// //                 strokeDashoffset={circumference - progress}
// //                 strokeLinecap="round"
// //               />
// //             </Svg>

// //             {/* Text Inside Circle */}
// //             <View style={styles.textWrapper}>
// //               <Text style={[styles.ratingText, { fontSize: ratingFontSize }]}>
// //                 {totalCount > 0
// //                   ? `${Math.round((attendedCount / totalCount) * 100)}%`
// //                   : "0%"}
// //               </Text>
// //               <Text
// //                 style={{
// //                   fontSize: labelFontSize - 3,
// //                   fontWeight: "500",
// //                   textAlign: "center",
// //                 }}
// //               >
// //                 Attendance Progress
// //               </Text>
// //             </View>
// //           </View>

// //           {/* Event Evaluated (List) */}
// //           <View style={{ flex: 1 }}>
// //             <Text style={styles.sectionTitle}>Event Attended & Evaluated</Text>

// //             {studentAttendedData.length !== 0 ? (
// //               <Animated.FlatList
// //                 data={studentAttendedData}
// //                 keyExtractor={(item) => item.eventId}
// //                 style={{ flex: 1 }}
// //                 showsVerticalScrollIndicator
// //                 renderItem={({ item }) => (
// //                   <Animated.View
// //                     entering={FadeInUp.duration(500)}
// //                     style={styles.eventCard}
// //                   >
// //                     <View>
// //                       <Text style={styles.eventText}>{item.eventTitle}</Text>
// //                       <Text style={styles.eventText}>
// //                         {item.eventDateAndTime}
// //                       </Text>
// //                     </View>

// //                     <View
// //                       style={{
// //                         justifyContent: "center",
// //                         flexDirection: "row",
// //                         alignItems: "center",
// //                         flexWrap: "wrap",
// //                       }}
// //                     >
// //                       {item.attended ? (
// //                         <Entypo name="check" size={24} color="green" />
// //                       ) : (
// //                         <Entypo name="cycle" size={24} color="orange" />
// //                       )}
// //                       <Text style={styles.statusText}>
// //                         {" "}
// //                         {item.attended ? "Attended" : "Pending"}
// //                       </Text>

// //                       {item.evaluated ? (
// //                         <Entypo name="check" size={24} color="green" />
// //                       ) : (
// //                         <Entypo name="cross" size={24} color="red" />
// //                       )}
// //                       <Text style={styles.statusText}>Evaluated</Text>
// //                     </View>
// //                   </Animated.View>
// //                 )}
// //               />
// //             ) : (
// //               <View
// //                 style={{
// //                   justifyContent: "center",
// //                   alignItems: "center",
// //                   flex: 1,
// //                 }}
// //               >
// //                 <Text>No events available!</Text>
// //               </View>
// //             )}
// //           </View>
// //         </View>

// //         {/* 🔘 Logout Confirmation Modal */}
// //         <Modal
// //           transparent
// //           visible={isLogout}
// //           animationType="fade"
// //           onRequestClose={() => setIsLogout(false)}
// //         >
// //           <View style={styles.modalOverlay}>
// //             <View style={styles.modalBox}>
// //               <Text style={styles.modalTitle}>
// //                 Are you sure you want to log out?
// //               </Text>
// //               <View style={styles.modalButtons}>
// //                 <Pressable
// //                   onPress={() => setIsLogout(false)}
// //                   style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
// //                 >
// //                   <Text>Cancel</Text>
// //                 </Pressable>

// //                 <Pressable
// //                   onPress={handleLogout}
// //                   style={[styles.modalBtn, { backgroundColor: "red" }]}
// //                 >
// //                   <Text style={{ color: "#fff" }}>Yes</Text>
// //                 </Pressable>
// //               </View>
// //             </View>
// //           </View>
// //         </Modal>
// //       </SafeAreaView>
// //     </LinearbackGround>
// //   );
// // };

// // export default Profile;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: COLORS.Forth,
// //     marginHorizontal: "auto",
// //     marginVertical: 10,
// //     padding: 10,
// //     width: "95%",
// //     maxWidth: 600,
// //     borderRadius: 7,
// //   },
// //   header: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     marginBottom: 10,
// //   },
// //   headerLeft: { flexDirection: "row", alignItems: "center" },
// //   headerTitle: { fontSize: 20, fontWeight: "600" },
// //   avatarArea: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 40,
// //     backgroundColor: "grey",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginRight: 10,
// //   },
// //   avatarText: { color: "white", fontSize: 20, fontWeight: "bold" },
// //   studentInfo: { marginVertical: 5 },
// //   infoText: { fontWeight: "500", marginBottom: 2 },
// //   circleContainer: {
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginVertical: 20,
// //   },
// //   textWrapper: {
// //     position: "absolute",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     padding: 10,
// //   },
// //   ratingText: {
// //     color: COLORS.TextColor,
// //     fontWeight: "bold",
// //     textAlign: "center",
// //   },
// //   sectionTitle: {
// //     fontSize: 16,
// //     fontWeight: "600",
// //     textAlign: "center",
// //     marginBottom: 10,
// //   },
// //   eventCard: {
// //     backgroundColor: "white",
// //     padding: 10,
// //     borderRadius: 7,
// //     marginVertical: 5,
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //   },
// //   eventText: { fontWeight: "500", fontSize: 13 },
// //   statusText: { fontSize: 10, fontWeight: "500", marginHorizontal: 4 },
// //   modalOverlay: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //   },
// //   modalBox: {
// //     width: "80%",
// //     backgroundColor: "#fff",
// //     padding: 20,
// //     borderRadius: 12,
// //     alignItems: "center",
// //   },
// //   modalTitle: {
// //     fontSize: 18,
// //     marginBottom: 15,
// //     fontWeight: "bold",
// //     textAlign: "center",
// //   },
// //   modalButtons: {
// //     flexDirection: "row",
// //     gap: 20,
// //   },
// //   modalBtn: {
// //     paddingVertical: 8,
// //     paddingHorizontal: 16,
// //     borderRadius: 8,
// //   },
// //   modalBackground: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.5)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   modalContainer: {
// //     backgroundColor: "white",
// //     padding: 20,
// //     borderRadius: 10,
// //     minWidth: 250,
// //     alignItems: "center",
// //   },
// //   closeButton: {
// //     backgroundColor: "#e74c3c",
// //     padding: 10,
// //     borderRadius: 8,
// //     marginTop: 15,
// //   },
// //   emptyContainer: {
// //     justifyContent: "center",
// //     alignItems: "center",
// //     flex: 1,
// //   },
// // });

// import { EventAttendance } from "@/api/events/utils";
// import {
//     addStudentToEvent
// } from "@/api/local/myLocal";
// import React, { useEffect } from "react";
// import { StyleSheet, Text, View } from "react-native";

// const test = () => {
//   useEffect(() => {
//     const saveTest = async () => {
//       const studentQR: EventAttendance = {
//         studentId: "1234",
//         studentNumber: "2025",
//         studentName: "argie",
//         role: "student",
//         department: "cet",
//         dateScanned: "yanda",
//       };
//       await addStudentToEvent("123", "tests", studentQR);
//     };
//     saveTest();
//   }, []);

//   return (
//     <View>
//       <Text>test</Text>
//     </View>
//   );
// };

// export default test;

// const styles = StyleSheet.create({});

import { resetPassword } from "@/api/admin/controller";
import { ForgetPassword } from "@/api/admin/utils";
import Loading from "@/components/Loading";
import React, { useEffect, useReducer, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

const intialStateForgetPass = {
  studentName: "",
  studentNumber: "",
  studentNewPassword: "",
  serverMessage: "",
  loading: false,
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "SET STUDENTNAME":
      return { ...state, studentName: action.payload };

    case "SET STUDENTNUMBER":
      return { ...state, studentNumber: action.payload };

    case "SET NEWPASSWORD":
      return { ...state, studentNewPassword: action.payload };

    case "SET LOADING":
      return { ...state, loading: action.payload };

    case "SET SERVERMESSAGE":
      return { ...state, serverMessage: action.payload };

    default:
      return state;
  }
}

const test = () => {
  const [count, setCount] = useState(0);

  const [modalForget, setModalForget] = useState(false);
  const [state, dispatch] = useReducer(reducer, intialStateForgetPass);

  useEffect(() => {
    const test = () => {
      setCount(count + 1);
      setModalForget(true);
      console.log(count);
    };
    test();
  }, []);

  const handleForgetPasword = async () => {
    try {
      // dispatch({ type: "SET LOADING", payload: true });
      console.log(state.studentName);
      console.log(state.studentNewPassword);

      const jsonBody: ForgetPassword = {
        studentNumber: state.studentNumber,
        newPassword: state.studentNewPassword,
      };

      const response = await resetPassword("token", jsonBody);
      console.log(response);

      // server message
      Alert.alert("Server response ", state.serverMessage);
    } catch (error) {
      dispatch({ type: "SET LOADING", payload: false });
      dispatch({ type: "SET SERVERMESSAGE", payload: error });
      Alert.alert("Server response ", state.serverMessage);

      console.log(error);
    }
  };
  return (
    <View>
      <Modal
        visible={modalForget}
        onRequestClose={() => {
          //useReducer reset
          // dispatch({ type: "SET STUDENTNUMBER", payload: "" });
          // dispatch({ type: "SET STUDENTNAME", payload: "" });
          // dispatch({ type: "SET NEWPASSWORD", payload: "" });
          // dispatch({ type: "SET LOADING", payload: false });
          // dispatch({ type: "SET SERVERMESSAGE", payload: "" });

          setModalForget(false);
        }}
        animationType="fade"
      >
        {/* container */}
        <View style={styles.containerForgetPass}>
          {/* TEXT */}

          <Text>Forget Password</Text>
          {/* Student name */}
          <Text>Student Name</Text>
          <TextInput
            style={styles.forgetPassField}
            value={state.studentName}
            onChangeText={(text) => {
              dispatch({ type: "SET STUDENTNAME", payload: text });
            }}
          />

          {/* Student number */}
          <Text>Student Number</Text>
          <TextInput
            style={styles.forgetPassField}
            value={state.studentNumber}
            editable={false}
            onChangeText={(text) => {
              dispatch({ type: "SET STUDENTNUMBER", payload: text });
            }}
          />

          {/* new password */}
          <Text>Student new password</Text>
          <TextInput
            style={styles.forgetPassField}
            value={state.studentNewPassword}
            onChangeText={(text) => {
              dispatch({ type: "SET NEWPASSWORD", payload: text });
            }}
          />

          {/* Button forget */}

          <TouchableHighlight
            style={styles.forgetButton}
            disabled={state.loading}
            onPress={handleForgetPasword}
          >
            <Text>Forget password</Text>
          </TouchableHighlight>

          {/* loading */}
          <Loading
            text="Please wait..."
            color="#4F46E5"
            visible={state.loading}
          />
        </View>
      </Modal>
    </View>
  );
};

export default test;

const styles = StyleSheet.create({
  containerForgetPass: {
    maxWidth: 600,
    flexDirection: "column",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontWeight: "500",
    fontSize: 13,
  },
  forgetPassField: {
    width: "98%",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    borderColor: "black",
    paddingLeft: 10,
  },
  forgetButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
});
