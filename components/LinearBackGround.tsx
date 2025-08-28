// GradientWrapper.tsx
import { COLORS } from "@/constants/ColorCpc"; // adjust path if needed
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { ColorValue, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface LinearbackGroundProps {
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]]; // tuple type for LinearGradient
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

const LinearbackGround: React.FC<LinearbackGroundProps> = ({
  colors = [COLORS.Secondary, COLORS.Third, COLORS.Forth] as const, // 'as const' makes it a tuple
  style,
  children,
}) => {
  return (
    <LinearGradient colors={colors} style={[styles.gradient, style]}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default LinearbackGround;
