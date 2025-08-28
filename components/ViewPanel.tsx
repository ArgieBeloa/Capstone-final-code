import { COLORS } from "@/constants/ColorCpc";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
interface ViewPanelProps {
  title?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ViewPanel: React.FC<ViewPanelProps> = ({ title, children, style }) => {
  return (
    
    <View style={[styles.containerView, style]}>
      <View>{children}</View>
    </View>
  );
};

export default ViewPanel;

const styles = StyleSheet.create({
  containerView: {
    backgroundColor: COLORS.Forth,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingTop: 10,
    // marginVertical: 10,

    maxWidth: 500,

    shadowOffset: {
      width: 5, // Horizontal offset
      height: 7, // Vertical offset
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // These elevation properties are for Android
    elevation: 10,
  },

});
