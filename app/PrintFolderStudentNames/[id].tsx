import { Course } from "@/api/students/utils";
import { useUser } from "@/src/userContext";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";

import { getEventById } from "@/api/events/controller";
import {
  EventEvaluationDetails,
  getOverallEvaluationPerformance,
} from "@/api/events/utils";
import { Picker } from "@react-native-picker/picker";

const PrintScreen = () => {
  const { studentToken } = useUser();
  const { id } = useLocalSearchParams();

  const [eventTitle, setEventTitle] = useState("");
  const [eventEvaluationDetails, setEventEvaluationDetails] = useState<
    EventEvaluationDetails[]
  >([]);

  // const [selectedDepartment, setSelectedDepartment] = useState(Department.CET);
  const [selectedCourse, setSelectedCouse] = useState(
    Course.BACHELOR_OF_SCIENCE_IN_INFORMATION_TECHNOLOGY,
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [reportText, setReportText] = useState("");
  const [printStudents, setPrintStudents] = useState<EventEvaluationDetails[]>(
    [],
  );

  const overallResult = getOverallEvaluationPerformance(eventEvaluationDetails);

  const [loading, setLoading] = useState(true);

  // Fetch event and store only evaluations
  const fetchEventById = async () => {
    try {
      const data = await getEventById(studentToken, id as string);
      console.log("Fetched event:", data);

      setEventTitle(data.eventTitle);
      setEventEvaluationDetails(data.eventEvaluationDetails);
      const names = data.eventEvaluationDetails.filter(
        (student) => student.course === selectedCourse,
      );
      setPrintStudents(names);
      console.log(printStudents);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // const generateReport = (department: Department) => {
  //   const courses = DepartmentCourses[department];

  //   const departmentStudents = eventEvaluationDetails.filter((e) =>
  //     courses.includes(e.course as Course),
  //   );

  //   setPrintStudents(departmentStudents);
  //   console.log(printStudents);

  //   let text = `${department}\n\n`;

  //   courses.forEach((course) => {
  //     const students = [
  //       ...new Map(
  //         departmentStudents
  //           .filter(
  //             (item) => item.course === course && item.studentName?.trim(),
  //           )
  //           .map((item) => [item.studentName.trim(), item]),
  //       ).values(),
  //     ];

  //     text += `${course}\n`;
  //     text += `Total: ${students.length}\n`;

  //     if (students.length > 0) {
  //       text += students
  //         .map((student, index) => `${index + 1}. ${student.studentName}`)
  //         .join("\n");
  //     }

  //     text += "\n\n";
  //   });

  //   setReportText(text);
  //   setModalVisible(true);
  // };

  useEffect(() => {
    fetchEventById();
    // const notEvaluated = async () => {
    //   const students = new Set(
    //     eventEvaluationDetails
    //       .filter(
    //         (course) =>
    //           course.course === Course.BACHELOR_OF_SCIENCE_IN_CIVIL_ENGINEERING,
    //       )
    //       .map((name) => normalizeName(name.studentName)),
    //   );

    //   const studentNotEvaluated = civilEngineeringStudents.filter(
    //     (student) => !students.has(normalizeName(student.studentName)),
    //   );
    //   // CE
    //   // const studentNotEvaluated = civilEngineeringStudents.filter(
    //   //   (student) => !ceStudents.has(normalizeName(student.studentName)),
    //   // );

    //   console.log("ALREADY EVALUATED", students.size);
    //   console.log("NOT EVALUATED", studentNotEvaluated.length);

    //   // studentNotEvaluated.forEach((student) =>
    //   //   console.log(student.studentName),
    //   // );
    //   console.log(
    //     studentNotEvaluated
    //       .map((student, index) => `${index + 1}. ${student.studentName}`)
    //       .join("\n"),
    //   );
    // };
    // notEvaluated();
  }, [id]);

  // useEffect(() => {
  //   const courses = DepartmentCourses[selectedDepartment];

  //   const departmentStudents = eventEvaluationDetails.filter((e) =>
  //     courses.includes(e.course as Course),
  //   );

  //   console.log(selectedDepartment);

  //   courses.forEach((course) => {
  //     const students = [
  //       ...new Map(
  //         departmentStudents
  //           .filter(
  //             (item) => item.course === course && item.studentName?.trim(),
  //           )
  //           .map((item) => [item.studentName.trim(), item]),
  //       ).values(),
  //     ];
  //     console.log(students);
  //     // setPrintStudents(students);
  //   });
  // }, [selectedDepartment]);

  useEffect(() => {
    const uniqueEvaluations = [
      ...new Map(
        eventEvaluationDetails
          .filter((item) => item.studentName?.trim())
          .map((item) => [item.studentName.replace(/\s+/g, " ").trim(), item]),
      ).values(),
    ];
    const changeDataNames = uniqueEvaluations.filter(
      (student) => student.course === selectedCourse,
    );
    setPrintStudents(changeDataNames);
  }, [selectedCourse, eventEvaluationDetails]);

  const generatePDF = async () => {
    if (printStudents.length === 0) {
      Alert.alert("No students", "No students available.");
      return;
    }
    console.log("Names ", printStudents);

    const html = `
  <html>
    <body>
      <h1>${eventTitle}</h1>
      <h2>${selectedCourse} Students</h2>

      <table border="1" style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
          </tr>
        </thead>
        <tbody>
          ${printStudents
            .map(
              (student, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${student.studentName}</td>
              </tr>
            `,
            )
            .join("")}
        </tbody>
      </table>

      <p>
        <strong>Total Students:</strong> ${printStudents.length}
      </p>
    </body>
  </html>
  `;

    try {
      const { uri } = await Print.printToFileAsync({ html });

      const fileUri = `${FileSystem.documentDirectory}${selectedCourse}-Students.pdf`;

      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading evaluations...</Text>
      </View>
    );

  return (
    <View style={{ marginTop: 20, flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        {eventTitle}
      </Text>

      <Text style={{ marginTop: 10, textAlign: "center" }}>
        Total Evaluations: {printStudents.length}
      </Text>

      <Text style={{ textAlign: "center" }}>
        Student Overall Rate: {overallResult.overallAverageRate}
      </Text>

      <View style={styles.container}>
        <Text style={styles.label}>Select Course</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCourse}
            onValueChange={(itemValue) => setSelectedCouse(itemValue)}
            style={styles.picker}
            dropdownIconColor="#2563eb"
          >
            {Object.values(Course).map((course) => (
              <Picker.Item key={course} label={course} value={course} />
            ))}
          </Picker>
        </View>

        {/* Touchable print button */}
        <TouchableHighlight
          onPress={() => generatePDF()}
          underlayColor="#0056b3"
          style={{
            backgroundColor: "#007bff",
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            🖨️ Print names
          </Text>
        </TouchableHighlight>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={[styles.modalTitle]}>Department Report</Text>

              <ScrollView style={styles.reportContainer}>
                <Text style={styles.reportText}>{reportText}</Text>
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      {/* Header Row */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#007bff",
          padding: 10,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Text
          style={{
            flex: 2,
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Student Name
        </Text>
      </View>

      {/* Data Rows */}
      {printStudents.map((evalItem, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            padding: 10,
            borderWidth: 1,
            borderColor: "#ddd",
            backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
          }}
        >
          <Text style={{ flex: 2 }}>
            {index + 1} {evalItem.studentName}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default PrintScreen;

const styles = StyleSheet.create({
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

  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  headerContainer: {
    // backgroundColor: "orange",

    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnPrintNames: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  buttonPrintText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContainer: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  reportContainer: {
    maxHeight: 500,
  },

  reportText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#333",
  },

  closeButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
});
