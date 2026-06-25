import { Course, Department, DepartmentCourses } from "@/api/students/utils";
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

  const [selectedDepartment, setSelectedDepartment] = useState(Department.CET);

  const [modalVisible, setModalVisible] = useState(false);
  const [reportText, setReportText] = useState("");
  const [studentNames, setPrintStudentNames] = useState<
    EventEvaluationDetails[]
  >([]);

  const overallResult = getOverallEvaluationPerformance(eventEvaluationDetails);

  const uniqueEvaluations = [
    ...new Map(
      eventEvaluationDetails.map((item) => [item.studentName, item]),
    ).values(),
  ];

  const [loading, setLoading] = useState(true);

  // Fetch event and store only evaluations
  const fetchEventById = async () => {
    try {
      const data = await getEventById(studentToken, id as string);
      console.log("Fetched event:", data);

      setEventTitle(data.eventTitle);
      setEventEvaluationDetails(data.eventEvaluationDetails);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = (department: Department) => {
    const courses = DepartmentCourses[department];

    const departmentStudents = eventEvaluationDetails.filter((e) =>
      courses.includes(e.course as Course),
    );

    const totalNumber = [
      ...new Map(
        departmentStudents
          .filter((item) => item.studentName?.trim())
          .map((item) => [item.studentName.trim(), item]),
      ).values(),
    ].length;

    let text = `${department}\n`;
    text += `Total: ${totalNumber}\n\n`;

    courses.forEach((course) => {
      const students = [
        ...new Map(
          departmentStudents
            .filter(
              (item) => item.course === course && item.studentName?.trim(),
            )
            .map((item) => [item.studentName.trim(), item]),
        ).values(),
      ];
      setPrintStudentNames(students);

      text += `${course}\n`;
      text += `Total: ${students.length}\n`;

      if (students.length > 0) {
        text += students
          .map((student, index) => `${index + 1}. ${student.studentName}`)
          .join("\n");

        // set student names
        const names = students.map(
          (student, index) => `${index + 1}. ${student.studentName}`,
        );
      }

      text += "\n\n";
    });

    setReportText(text);

    setModalVisible(true);
  };

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

  const generatePDF = async () => {
    if (eventEvaluationDetails.length === 0) {
      Alert.alert("No evaluations", "No evaluation data available.");
      return;
    }

    const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }

        body {
          font-family: Arial, sans-serif;
          padding: 10px;
        }

        h1,
        h2 {
          text-align: center;
          margin-bottom: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th,
        td {
          border: 1px solid #333;
          padding: 8px;
          font-size: 13px;
          text-align: left;
          vertical-align: top;
        }

        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }

        .rate {
          text-align: center;
          width: 120px;
        }

        .student {
          width: 200px;
        }

        .suggestion {
          width: auto;
        }

        .footer {
          margin-top: 15px;
          font-size: 12px;
        }
      </style>
    </head>

    <body>

      <h1>${eventTitle}</h1>
      <h2>Student Evaluation Summary</h2>

      <table>
        <thead>
          <tr>
            <th class="student">Student Name</th>
            <th class="rate">Average Rate</th>
            <th class="suggestion">Suggestion</th>
          </tr>
        </thead>

        <tbody>
          ${uniqueEvaluations
            .map(
              (evalItem) => `
                <tr>
                  <td>${evalItem.studentName}</td>
                  <td class="rate">${evalItem.studentAverageRate}</td>
                  <td>${
                    evalItem.studentSuggestion || "No suggestion provided"
                  }</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>

      <div class="footer">
        <strong>Total Evaluations:</strong>
        ${eventEvaluationDetails.length}
      </div>

    </body>
  </html>
  `;

    try {
      const { uri } = await Print.printToFileAsync({ html });

      const fileUri = `${FileSystem.documentDirectory}${eventTitle}-StudentSummary-${Date.now()}.pdf`;

      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });

      Alert.alert(
        "PDF Created",
        "Student evaluation summary generated successfully!",
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("PDF saved at", fileUri);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
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
      {/* Touchable print button */}
      <TouchableHighlight
        onPress={generatePDF}
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
          🖨️ Print Evaluation Report
        </Text>
      </TouchableHighlight>

      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        {eventTitle}
      </Text>

      <Text style={{ marginTop: 10, textAlign: "center" }}>
        Total Evaluations: {uniqueEvaluations.length}
      </Text>

      <Text style={{ textAlign: "center" }}>
        Student Overall Rate: {overallResult.overallAverageRate}
      </Text>

      <View style={styles.container}>
        <Text style={styles.label}>Select Department</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDepartment}
            onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
            style={styles.picker}
            dropdownIconColor="#2563eb"
          >
            {Object.values(Department).map((department) => (
              <Picker.Item
                key={department}
                label={department}
                value={department}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => generateReport(selectedDepartment)}
        >
          <Text style={styles.buttonText}>View Report</Text>
        </TouchableOpacity>

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

        <Text
          style={{
            flex: 1,
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Rate
        </Text>

        <Text
          style={{
            flex: 3,
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Suggestion
        </Text>
      </View>

      {/* Data Rows */}
      {uniqueEvaluations.map((evalItem, index) => (
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
            {index + 1}. {evalItem.studentName}
          </Text>

          <Text
            style={{
              flex: 1,
              textAlign: "center",
            }}
          >
            {evalItem.studentAverageRate}
          </Text>

          <Text style={{ flex: 3 }}>
            {evalItem.studentSuggestion || "No suggestion"}
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
