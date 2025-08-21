import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  const [isCheck, setIscheck] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safeAreaview}>
     

      <View style={styles.loginContainer}>
        <Image
          source={require("@/assets/images/cpcLogo2.jpg")}
          style={styles.ImageLogo}
        ></Image>

        <Text style={styles.welcomeText}>Welcome back</Text>
        <Text style={styles.welcomeTextInfo}>
          Please enter your details to login
        </Text>
        <Text style={styles.textfieldText}>Email</Text>
        <TextInput
          style={styles.textfieldInput}
          placeholder="2022000351"
          placeholderTextColor="grey"
        ></TextInput>

        <Text style={styles.textfieldText}>Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textfieldInputPass}
            placeholder="**********"
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

        <TouchableHighlight style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableHighlight>
        <View style={styles.deviderPanel}>
          {/* <Text style={styles.orCss}>OR</Text> */}
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 5,
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              fontWeight: 400,
              fontSize: 16,
            }}
          >
            Don't have an account?
          </Text>
          <Pressable>
            <Text
              style={{
                textDecorationLine: "underline",
                color: "blue",
                fontWeight: 500,
                fontSize: 16,
              }}
            >
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaview: {
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundColor: "white",
  },

  loginContainer: {
    width: "95%",

    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "snow",
    borderRadius: 10,
    margin: "auto",
    paddingBottom: 40,
    paddingHorizontal: 6,
    backgroundColor: "white",
    borderColor: "snow",
    borderWidth: 1,

    shadowOffset: {
      width: 5, // Horizontal offset
      height: 7, // Vertical offset
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    // These elevation properties are for Android
    elevation: 10,
  },

  ImageLogo: {
    width: 140,
    height: 140,
    backgroundColor: "none",
    marginVertical: 10,
  },
  welcomeText: {
    fontWeight: 700,
    fontSize: 17,
  },
  welcomeTextInfo: {
    fontWeight: 500,
    marginBottom: 10,
  },
  textfieldText: {
    fontWeight: 600,
    marginVertical: 5,
    marginRight: "auto",
    marginLeft: 10,
  },
  textfieldInput: {
    width: "98%",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
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
  icon: {
    marginLeft: 5,
  },
  loginButton: {
    width: "98%",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    //borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: "#607cdaff",
  },
  loginButtonText: {
    color: "white",
    fontWeight: 500,
    fontSize: 17,
  },
  deviderPanel: {
    backgroundColor: "black",
    width: "98%",
    height: 1,
    marginTop: 20,
  },
});
