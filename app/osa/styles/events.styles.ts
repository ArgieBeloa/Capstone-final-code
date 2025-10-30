import { COLORS } from "@/constants/ColorCpc";
import { StyleSheet } from "react-native";

const eventStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  avatar: {
    backgroundColor: "grey",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontWeight: "600",
    color: "white",
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e2e2ff",
    borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1,
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#000",
  },
  containerFlatlist: {
    padding: 5,
  },
  containerItem: {
    borderRadius: 7,
    backgroundColor: COLORS.Third,
    marginVertical: 6,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  iconText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
  },
});

export default eventStyles;
