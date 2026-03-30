import { getEventById } from "@/api/events/controller";
import { EventModel } from "@/api/events/model";
import { EventAttendance } from "@/api/events/utils";

import { useUser } from "@/src/userContext";
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

  // =========================
  // GENERATE HTML
  // =========================
  const generateHTML = (department?: string) => {
    if (!event) return "<p>No data available</p>";

    let attendance: EventAttendance[] = [...(event.eventAttendances || [])];

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
          <h2>${event.eventTitle}</h2>
          ${department ? `<h3>${department}</h3>` : ""}
          <p><strong>Date:</strong> ${event.eventDate}</p>
          <p><strong>Location:</strong> ${event.eventLocation}</p>

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
            Page ${Math.floor(i / chunkSize) + 1} /
            ${Math.ceil(attendance.length / chunkSize)}
          </div>
        </div>
      `);
    }

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            .page { page-break-after: always; }

            h2, h3 { text-align: center; }

            .columns {
              display: flex;
              gap: 10px;
            }

            table {
              width: 50%;
              border-collapse: collapse;
              margin-top: 20px;
            }

            th, td {
              border: 1px solid #ccc;
              padding: 6px;
              font-size: 10px;
            }

            th { background: #f0f0f0; }

            .footer {
              text-align: right;
              margin-top: 10px;
              font-size: 10px;
              color: #666;
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
});
