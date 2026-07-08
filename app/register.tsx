import { registerStudentOpen } from "@/api/admin/controller";
import LinearbackGround from "@/components/LinearBackGround";
import Loading from "@/components/Loading";
import ViewPanel from "@/components/ViewPanel";
import { COLORS } from "@/constants/ColorCpc";
import { registerForPushNotificationsAsync } from "@/src/pushToken";
import { useUser } from "@/src/userContext";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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

// import { Student } from "./Oop/Types";
import { StudentModel } from "@/api/students/model";
import { Course } from "@/api/students/utils";
import { Picker } from "@react-native-picker/picker";

const Register = () => {
  const { studentToken } = useUser();
  const [fullname, setFullname] = useState("");
  // const [course, setCourse] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [registerBtnDisable, setRegisterBtnDisable] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [selectedCourse, setSelectedCourse] = useState(
    Course.BACHELOR_OF_SCIENCE_IN_INFORMATION_TECHNOLOGY,
  );

  // 🔴 Add validation state
  const [errors, setErrors] = useState<{
    fullname?: string;
    // selec?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const router = useRouter();

  // get deparment algorithm
  const getDepartmentFromCourse = (course: string): string => {
    const value = course.toLowerCase();

    // 🔹 CET
    if (
      value.includes("information technology") ||
      value.includes("computer science") ||
      value.includes("engineering") ||
      value.includes("electronics") ||
      value.includes("civil") ||
      value.includes("technology")
    ) {
      return "CET";
    }

    // 🔹 CASE
    if (
      value.includes("education") ||
      value.includes("arts") ||
      value.includes("english") ||
      value.includes("psychology") ||
      value.includes("filipino")
    ) {
      return "CASE";
    }

    // 🔹 CME
    if (
      value.includes("medical") ||
      value.includes("nursing") ||
      value.includes("midwifery") ||
      value.includes("marine") ||
      value.includes("health")
    ) {
      return "CME";
    }

    // 🔹 CHTM
    if (
      value.includes("hospitality") ||
      value.includes("tourism") ||
      value.includes("hotel") ||
      value.includes("restaurant")
    ) {
      return "CHTM";
    }
    // 🔹 CBMA
    if (value.includes("accountancy") || value.includes("business")) {
      return "CBMA";
    }

    // 🔹 CCJ
    if (value.includes("criminology") || value.includes("criminal justice")) {
      return "CCJ";
    }

    // 🔸 fallback
    return "UNASSIGNED";
  };
  const department = getDepartmentFromCourse(selectedCourse);

  const newStudent: StudentModel = {
    studentName: fullname,
    studentNumber: username,
    studentPassword: password,
    course: selectedCourse as string,
    department: department,
    notificationId: expoPushToken || "no token",
    studentUpcomingEvents: [],
    studentEventAttended: [],
    studentRecentEvaluations: [],
    studentNotifications: [],
    studentEventAttendedAndEvaluationDetails: [],
    officerCredentials: {
      canAddEvent: false,
      canEditEvent: false,
      canAddStudent: false,
      canScanStudent: false,
    },
  } as StudentModel;

  // ✅ Validate inputs (like HTML required)
  const validateFields = () => {
    const newErrors: any = {};
    if (!fullname.trim()) newErrors.fullname = "Full name is required";
    // if (!course.trim()) newErrors.course = "Course is required";
    if (!username.trim()) newErrors.username = "Student number is required";
    if (!password.trim()) newErrors.password = "Password is required";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Confirm password is required";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (password.length > 0 && password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const haddleRegister = async () => {
    console.log("Selected course ", selectedCourse);
    if (!validateFields()) return;

    setLoading(true);
    setRegisterBtnDisable(true);

    try {
      const studentAdded = await registerStudentOpen(newStudent);
      console.log("Student Added: ", studentAdded);

      setIsSuccess(true);
      setModalVisible(true);
    } catch (error) {
      console.log("Register failed: ", error);
      setIsSuccess(false);
      setModalVisible(true);
    } finally {
      setLoading(false);
      setRegisterBtnDisable(false);
    }
  };

  const haddleLoginBack = () => router.push("/");

  useEffect(() => {
    const getToken = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) setExpoPushToken(token);
    };
    getToken();
  }, []);

  return (
    <LinearbackGround style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.safeAreaView}>
          <ViewPanel style={styles.viewContainer}>
            <Text style={styles.registerText}>Register</Text>

            {/* FULL NAME */}
            <Text style={styles.text}>Full name</Text>
            <View style={styles.container}>
              <Ionicons name="person" size={20} color="black" />
              <TextInput
                style={styles.textfield}
                placeholderTextColor="grey"
                placeholder="Name"
                value={fullname}
                onChangeText={(text) => {
                  setFullname(text);
                  setErrors((prev) => ({ ...prev, fullname: undefined }));
                }}
              />
            </View>
            {errors.fullname && (
              <Text style={styles.errorText}>{errors.fullname}</Text>
            )}

            {/* COURSE */}
            {/* <Text style={styles.text}>Course</Text>
            <View style={styles.container}>
              <Entypo name="graduation-cap" size={20} color="black" />
              <TextInput
                style={styles.textfield}
                placeholderTextColor="grey"
                placeholder="Course"
                value={course}
                onChangeText={(text) => {
                  setCourse(text);
                  setErrors((prev) => ({ ...prev, course: undefined }));
                }}
              />
            </View>
            {errors.course && (
              <Text style={styles.errorText}>{errors.course}</Text>
            )} */}

            <View style={styles.containerpicker}>
              <Text style={styles.label}>Select Course</Text>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCourse}
                  onValueChange={(itemValue) => setSelectedCourse(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#2563eb"
                >
                  {Object.values(Course).map((course) => (
                    <Picker.Item key={course} label={course} value={course} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* STUDENT NUMBER */}
            <Text style={styles.text}>Student Number</Text>
            <View style={styles.container}>
              <FontAwesome name="id-card" size={19} color="black" />
              <TextInput
                style={styles.textfield}
                placeholderTextColor="grey"
                placeholder="Student number"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setErrors((prev) => ({ ...prev, username: undefined }));
                }}
              />
            </View>
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}

            {/* PASSWORD */}
            <Text style={styles.text}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={20} color="black" />
              <TextInput
                style={styles.textfieldInputPass}
                placeholder="Password"
                placeholderTextColor="gray"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
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
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* CONFIRM PASSWORD */}
            <Text style={styles.text}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={20} color="black" />
              <TextInput
                style={styles.textfieldInputPass}
                placeholder="Confirm password"
                placeholderTextColor="gray"
                secureTextEntry={!confirmShowPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }}
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
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            {/* REGISTER BUTTON */}
            <TouchableHighlight
              style={styles.registerBtn}
              disabled={registerBtnDisable}
              onPress={haddleRegister}
            >
              <Text style={styles.registerBtnText}>Register</Text>
            </TouchableHighlight>

            {/* Already Registered */}
            <View style={styles.alreadyContainer}>
              <Text style={styles.alreadyContainerText}>
                Already Registered?{" "}
              </Text>
              <Pressable
                style={styles.alreadyContainerBtn}
                onPress={haddleLoginBack}
              >
                <Text style={styles.alreadyContainerBtnText}>Login Now</Text>
              </Pressable>
            </View>

            {/* LOADING */}
            <Loading text="Please wait..." color="#4F46E5" visible={loading} />

            {/* MODAL */}
            <Modal
              animationType="fade"
              transparent
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                  {isSuccess ? (
                    <Text style={styles.successText}>
                      ✅ Successfully Registered!
                    </Text>
                  ) : (
                    <Text style={styles.failText}>
                      {`⚠️ Registration failed. The student number ${username} has already been used.`}
                    </Text>
                  )}
                  <Pressable
                    style={[
                      styles.buttonClose,
                      { backgroundColor: isSuccess ? "#4CAF50" : "#f44336" },
                    ]}
                    onPress={() => {
                      setModalVisible(false);

                      if (isSuccess) {
                        setFullname("");
                        setUsername("");
                        setPassword("");
                        setConfirmPassword("");

                        // Navigate to Login screen
                        haddleLoginBack();
                      }
                    }}
                  >
                    <Text style={styles.textStyle}>
                      {isSuccess ? "Login Now" : "Close"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </ViewPanel>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearbackGround>
  );
};

