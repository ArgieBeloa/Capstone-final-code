import LinearbackGround from "@/components/LinearBackGround";
import ViewPanel from "@/components/ViewPanel";
import { COLORS } from "@/constants/ColorCpc";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { registerForPushNotificationsAsync } from "../src/pushToken";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [course, setCourse] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [registerBtnDisable, setRegisterBtnDisable] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string>();
  const router = useRouter();

  // Function
  const haddleRegister = () => {
    console.log(username);
  };
  const haddleLoginBack = () => {
    router.push("/");
  };

  useEffect(() => {
    const getToken = async () => {
      const token = await registerForPushNotificationsAsync();
      console.log("token :", token)
      if (token) {
        setExpoPushToken(token);
      }
    };

    getToken();
  }, []);
  return (
    <LinearbackGround>
      <SafeAreaView style={styles.safeAreaView}>
        <ViewPanel style={styles.viewContainer}>
          <Text style={styles.registerText}>Register</Text>
          <Text style={styles.text}>Full name</Text>
          <View style={styles.container}>
            <Ionicons name="person" size={20} color="black" />
            <TextInput
              style={styles.textfield}
              placeholderTextColor="grey"
              placeholder="Name"
              value={fullname}
              onChangeText={setFullname}
            />
          </View>
          <Text style={styles.text}>Course</Text>
          <View style={styles.container}>
            <Entypo name="graduation-cap" size={20} color="black"></Entypo>
            <TextInput
              style={styles.textfield}
              placeholderTextColor="grey"
              placeholder="Course"
              value={course}
              onChangeText={setCourse}
            />
          </View>
          <Text style={styles.text}>Student Number</Text>
          <View style={styles.container}>
            <FontAwesome name="id-card" size={19} color="black" />
            <TextInput
              style={styles.textfield}
              placeholderTextColor="grey"
              placeholder="Student number"
              value={username}
              onChangeText={setUsername}
            />
          </View>
          <Text style={styles.text}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed" size={20} color="black" />
            <TextInput
              style={styles.textfieldInputPass}
              placeholder="Password"
              placeholderTextColor="gray"
              secureTextEntry={!showPassword} // hide/show password
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
          <Text style={styles.text}>Confirm Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed" size={20} color="black" />
            <TextInput
              style={styles.textfieldInputPass}
              placeholder="Confirm password"
              placeholderTextColor="gray"
              secureTextEntry={!confirmShowPassword} // hide/show password
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              onPress={() => setConfirmShowPassword(!confirmShowPassword)}
            >
              <Ionicons
                name={confirmShowPassword ? "eye-off" : "eye"}
                size={22}
                color="gray"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>

          {/* register button */}
          <TouchableHighlight
            style={styles.registerBtn}
            disabled={registerBtnDisable}
          >
            <Text style={styles.registerBtnText}>Register</Text>
          </TouchableHighlight>

          <View style={styles.alreadyContainer}>
            <Text style={styles.alreadyContainerText}>Already Register ? </Text>

            <Pressable
              style={styles.alreadyContainerBtn}
              onPress={haddleLoginBack}
            >
              <Text style={styles.alreadyContainerBtnText}>Login Now</Text>
            </Pressable>
          </View>
        </ViewPanel>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Register;

const styles = StyleSheet.create({
  safeAreaView: {
    width: "100%",
    height: "100%",
  },
  viewContainer: {
    width: "95%",
    maxWidth: 1000,

    margin: "auto",
    padding: 15,
  },
  registerText: {
    fontSize: 30,
    fontWeight: 600,
    marginVertical: 10,
  },
  text: {
    fontWeight: 500,
    fontSize: 14,
    marginBottom: 5,
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  textfieldInputPass: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "black",
    backgroundColor: "#fff",
    paddingLeft: 3,
  },
  icon: {
    marginLeft: 5,
  },

  container: {
    flexDirection: "row", // puts icon and input side by side
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000000ff",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },

  textfield: {
    flex: 1, // take the remaining space
    paddingVertical: 8,
    fontSize: 16,
    color: "#333",
    paddingLeft: 5,
  },

  acceptText: {},
  registerBtn: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    //borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: COLORS.Primary,
  },
  registerBtnText: {
    color: "white",
    fontWeight: 500,
    fontSize: 17,
  },
  alreadyContainer: {
    marginVertical: 10,
    flexDirection: "row",
    backgroundColor: "white",
    // borderWidth: 1,
    borderColor: COLORS.Primary,
    paddingVertical: 15,
    justifyContent: "center",
    borderRadius: 8,
  },
  alreadyContainerText: {
    fontWeight: "600",
  },
  alreadyContainerBtn: {},

  alreadyContainerBtnText: {
    color: COLORS.Primary,
    fontWeight: "600",
  },
});
