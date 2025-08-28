import { Entypo, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface CustomTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string; // text shown above input
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  icon?: string; // icon name like "mail-outline", "lock-closed-outline"
  iconType?: "Ionicons" | "Entypo"; // specify icon library
}

const RegisterInputComponent: React.FC<CustomTextInputProps> = ({
  value,
  onChangeText,
  placeholder = "",
  label,
  style,
  inputStyle,
  icon,
  iconType = "Ionicons",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const renderIcon = () => {
    if (!icon) return null;
    const color = isFocused ? "#4F46E5" : "#666";

    if (iconType === "Ionicons") {
      return <Ionicons name={icon as any} size={20} color={color} style={styles.icon} />;
    } else if (iconType === "Entypo") {
      return <Entypo name={icon as any} size={20} color={color} style={styles.icon} />;
    }
    return null;
  };

  return (
    <View style={{ marginBottom: 8,}}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.container,
          style,
          isFocused && styles.containerFocused,
        ]}
      >
        {renderIcon()}
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "black",
    marginBottom: 4,
  },
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  containerFocused: {
    borderColor: "#4F46E5",
    shadowColor: "#4F46E5",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 10,
    paddingLeft: 5,
  },
});

export default RegisterInputComponent;
