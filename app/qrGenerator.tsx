import React from "react";
import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QrGenerator() {
  // sample data
  const eventData = {
    id: "12345",
    title: "Ceremony",
    date: "2025-01-09",
    time: "14:00 - 18:00",
    location: "Auditorium",
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
