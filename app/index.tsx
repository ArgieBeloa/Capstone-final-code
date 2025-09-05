import {
  authStudent,
  eventsDataFunction,
  studentDataFunction,
} from "@/api/spring";
import Loading from "@/components/Loading";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  BackHandler,
  Image,
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

export default function Index() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginButtonDisable, setButtonDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  const router = useRouter();
  const { setStudentData, setEventData, setStudentToken, setStudentNumber } =
    useUser();

  const haddleRegister = () => {
    router.push("/register");
  };

  const haddleAuthStudent = async () => {
    setLoading(true);
    try {
      const token = await authStudent(username, password);
      setStudentToken(token);
      setStudentNumber(username);

      // Reset attempts after successful login
      setAttempts(0);
      setCountdown(null);
      setButtonDisable(false);

      const studentData = await studentDataFunction(username, token);
      const events = await eventsDataFunction(token);
      setEventData(events);
      setStudentData(studentData);

      setLoading(false);
      router.push("/(tabs)/home");
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
              "App is locked. Please close and reopen to try again."
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

  return (
    <LinearGradient
      colors={[COLORS.Secondary, COLORS.Third, COLORS.Forth]}
      style={styles.safeAreaview}
    >
      <SafeAreaView style={styles.safeAreaview}>
        <View style={styles.loginContainer}>
          <Image
            source={require("@/assets/images/cpcLogo2.jpg")}
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
            style={[styles.loginButton, loginButtonDisable && { opacity: 0.6 }]}
            onPress={haddleAuthStudent}
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
                <Text style={[styles.modalText, { marginTop: 10, color: "red" }]}>
                  Attempts remaining: {remainingAttempts}
                </Text>
              )}

              {countdown !== null && (
                <Text style={[styles.modalText, { marginTop: 10, color: "red" }]}>
                  Closing in {countdown}...
                </Text>
              )}

              <Pressable
                style={[styles.buttonClose, loginButtonDisable && { opacity: 0.6 }]}
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
      </SafeAreaView>
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
  textfieldText: { fontWeight: "600", marginVertical: 5, marginRight: "auto", marginLeft: 10 },
  textfieldInput: { width: "98%", height: 50, borderRadius: 10, borderWidth: 1, fontSize: 16, borderColor: "black", paddingLeft: 10 },
  inputWrapper: { width: "98%", flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "black", borderRadius: 8, paddingHorizontal: 10 },
  textfieldInputPass: { flex: 1, paddingVertical: 10, fontSize: 16, color: "black" },
  icon: { marginLeft: 5 },
  loginButton: { width: "98%", height: 50, borderRadius: 10, justifyContent: "center", alignItems: "center", marginTop: 30, backgroundColor: COLORS.Primary },
  loginButtonText: { color: "white", fontWeight: "500", fontSize: 17 },
  deviderPanel: { backgroundColor: "black", width: "98%", height: 1, marginTop: 20 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalView: { margin: 20, backgroundColor: "white", borderRadius: 20, padding: 30, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  buttonClose: { marginTop: 15, backgroundColor: COLORS.Primary, borderRadius: 10, padding: 10 },
  textStyle: { color: "white", fontWeight: "bold" },
  modalText: { fontSize: 18, textAlign: "center" },
});
