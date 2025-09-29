import { StudentAttended } from "@/api/ApiType";
import React from "react";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QrGenerator() {
  const date = new Date(Date.now())
  const dateString = date.toString();
  // sample data
  const eventData: StudentAttended= {
      eventId: "68d6aa9aa686292244552d95",
      eventTitle: "Enrollment Hub",
      studentDateAttended: dateString 
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ marginBottom: 20, fontSize: 18, fontWeight: "bold" }}>
        Event QR Code
      </Text>

      <QRCode
        value={JSON.stringify(eventData)} // 👈 encode JSON into QR
        size={200} // QR size
        backgroundColor="white"
        color="black"
      />
    </View>
  );
}
