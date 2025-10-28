import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ Import from your controller
import { pickImageFromGallery, uploadEventImage } from "@/api/events/controller";
import { PickedImage } from "@/api/events/utils"; // or "@/api/events/controller" if you defined it there

const TestUploadScreen = () => {
  const [image, setImage] = useState<PickedImage | null>(null);
  const [uploading, setUploading] = useState(false);

  // Example hardcoded data — replace with your actual event + token
  const eventId = "690021d952af6d5f89445479";
  const token =
    "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiIyMDU1MDAwMSIsImlhdCI6MTc2MTYxNjg5OSwiZXhwIjoxNzYxNjYwMDk5LCJyb2xlIjoiQURNSU4ifQ.p0lSpJ55fZimlQesxz4Cg66kctnicTEmE4bimVor0C1Jxo3MfCmDRsBFaxMTnjC9";

  // 📸 Pick Image using the shared function
  const handlePickPhoto = async () => {
    const selected = await pickImageFromGallery();
    if (selected) {
      setImage(selected);
      console.log("✅ Image selected:", selected.uri);
    }
  };

  // 🚀 Upload to backend
  const handleUpload = async () => {
    if (!image) {
      Alert.alert("Please select an image first!");
      return;
    }

    try {
      setUploading(true);
      const result = await uploadEventImage(image, eventId, token);
      console.log("✅ Upload success:", result);
      Alert.alert("✅ Upload successful!");
    } catch (error: any) {
      console.error("❌ Upload failed:", error.message || error);
      Alert.alert("❌ Upload failed", error.message || "Unknown error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity onPress={handlePickPhoto} style={styles.button}>
          <Text style={styles.buttonText}>Pick Photo</Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image.uri }}
            style={styles.preview}
          />
        )}

        <TouchableOpacity
          onPress={handleUpload}
          disabled={uploading}
          style={[styles.button, uploading && { backgroundColor: "#999" }]}
        >
          <Text style={styles.buttonText}>
            {uploading ? "Uploading..." : "Upload Image"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TestUploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: 15,
  },
});
