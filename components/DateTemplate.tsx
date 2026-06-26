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

type DateTemplateProps = {
  label: string;
  dateState: Date | null;
  setDateState: (date: Date) => void;
  show: boolean;
  setShow: (show: boolean) => void;
};

const DateTemplate = ({
  label,
  dateState,
  setDateState,
  show,
  setShow,
}: DateTemplateProps) => {
  return (
    <>
      <TouchableOpacity
        style={styles.rowInput}
        onPress={() => {
          if (Platform.OS !== "web") {
            setShow(true);
          }
        }}
      >
        <Clock color={COLORS.Primary} />
        <Text style={styles.rowText}>
          {dateState ? `Date: ${dateState.toLocaleString()}` : label}
        </Text>
      </TouchableOpacity>

      {Platform.OS === "web" ? (
        <View style={{ marginVertical: 6 }}>
          <input
            type="datetime-local"
            value={
              dateState
                ? new Date(
                    dateState.getTime() - dateState.getTimezoneOffset() * 60000,
                  )
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
            onChange={(e) => {
              if (e.target.value) {
                setDateState(new Date(e.target.value));
              }
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
        show && (
          <DateTimePicker
            mode="datetime"
            value={dateState || new Date()}
            display="default"
            onChange={(_, date) => {
              setShow(false);
              if (date) {
                setDateState(date);
              }
            }}
          />
        )
      )}
    </>
  );
};

export default DateTemplate;

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
  rowText: { fontSize: 16 },
});
