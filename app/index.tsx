// eas build --platform android --profile production
//  eas build --platform android --profile development
// npx expo export --platform web

import Loading from "@/components/Loading";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { loginStudent } from "@/api/admin/controller";
import { getAllEvents } from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import {
  getOfflineStudents,
  saveEventOfflineLocal,
  saveStudentOfflineLocal,
  updateEventOfflineLocal,
  updateStudentOfflineLocal,
} from "@/api/local/userOffline";
import { getStudentById } from "@/api/students/controller";
import { StudentModel } from "@/api/students/model";
import NetInfo from "@react-native-community/netinfo";

export default function Index() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginButtonDisable, setButtonDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showModalOfficer, setShowModalOfficer] = useState(false);
  const [showModalNoInternetUser, setShowModalNoInternetUser] = useState(false);

  const router = useRouter();
  const {
    setStudentData,
    setStudentToken,
    setUserId,
    setEventData,
    setIsUserHasInternet,
    isUserHasInternet,
    studentDataOffline,
    setStudentDataOffline,
    eventDataOffline,
    setEventDataOffline,
  } = useUser();
  const handleOffline = (userRole: string) => {
    if (userRole) {
      setShowModalOfficer(true);
    }
    router.push("/(tabs)/home");
  };
  const haddleRegister = () => {
    router.push("/register");
  };
  const checkUserLocalData = async (
    userData: StudentModel,
    events: EventModel[],
  ) => {
    const localData = await getOfflineStudents();

    if (localData.length > 0) {
      const userUpdated = await updateStudentOfflineLocal(userData);
      const eventsUpdated = await updateEventOfflineLocal(events);
      console.log("User updated ", userUpdated);
      console.log("Event updated ", eventsUpdated);
    } else {
      // console.log("No offline students saved.");
      await saveStudentOfflineLocal(userData);
      await saveEventOfflineLocal(events);

      setEventDataOffline(events);
      setStudentDataOffline(userData);
    }
  };

  useEffect(() => {
    // function offline data
    const getOfflineData = async () => {
      console.log("local data ");
      const localData = await getOfflineStudents();
      const studentLocal = localData.find((item: null) => item !== null);
      console.log("local data student", studentLocal);
      setStudentDataOffline(studentLocal);
    };

    const checkInternet = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        setIsUserHasInternet(true);
        setShowModalNoInternetUser(false);
      } else {
        setIsUserHasInternet(false);
        setShowModalNoInternetUser(true);
        getOfflineData();
      }
    });

    // const getLocal = async () => {
    //   const localData = await getOfflineStudents();
    //   const studentLocal = localData.find((item: null) => item !== null);
    //   setStudentDataOffline(studentLocal);
    // };

    checkInternet();
    // getLocal();
  }, []);

  const haddleAuthStudent = async () => {
    setLoading(true);
    // console.log("username :", username)
    // console.log("password :", password)
    try {
      // Reset attempts after successful login
      setAttempts(0);
      setCountdown(null);
      setButtonDisable(false);

      const response = await loginStudent(username, password);
      // setStudentToken(response.token)
      setUserId(response._id);
      setStudentToken(response.token.trim());

      const events = await getAllEvents(response.token);
      setEventData(events);

      const userData = await getStudentById(response.token, response._id);
      setStudentData(userData);

      // local copy of user
      checkUserLocalData(userData, events);

      if (response.role === "ADMIN") {
        router.push("/osa/tabs/osa");
      } else if (response.role === "OFFICER") {
        setShowModalOfficer(true);
      } else {
        // student access
        router.push("/(tabs)/home");
        // router.push("/(officer)/home");
        // router.push("/osa/tabs/osa");
      }

      setLoading(false);
    } catch (error) {
      console.log("Login failed", error);
      setLoading(false);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      const remainingAttempts = 3 - newAttempts;

      if (newAttempts >= 3) {
        // Show modal with countdown
        setModalVisible(true);
        setCountdown(3);
        setButtonDisable(true);

        let timer = 3;
        const interval = setInterval(() => {
          timer -= 1;
          setCountdown(timer);
        }, 1000);

        setTimeout(() => {
          clearInterval(interval);
          if (Platform.OS === "android") {
            BackHandler.exitApp();
          } else {
            Alert.alert(
              "Too many attempts",
              "App is locked. Please close and reopen to try again.",
            );
            setButtonDisable(false);
          }
        }, 3000);
      } else {
        setModalVisible(true);
      }
    }
  };

  const remainingAttempts = 3 - attempts;

  useEffect(() => {
    const fetchEvents = async () => {};
    fetchEvents();
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.Secondary, COLORS.Third, COLORS.Forth]}
      style={styles.safeAreaview}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.safeAreaview}>
          <View style={styles.loginContainer}>
            <Image
              source={require("@/assets/images/cpcLogo2-removebg.png")}
              style={styles.ImageLogo}
            />

            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.welcomeTextInfo}>
              Please enter your details to login
            </Text>

            <Text style={styles.textfieldText}>Student Number</Text>
            <TextInput
              style={styles.textfieldInput}
              placeholder="2022000351"
              placeholderTextColor="grey"
              value={username}
              onChangeText={setUsername}
            />

            <Text style={styles.textfieldText}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textfieldInputPass}
                placeholder="**********"
                placeholderTextColor="gray"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="gray"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>

            <TouchableHighlight
              style={[
                styles.loginButton,
                loginButtonDisable && { opacity: 0.6 },
              ]}
              onPress={haddleAuthStudent}
              // onPress={()=> router.push("./osa/osa")}
              disabled={loginButtonDisable}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableHighlight>

            <View style={styles.deviderPanel}></View>

            {/* register section */}
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                marginVertical: 10,
              }}
            >
              <Text style={{ fontWeight: "400", fontSize: 16 }}>
                Don't have an account?
              </Text>

              <Pressable onPress={haddleRegister}>
                <Text
                  style={{
                    textDecorationLine: "underline",
                    color: COLORS.Primary,
                    fontWeight: "500",
                    fontSize: 16,
                  }}
                >
                  Register
                </Text>
              </Pressable>
            </View>
          </View>

          {/* modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Error: Student number not found or password not correct!
                </Text>

                {remainingAttempts > 0 && (
                  <Text
                    style={[styles.modalText, { marginTop: 10, color: "red" }]}
                  >
                    Attempts remaining: {remainingAttempts}
                  </Text>
                )}

                {countdown !== null && (
                  <Text
                    style={[styles.modalText, { marginTop: 10, color: "red" }]}
                  >
                    Closing in {countdown}...
                  </Text>
                )}

                <Pressable
                  style={[
                    styles.buttonClose,
                    loginButtonDisable && { opacity: 0.6 },
                  ]}
                  onPress={() => {
                    if (!loginButtonDisable) setModalVisible(false);
                  }}
                  disabled={loginButtonDisable}
                >
                  <Text style={styles.textStyle}>Try again</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          {/* loading */}
          <Loading text="Please wait..." color="#4F46E5" visible={loading} />

          {/* show modal for officer choice   */}
          <Modal visible={showModalOfficer} transparent animationType="fade">
            <View
              style={{
                flex: 1,
                backgroundColor: "black",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.Forth,
                  padding: 20,
                  borderRadius: 10,
                  alignItems: "center",
                  marginHorizontal: 10,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 19,
                    marginBottom: 15,
                  }}
                >
                  System detected you are officer
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    router.push("/(tabs)/home");
                    setShowModalOfficer(false);
                  }}
                  style={{
                    backgroundColor: "green",
                    marginVertical: 10,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    Login as Student
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    router.push("/(officer)/home");
                    setShowModalOfficer(false);
                  }}
                  style={{ borderRadius: 6, backgroundColor: "red" }}
                >
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    Login as Officer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* modal save user data local */}
          <Modal
            visible={showModalNoInternetUser}
            transparent
            animationType="fade"
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 10,
                  width: "80%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  ⚠️ Offline Mode
                </Text>

                <Text style={{ textAlign: "center", marginBottom: 20 }}>
                  No internet connection.
                </Text>

                <Pressable
                  onPress={() => {
                    // if (studentDataOffline?.role === "OFFICER") {
                    //   setShowModalOfficer(true);
                    // } else {
                    //   router.push("/(tabs)/home");
                    // }
                    setShowModalNoInternetUser(false);
                    handleOffline(studentDataOffline.role);
                  }}
                  style={{
                    backgroundColor: "#007bff",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Go Offline Mode
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeAreaview: { height: "100%", width: "100%", position: "absolute" },
  loginContainer: {
    width: "93%",
    maxWidth: 500,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: "auto",
    paddingBottom: 40,
    paddingHorizontal: 6,
    backgroundColor: COLORS.Forth,
    borderColor: "snow",
    borderWidth: 1,
    shadowOffset: { width: 5, height: 7 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 10,
  },
  ImageLogo: { width: 120, height: 120, marginVertical: 5 },
  welcomeText: { fontWeight: "700", fontSize: 17 },
  welcomeTextInfo: { fontWeight: "500", marginBottom: 10 },
  textfieldText: {
    fontWeight: "600",
    marginVertical: 5,
    marginRight: "auto",
    marginLeft: 10,
  },
  textfieldInput: {
    width: "98%",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    borderColor: "black",
    paddingLeft: 10,
  },
  inputWrapper: {
    width: "98%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  textfieldInputPass: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "black",
  },
  icon: { marginLeft: 5 },
  loginButton: {
    width: "98%",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: COLORS.Primary,
  },
  loginButtonText: { color: "white", fontWeight: "500", fontSize: 17 },
  deviderPanel: {
    backgroundColor: "black",
    width: "98%",
    height: 1,
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    marginTop: 15,
    backgroundColor: COLORS.Primary,
    borderRadius: 10,
    padding: 10,
  },
  textStyle: { color: "white", fontWeight: "bold" },
  modalText: { fontSize: 18, textAlign: "center" },
});
