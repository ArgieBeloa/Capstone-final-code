import { getEventById } from "@/api/EventService";
import { useUser } from "@/src/userContext";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import { EventEvaluationDetail } from "../Oop/Types";

const PrintScreen = () => {
  const { studentToken } = useUser();
  const { id } = useLocalSearchParams();

  const [eventTitle, setEventTitle] = useState("");
  const [eventEvaluationDetails, setEventEvaluationDetails] = useState<
    EventEvaluationDetail[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Fetch event and store only evaluations
  const fetchEventById = async () => {
    try {
      const data = await getEventById(studentToken, id as string);
      console.log("Fetched event:", data);

      setEventTitle(data[0].eventTitle);
      setEventEvaluationDetails(data[0].eventEvaluationDetails ?? []);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventById();
  }, [id]);

  // Generate PDF with only evaluation data
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
            @page { size: A4; margin: 20mm; }
            body { font-family: Arial, sans-serif; }
            h1, h2, h3 { text-align: center; }
            .evaluation { margin-bottom: 20px; page-break-after: always; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #333; padding: 8px; font-size: 13px; }
            th { background: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${eventTitle}</h1>
          <h2>Student Evaluations</h2>
          ${eventEvaluationDetails
            .map(
              (evalItem) => `
                <div class="evaluation">
                  <h3>${evalItem.studentName}</h3>
                  <p><strong>Average Rate:</strong> ${
                    evalItem.studentAverageRate
                  }</p>
                  <p><strong>Suggestion:</strong> ${
                    evalItem.studentSuggestion
                  }</p>
                  <table>
                    <tr><th>Question</th><th>Rate</th></tr>
                    ${(evalItem.studentEvaluationInfos || [])
                      .map(
                        (info) =>
                          `<tr><td>${info.question}</td><td>${info.studentRate}</td></tr>`
                      )
                      .join("")}
                  </table>
                </div>
              `
            )
            .join("")}
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      const fileUri = `${FileSystem.documentDirectory}${eventTitle}-Evaluations.pdf`;
      await FileSystem.moveAsync({ from: uri, to: fileUri });

      Alert.alert("PDF Created", "Evaluation report generated successfully!");

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
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        {eventTitle}
      </Text>
      <Text style={{ marginTop: 10, textAlign: "center" }}>
        Total Evaluations: {eventEvaluationDetails.length}
      </Text>

      {/* Display evaluations */}
      <View style={{ marginTop: 20, flex: 1 }}>
        {eventEvaluationDetails.map((evalItem, index) => (
          <View
            key={index}
            style={{
              marginBottom: 20,
              backgroundColor: "#f9f9f9",
              padding: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {evalItem.studentName}
            </Text>
            <Text>⭐ Average Rate: {evalItem.studentAverageRate}</Text>
            <Text>💬 Suggestion: {evalItem.studentSuggestion}</Text>

            {(evalItem.studentEvaluationInfos || []).map((info, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 4,
                }}
              >
                <Text style={{ flex: 1 }}>{info.question}</Text>
                <Text style={{ width: 50, textAlign: "right" }}>
                  {info.studentRate}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Touchable print button */}
      <TouchableHighlight
        onPress={generatePDF}
        underlayColor="#0056b3"
        style={{
          backgroundColor: "#007bff",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          🖨️ Print Evaluation Report
        </Text>
      </TouchableHighlight>
    </View>
  );
};

export default PrintScreen;
