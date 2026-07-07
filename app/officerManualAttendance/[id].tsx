import { StudentModel } from "@/api/students/model";
import { useUser } from "@/src/userContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ IMPORT FROM local.ts (single source of truth)
import { getAllStudents } from "@/api/admin/controller";
import { EventAttendance } from "@/api/events/utils";
import { addStudent } from "@/api/local/local";
import { Course } from "@/api/students/utils";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";

export default function OfficerManualAttendance() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [allStudentState, setAllStudentState] = useState<StudentModel[]>([]);
  const [selectedCourse, setSelectedCourse] = useState(
    Course.BACHELOR_OF_SCIENCE_IN_INFORMATION_TECHNOLOGY,
  );
  const [studentByCourseState, setStudentByCourseState] = useState<
    StudentModel[]
  >([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentModel>();

  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { studentData, studentToken, eventData } = useUser();

  const student: StudentModel = studentData;
  const event = eventData.find((e) => e.id === (id as string));

  const handleOfficerLocalAttendance = async (
    eventAttendance: EventAttendance,
  ) => {
    try {
      const localAttendance = await addStudent(
        id as string,
        event?.eventTitle || "",
        eventAttendance,
      );

      console.log("Local Attendance:", localAttendance);
      console.log("Added success", student);

      // Close confirmation modal
      setModalVisible(false);

      // Show success modal
      setSuccessMessage(
        `✅ Successfully added to local attendance.\n\n${eventAttendance.studentName}\n${eventAttendance.department}`,
      );
      setSuccessModalVisible(true);
    } catch (error: any) {
      console.error("❌ QR Scan Error:", error.message);

      setModalVisible(false);

      setSuccessMessage("❌ Failed to add attendance.");
      setSuccessModalVisible(true);
    }
  };
  // get all students
  //sort by department
  useEffect(() => {
    const allStudentsFunction = async () => {
      try {
        const responseAllStudents = await getAllStudents(studentToken);
        setAllStudentState(responseAllStudents);
      } catch (error) {
        console.log(error);
      }
    };

    allStudentsFunction();
  }, []);

  // display/update student by course
  useEffect(() => {
    const studentByCourse = allStudentState.filter(
      (item) => item.course === selectedCourse,
    );

    setStudentByCourseState(studentByCourse);
  }, [selectedCourse, allStudentState]);

  return (
    <SafeAreaView style={styles.safeAreaview}>
      <View style={{ flex: 1 }}>
        {/* Option by course */}
        <View style={styles.container}>
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

        {/* data by course */}
        <FlatList
          data={studentByCourseState}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.studentCard}
              onPress={() => {
                setSelectedStudent(item);
                setModalVisible(true);
              }}
            >
              <Text style={styles.studentName}>{item.studentName}</Text>

              <Text style={styles.studentInfo}>{item.studentNumber}</Text>

              <Text style={styles.studentInfo}>{item.department}</Text>
            </TouchableOpacity>
          )}
        />

        {/* modal selected */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
              >
                Add Attendance
              </Text>

              {selectedStudent && (
                <>
                  <Text>Name: {selectedStudent.studentName}</Text>
                  <Text>Student No: {selectedStudent.studentNumber}</Text>
                  <Text>Department: {selectedStudent.department}</Text>

                  <View style={{ height: 20 }} />

                  <Pressable
                    style={styles.modalButton}
                    onPress={() => {
                      handleOfficerLocalAttendance({
                        studentId: selectedStudent.id ?? "no id",
                        studentName: selectedStudent.studentName,
                        studentNumber: selectedStudent.studentNumber,
                        department: selectedStudent.department,
                        role: "Student",
                        dateScanned: new Date().toISOString(),
                      });

                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Add Attendance</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.modalButton,
                      { backgroundColor: "#6b7280", marginTop: 10 },
                    ]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </Modal>
        <Modal
          visible={successModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setSuccessModalVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "85%",
                backgroundColor: "#fff",
                borderRadius: 15,
                padding: 25,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 15,
                  textAlign: "center",
                }}
              >
                Attendance
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 20,
                  color: "#374151",
                }}
              >
                {successMessage}
              </Text>

              <Pressable
                onPress={() => setSuccessModalVisible(false)}
                style={{
                  backgroundColor: "#2563EB",
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  OK
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaview: { height: "100%", width: "100%", position: "absolute" },
  studentCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
  },

  studentName: {
    fontSize: 17,
    fontWeight: "bold",
  },

  studentInfo: {
    color: "#555",
    marginTop: 4,
  },
  container: {
    padding: 20,
  },
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

  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  focusBox: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 10,
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
});
