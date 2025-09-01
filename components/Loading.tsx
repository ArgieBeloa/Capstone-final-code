import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingProps {
  visible: boolean;       // Control visibility
  text?: string;
  color?: string;
  size?: "small" | "large";
}

const Loading: React.FC<LoadingProps> = ({
  visible,
  text = "Loading...",
  color = "#2563EB",
  size = "large",
}) => {
  if (!visible) return null; // Don't render anything if not visible

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // cover full screen
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(249, 250, 251, 0.8)", // semi-transparent background
    zIndex: 9999,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
});

export default Loading;
