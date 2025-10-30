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
});

export default mobileViewStyles;
