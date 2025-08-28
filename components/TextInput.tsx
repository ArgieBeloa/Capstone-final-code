import React from "react";
import { StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native";

interface CustomTextInputProps {
  value: string; // current input value
  onChangeText: (text: string) => void; // callback when text changes
  placeholder?: string; // optional placeholder
  style?: StyleProp<ViewStyle>; // container style
  inputStyle?: StyleProp<TextStyle>; // text input style
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  value,
  onChangeText,
  placeholder = "",
  style,
  inputStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default CustomTextInput;
