import { COLORS } from "@/constants/ColorCpc";
import { StyleSheet } from "react-native";

export const approvalStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.Forth,
    width: "95%",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    color: "#666",
    marginTop: 4,
  },

  date: {
    color: "#888",
    marginTop: 6,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
    gap: 10,
  },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 5,
  },

  approveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 5,
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 10,
  },

  modalMessage: {
    textAlign: "center",
    marginTop: 10,
    color: "#666",
  },

  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },

  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
  },

  confirmBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#10B981",
    borderRadius: 10,
  },
});
