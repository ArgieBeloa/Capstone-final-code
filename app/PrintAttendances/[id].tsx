import { getEventById } from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import { EventAttendance } from "@/api/events/utils";
import { Course } from "@/api/students/utils";

import { useUser } from "@/src/userContext";
import { Picker } from "@react-native-picker/picker";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PrintScreen = () => {
  const { studentToken } = useUser();
  const { id } = useLocalSearchParams();
  const [logo, setLogo] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(
    Course.BACHELOR_OF_SCIENCE_IN_INFORMATION_TECHNOLOGY,
  );

  const [event, setEvent] = useState<EventModel | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await getEventById(studentToken, id as string);
        setEvent(res);
      } catch (error) {
        console.error("❌ Error loading event:", error);
      }
    };

    loadEvent();
  }, [id, studentToken]);

  useEffect(() => {
    const loadLogo = async () => {
      const asset = Asset.fromModule(
        require("@/assets/images/cpcLogo2-removebg.png"),
      );

      await asset.downloadAsync();

      if (Platform.OS === "web") {
        setLogo(asset.uri);
      } else {
        const base64 = await FileSystem.readAsStringAsync(asset.localUri!, {
          encoding: FileSystem.EncodingType.Base64,
        });

        setLogo(`data:image/png;base64,${base64}`);
      }
    };

    loadLogo();
  }, []);
  // =========================
  // GENERATE HTML
  // =========================
  const generateHTML = (department?: string) => {
    if (!event) return "<p>No data available</p>";

    const uniqueEvaluations = [
      ...new Map(
        event.eventAttendances
          .filter((item) => item.studentName?.trim())
          .map((item) => [item.studentName.replace(/\s+/g, " ").trim(), item]),
      ).values(),
    ];

    let attendance: EventAttendance[] = [...(uniqueEvaluations || [])];

    // Filter by department
    if (department) {
      attendance = attendance.filter((a) => a.department === department);
    }

    // Sort by Department → Name
    attendance.sort((a, b) => {
      const depCompare = (a.department ?? "").localeCompare(b.department ?? "");
      if (depCompare !== 0) return depCompare;

      return (a.studentName ?? "").localeCompare(b.studentName ?? "");
    });

    if (attendance.length === 0) {
      return `<p>No attendance found</p>`;
    }

    const chunkSize = 80; // 80 per page
    const columnSize = 40; // 40 per column
    const pages: string[] = [];

    for (let i = 0; i < attendance.length; i += chunkSize) {
      const chunk = attendance.slice(i, i + chunkSize);

      const col1 = chunk.slice(0, columnSize);
      const col2 = chunk.slice(columnSize, chunkSize);

      const renderRows = (data: EventAttendance[], startIndex: number) =>
        data
          .map(
            (s, index) => `
            <tr>
              <td>${startIndex + index + 1}</td>
              <td>${s.studentName}</td>
              <td>${s.dateScanned ?? ""}</td>
              <td>${s.department ?? ""}</td>
            </tr>
          `,
          )
          .join("");

      pages.push(`
        <div class="page">
         <div class="header">
            <img src="${logo}" class="logo" />

            <div class="header-text">
              <h1>Colegio De la Purisima Concepcion</h1>
              <p>The School of the Archdiocese of capiz <br>
                 Roxas City 5800, Philippines <br>
                 Tel/ FAX NO. (036) 6210286
              </p>
              <h1>Office Of the Student Affairs & Services</h1>
              <h2>${event.eventTitle}</h2>
              ${department ? `<h3>${department}</h3>` : ""}

              <p><strong>Date:</strong> ${event.eventDate}</p>
              <p><strong>Location:</strong> ${event.eventLocation}</p>
            </div>

            <img src="${logo}" class="logo" />

           </div>
          <div class="columns">
            <!-- LEFT COLUMN -->
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                ${renderRows(col1, i)}
              </tbody>
            </table>

            <!-- RIGHT COLUMN -->
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                ${renderRows(col2, i + columnSize)}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <div class="footer-left">
              ${
                Math.floor(i / chunkSize) + 1 ===
                Math.ceil(attendance.length / chunkSize)
                  ? `
                  <p>
                    <strong>Total number of members who attended:</strong>
                    ${attendance.length}
                  </p>

                  <p>
                    <em>(To be filled up by OSA personnel)</em><br><br>
                    <strong>Received by:</strong> _____________________________________________
                    &nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;
                    <strong>Date:</strong> ______________________
                  </p>
                `
                  : ""
              }
            </div>

            <div class="footer-right">
              Page ${Math.floor(i / chunkSize) + 1} of
              ${Math.ceil(attendance.length / chunkSize)}
            </div>
          </div>
        </div>
      `);
    }

    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .page { page-break-after: always; }

            h2, h3 { text-align: center; }

            .columns {
              display: flex;
              gap: 10px;
            }
table {
  width: 49%;
  border-collapse: collapse;
  border: 1px solid #000;
}

th {
  border: 1px solid #000;
  padding: 6px;
  font-size: 10px;
  text-align: center;
  background: #f5f5f5;
}

td {
  border: 1px solid #000;
  padding: 5px 6px;
  font-size: 10px;
  text-align: center;      /* Center horizontally */
  vertical-align: middle;  /* Center vertically */
}   
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }

            .logo {
              width: 70px;
              height: 70px;
              object-fit: contain;
              flex-shrink: 0;
            }

            .header-text {
              flex: 1;
              text-align: center;
              padding: 0 15px;
            }

            .header-text h1 {
              margin: 0;
              font-size: 20px;
              font-weight: bold;
            }

            .header-text p {
              margin: 2px 0;
              font-size: 12px;
            }

            .header-text h2 {
              margin: 8px 0 3px;
              font-size: 18px;
            }

            .header-text h3 {
              margin: 0 0 5px;
              font-size: 14px;
            }
            .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            padding-top: 6px;
            border-top: 1px solid #999;
            font-size: 10px;
            color: #666;
          }

          .footer-left {
            text-align: left;
          }

          .footer-right {
            text-align: right;
          }
          </style>
        </head>
        <body>${pages.join("")}</body>
      </html>
    `;
  };

  const generateHTMLPrintByCourse = (course?: string) => {
    if (!event) return "<p>No data available</p>";

    const uniqueEvaluations = [
      ...new Map(
        event.eventAttendances
          .filter((item) => item.studentName?.trim())
          .map((item) => [item.studentName.replace(/\s+/g, " ").trim(), item]),
      ).values(),
    ];

    let attendance: EventAttendance[] = [...(uniqueEvaluations || [])];

    // Filter by department
    if (course) {
      attendance = attendance.filter((a) => a.course === course);
    }

    // Sort by Department → Name
    attendance.sort((a, b) => {
      const depCompare = (a.course ?? "").localeCompare(b.course ?? "");
      if (depCompare !== 0) return depCompare;

      return (a.studentName ?? "").localeCompare(b.studentName ?? "");
    });

    if (attendance.length === 0) {
      return `<p>No attendance found</p>`;
    }

    const chunkSize = 80; // 80 per page
    const columnSize = 40; // 40 per column
    const pages: string[] = [];

    for (let i = 0; i < attendance.length; i += chunkSize) {
      const chunk = attendance.slice(i, i + chunkSize);

      const col1 = chunk.slice(0, columnSize);
      const col2 = chunk.slice(columnSize, chunkSize);

      const renderRows = (data: EventAttendance[], startIndex: number) =>
        data
          .map(
            (s, index) => `
            <tr>
              <td>${startIndex + index + 1}</td>
              <td>${s.studentName}</td>
              <td>${s.dateScanned ?? ""}</td>
              <td>${s.department ?? ""}</td>
            </tr>
          `,
          )
          .join("");

      pages.push(`
        <div class="page">
         <div class="header">
            <img src="${logo}" class="logo" />

            <div class="header-text">
              <h1>Colegio De la Purisima Concepcion</h1>
              <p>The School of the Archdiocese of capiz <br>
                 Roxas City 5800, Philippines <br>
                 Tel/ FAX NO. (036) 6210286
              </p>
              <h1>Office Of the Student Affairs & Services</h1>
              <h2>${event.eventTitle}</h2>
              ${course ? `<h3>${course}</h3>` : ""}

              <p><strong>Date:</strong> ${event.eventDate}</p>
              <p><strong>Location:</strong> ${event.eventLocation}</p>
            </div>

            <img src="${logo}" class="logo" />

           </div>
          <div class="columns">
            <!-- LEFT COLUMN -->
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                ${renderRows(col1, i)}
              </tbody>
            </table>

            <!-- RIGHT COLUMN -->
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                ${renderRows(col2, i + columnSize)}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <div class="footer-left">
              ${
                Math.floor(i / chunkSize) + 1 ===
                Math.ceil(attendance.length / chunkSize)
                  ? `
                  <p>
                    <strong>Total number of members who attended:</strong>
                    ${attendance.length}
                  </p>

                  <p>
                    <em>(To be filled up by OSA personnel)</em><br><br>
                    <strong>Received by:</strong> _____________________________________________
                    &nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;
                    <strong>Date:</strong> ______________________
                  </p>
                `
                  : ""
              }
            </div>

            <div class="footer-right">
              Page ${Math.floor(i / chunkSize) + 1} of
              ${Math.ceil(attendance.length / chunkSize)}
            </div>
          </div>
        </div>
      `);
    }

    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .page { page-break-after: always; }

            h2, h3 { text-align: center; }

            .columns {
              display: flex;
              gap: 10px;
            }
table {
  width: 49%;
  border-collapse: collapse;
  border: 1px solid #000;
}

th {
  border: 1px solid #000;
  padding: 6px;
  font-size: 10px;
  text-align: center;
  background: #f5f5f5;
}

td {
  border: 1px solid #000;
  padding: 5px 6px;
  font-size: 10px;
  text-align: center;      /* Center horizontally */
  vertical-align: middle;  /* Center vertically */
}   
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }

            .logo {
              width: 70px;
              height: 70px;
              object-fit: contain;
              flex-shrink: 0;
            }

            .header-text {
              flex: 1;
              text-align: center;
              padding: 0 15px;
            }

            .header-text h1 {
              margin: 0;
              font-size: 20px;
              font-weight: bold;
            }

            .header-text p {
              margin: 2px 0;
              font-size: 12px;
            }

            .header-text h2 {
              margin: 8px 0 3px;
              font-size: 18px;
            }

            .header-text h3 {
              margin: 0 0 5px;
              font-size: 14px;
            }
            .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            padding-top: 6px;
            border-top: 1px solid #999;
            font-size: 10px;
            color: #666;
          }

          .footer-left {
            text-align: left;
          }

          .footer-right {
            text-align: right;
          }
          </style>
        </head>
        <body>${pages.join("")}</body>
      </html>
    `;
  };

  // =========================
  // PRINT HANDLER
  // =========================
  const handlePrint = async (department?: string) => {
    if (!event) return;

    setLoading(true);
    try {
      const html = generateHTML(department);

      if (Platform.OS === "web") {
        const win = window.open("", "_blank");
        if (win) {
          win.document.write(html);
          win.document.close();
          win.focus();
          win.print();
        }
      } else {
        const { uri } = await Print.printToFileAsync({ html });

        const name = department
          ? `${event.eventTitle}-${department}`
          : `${event.eventTitle}-ALL`;

        const safeName = name.replace(/[^\w\s-]/g, "");
        const fileUri = `${FileSystem.documentDirectory}${safeName}.pdf`;

        await FileSystem.moveAsync({ from: uri, to: fileUri });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert("PDF Created", fileUri);
        }
      }
    } catch (err) {
      console.error("❌ PDF Error:", err);
      Alert.alert("Error", "Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  // Print by course
  const handlePrintCourse = async (course?: string) => {
    if (!event) return;

    setLoading(true);
    try {
      const html = generateHTMLPrintByCourse(course);

      if (Platform.OS === "web") {
        const win = window.open("", "_blank");
        if (win) {
          win.document.write(html);
          win.document.close();
          win.focus();
          win.print();
        }
      } else {
        const { uri } = await Print.printToFileAsync({ html });

        const name = course
          ? `${event.eventTitle}-${course}`
          : `${event.eventTitle}-ALL`;

        const safeName = name.replace(/[^\w\s-]/g, "");
        const fileUri = `${FileSystem.documentDirectory}${safeName}.pdf`;

        await FileSystem.moveAsync({ from: uri, to: fileUri });

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert("PDF Created", fileUri);
        }
      }
    } catch (err) {
      console.error("❌ PDF Error:", err);
      Alert.alert("Error", "Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📄 Print Attendance</Text>

      {event ? (
        <>
          <Text style={styles.title}>{event.eventTitle}</Text>
          <Text>Date: {event.eventDate}</Text>
          <Text>Location: {event.eventLocation}</Text>

          <View style={styles.buttonContainer}>
            <Button
              title={loading ? "Generating..." : "All students"}
              onPress={() => handlePrint()}
              disabled={loading}
            />

            <Button title="CET" onPress={() => handlePrint("CET")} />
            <Button title="CASE" onPress={() => handlePrint("CASE")} />
            <Button title="CME" onPress={() => handlePrint("CME")} />
            <Button title="CHTM" onPress={() => handlePrint("CHTM")} />
            <Button title="CCJ" onPress={() => handlePrint("CCJ")} />
          </View>
          <Text style={styles.label}>By Course</Text>

          <View style={styles.containerpicker}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCourse}
                onValueChange={setSelectedCourse}
              >
                {Object.values(Course).map((course) => (
                  <Picker.Item key={course} label={course} value={course} />
                ))}
              </Picker>
            </View>
          </View>

          <Button
            title="Print Selected Course"
            onPress={() => handlePrintCourse(selectedCourse)}
          />
        </>
      ) : (
        <Text>Loading event...</Text>
      )}
    </ScrollView>
  );
};

export default PrintScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
    width: "80%",
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
});
