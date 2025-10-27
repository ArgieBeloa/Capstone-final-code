import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Button, Image, Platform, View } from "react-native";

interface UploadEventImageProps {
  eventId: string;
  token: string;
}

interface PickedImage {
  uri: string;
  type: string;
  fileName?: string;
}

const UploadEventImage: React.FC<UploadEventImageProps> = ({
  eventId,
  token,
}) => {
  const [image, setImage] = useState<PickedImage | null>(null);
  const [uploading, setUploading] = useState(false);

  // 📸 Pick image (Expo SDK 51–53 compatible)
  const pickImage = async () => {
    const hasNewAPI = (ImagePicker as any).MediaType;
    const mediaTypes = hasNewAPI
      ? [(ImagePicker as any).MediaType.image]
      : (ImagePicker as any).MediaTypeOptions.Images;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes,
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImage({
        uri: asset.uri,
        type: asset.mimeType ?? "image/jpeg",
        fileName: asset.fileName ?? "upload.jpg",
      });
    }
  };

  // 🚀 Upload to Spring Boot backend
  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Please select an image first.");
      return;
    }

    setUploading(true);
    const url = `https://securebackend-ox2e.onrender.com/api/events/${eventId}/upload-image`;

    try {
      const formData = new FormData();

      if (Platform.OS === "web") {
        // 🖥 Web: must use real File
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const file = new File([blob], image.fileName ?? "upload.jpg", {
          type: image.type,
        });
        formData.append("file", file);
      } else {
        // 📱 Native
        formData.append("file", {
          uri:
            Platform.OS === "ios"
              ? image.uri.replace("file://", "")
              : image.uri,
          name: image.fileName,
          type: image.type,
        } as any);
      }

      // ✅ Axios auto-handles boundaries
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert("✅ Upload successful!");
      console.log("Response:", response.data);
    } catch (error: any) {
      console.error("Upload error:", error);
      Alert.alert("❌ Upload failed", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{
            width: 200,
            height: 200,
            borderRadius: 10,
            marginBottom: 10,
            alignSelf: "center",
          }}
        />
      )}

      <Button title="Pick Image" onPress={pickImage} />

      <View style={{ marginTop: 10 }}>
        <Button
          title={uploading ? "Uploading..." : "Upload Image"}
          onPress={uploadImage}
          disabled={uploading}
        />
      </View>
    </View>
  );
};

export default UploadEventImage;
