import { COLORS } from "@/constants/ColorCpc"; // optional if you have a color constant file
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface FloatingButtonProps {
  onPress: () => void;
  iconName?: keyof typeof AntDesign.glyphMap;
  backgroundColor?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  iconName = "plus",
  backgroundColor = COLORS?.Secondary|| "#007AFF",
}) => {
  return (
    <TouchableOpacity style={[styles.fab, { backgroundColor }]} onPress={onPress}>
      <AntDesign name={iconName} size={28} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 25, // distance from bottom
    right: 25,  // distance from right
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default FloatingButton;
