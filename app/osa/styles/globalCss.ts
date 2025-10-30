import { StyleSheet } from "react-native";

const mobileViewStyles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    // backgroundColor: "#f2f2f2",
    alignItems: "center",
    // justifyContent: "center",
    paddingHorizontal: 10,
  },
  container: {
    width: "100%", // full width on mobile
    maxWidth: 720, // ❗ keeps it mobile-sized on laptop screens
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginVertical: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#222",
    marginTop: 10,
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },

  defaultText: {
    margin: "auto",
    fontSize: 16,
    color: "#555",
  },
  resultsContainer: {
    position: "absolute",
    top: 60,
    left: 60,
    right: 0,
    width: 200,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 9999,
    elevation: 10,
    maxHeight: 200,
    borderRadius: 8,
  },
  resultItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  resultText: {
    fontSize: 16,
    color: "#333",
  },
  highlight: {
    color: "#007bff",
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // Styles.loadingOverlay and Styles.loadingText
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingBox: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  loadingText: {
    marginTop: 10,
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
   emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default mobileViewStyles;
