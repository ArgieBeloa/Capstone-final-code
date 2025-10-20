
import { getEventById } from "@/api/events/controller";
import { EventModel } from "@/api/events/model";

import { useUser } from "@/src/userContext";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import { Alert, Button, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

const PrintScreen = () => {
  const { studentToken } = useUser();
  const { id } = useLocalSearchParams();
  const [eventAttendances, setEventAttendances] = useState<EventModel | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getEvent = async () => {
      try {
        const event = await getEventById(studentToken, id as string);
        setEventAttendances(event);
      } catch (error) {
        console.error("Error loading event:", error);
      }
    };
    getEvent();
  }, []);

  const generateHTML = () => {
    if (!eventAttendances) return "<p>No data available</p>";

    const students = eventAttendances.eventAttendances || [];
    const pages = [];
    const chunkSize = 50;

    for (let i = 0; i < students.length; i += chunkSize) {
      const chunk = students.slice(i, i + chunkSize);
      const tableRows = chunk
        .map(
          (s, index) => `
        <tr>
          <td>${i + index + 1}</td>
          <td>${s.studentName}</td>
          <td>${s.dateScanned || ""}</td>
          <td>${s.role || ""}</td>
        </tr>`
        )
        .join("");

      pages.push(`
        <div class="page">
          <h2>${eventAttendances.eventTitle}</h2>
          <p><strong>Date:</strong> ${eventAttendances.eventDate}</p>
          <p><strong>Location:</strong> ${eventAttendances.eventLocation}</p>

          <table>
            <thead>
              <tr><th>#</th><th>Name</th><th>Date</th<th>Role</th>></tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>

          <div class="footer">
            Page ${Math.floor(i / chunkSize) + 1} / ${Math.ceil(students.length / chunkSize)}
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
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
            th { background: #f0f0f0; }
            .footer { text-align: right; margin-top: 10px; font-size: 10px; color: #666; }
          </style>
        </head>
        <body>${pages.join("")}</body>
      </html>
    `;
  };

  const handlePrintOrSave = async () => {
    if (!eventAttendances) return;
    setLoading(true);

    try {
      const html = generateHTML();
      const eventTitle = eventAttendances.eventTitle.trim();

      if (Platform.OS === "web") {
        // 💻 Web printing
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write("<!DOCTYPE html><html><head></head><body></body></html>");
          printWindow.document.close();
          printWindow.document.body.innerHTML = html;
          printWindow.focus();
          printWindow.print();
        }
      } else {
        // 📄 Generate PDF
        const { uri } = await Print.printToFileAsync({ html });
        const safeFileName = `${eventTitle.replace(/[^\w\s-]/g, "")}.pdf`;
        const fileUri = `${FileSystem.documentDirectory}${safeFileName}`;

        await FileSystem.moveAsync({ from: uri, to: fileUri });
        console.log("✅ PDF saved as:", fileUri);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, { dialogTitle: safeFileName });
        } else {
          Alert.alert("PDF Created", `File saved at:\n${fileUri}`);
        }
      }
    } catch (error) {
      console.error("❌ Error:", error);
      Alert.alert("Error", "Failed to generate or save PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📄 Print or Save Attendance</Text>
      {eventAttendances ? (
        <>
          <Text style={styles.title}>{eventAttendances.eventTitle}</Text>
          <Text>Date: {eventAttendances.eventDate}</Text>
          <Text>Location: {eventAttendances.eventLocation}</Text>

          <View style={styles.buttonContainer}>
            <Button
              title={loading ? "Generating..." : Platform.OS === "web" ? "Print Attendance" : "Save PDF"}
              onPress={handlePrintOrSave}
              disabled={loading}
            />
          </View>
        </>
      ) : (
        <Text>Loading event data...</Text>
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
    width: "80%",
  },
});