export default Register;

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
  picker: {
    height: 55,

    color: "#111827",
  },

  pickerWrapper: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    marginVertical: 10,

    // Android shadow
    elevation: 2,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: 16,
  },
  containerpicker: {
    paddingVertical: 5,
  },

  viewContainer: {
    width: "95%",
    maxWidth: 1000,
    margin: "auto",
    padding: 15,
  },
  registerText: { fontSize: 30, fontWeight: "600", marginVertical: 10 },
  text: { fontWeight: "500", fontSize: 14, marginBottom: 5 },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000000ff",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
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
  textfield: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: "#333",
    paddingLeft: 5,
  },
  textfieldInputPass: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "black",
    backgroundColor: "#fff",
    paddingLeft: 3,
  },
  icon: { marginLeft: 5 },
  errorText: { color: "red", fontSize: 12, marginBottom: 8 },
  registerBtn: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: COLORS.Primary,
  },
  registerBtnText: { color: "white", fontWeight: "500", fontSize: 17 },
  alreadyContainer: {
    marginVertical: 10,
    flexDirection: "row",
    backgroundColor: "white",
    borderColor: COLORS.Primary,
    paddingVertical: 15,
    justifyContent: "center",
    borderRadius: 8,
  },
  alreadyContainerText: { fontWeight: "600" },
  alreadyContainerBtn: {
    paddingHorizontal: 4,
  },
  alreadyContainerBtnText: { color: COLORS.Primary, fontWeight: "600" },
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
  successText: {
    color: "green",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  failText: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonClose: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
  },
  textStyle: { color: "white", fontWeight: "bold", textAlign: "center" },
});
