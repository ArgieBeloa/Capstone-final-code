import { COLORS } from "@/constants/ColorCpc";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Clock } from "lucide-react-native";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TimeTemplateProp = {
  label: string;
  time: Date | undefined;
  setTime: (time: Date) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
};

const TimeTemplate = ({
  label,
  time,
  setTime,
  showModal,
  setShowModal,
}: TimeTemplateProp) => {
  const isValidDate = time instanceof Date && !isNaN(time.getTime());

  const handleTimeChange = (_: any, selected?: Date) => {
    setShowModal(false);

    if (selected) {
      setTime(selected);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.rowInput}
        onPress={() => {
          if (Platform.OS !== "web") {
            setShowModal(true);
          }
        }}
      >
        <Clock color={COLORS.Primary} />

        <Text style={styles.rowText}>
          {isValidDate
            ? `Start: ${time.toLocaleTimeString("en-PH", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}`
            : label}
        </Text>
      </TouchableOpacity>

      {Platform.OS === "web" ? (
        <View style={{ marginVertical: 6 }}>
          <input
            type="time"
            value={
              isValidDate
                ? `${String(time.getHours()).padStart(2, "0")}:${String(
                    time.getMinutes(),
                  ).padStart(2, "0")}`
                : ""
            }
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(":").map(Number);

              const date = new Date(time ?? new Date());

              date.setHours(hours, minutes, 0, 0);

              setTime(date);
            }}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "16px",
            }}
          />
        </View>
      ) : (
        showModal && (
          <DateTimePicker
            mode="time"
            value={isValidDate ? time : new Date()}
            display="default"
            onChange={handleTimeChange}
          />
        )
      )}
    </>
  );
};

export default TimeTemplate;

const styles = StyleSheet.create({
  rowInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
  },
  rowText: {
    fontSize: 16,
  },
});
