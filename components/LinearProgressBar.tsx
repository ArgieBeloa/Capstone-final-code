import { COLORS } from "@/constants/ColorCpc";
import React from "react";
import { Text, View } from "react-native";

const LinearProgressBar = ({
  value,
  max,
  title,
}: {
  value: number;
  max: number;
  title: string;
}) => {
  const progress = (value / max) * 100;


  
  return (
    <View style={{ width: "100%", alignItems: "center", marginVertical:5}}>
      {/* background */}
      {/* label */}

      <View style={{ flexDirection: "row", marginRight: "auto", gap: 10, marginBottom:5}}>
        <Text
          style={{ fontSize: 16, fontWeight: 500, color: COLORS.TextColor }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: COLORS.TextColor,
          }}
        >
          {value.toFixed(1)} / {max.toFixed(1)}
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          height: 12,
          backgroundColor: COLORS.Secondary,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {/* progress fill */}
        <View
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: COLORS.Primary,
            borderRadius: 10,
          }}
        />
      </View>
    </View>
  );
};

export default LinearProgressBar;
