import { COLORS } from "@/constants/ColorCpc";
import { StyleSheet } from "react-native";

const studentStyles = StyleSheet.create({
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
    position: "relative",
    flexDirection: "row",
    gap:10,
    borderRadius: 7,
    padding:5,
    backgroundColor: COLORS.Third,
    alignItems: "center",
    marginVertical: 6,
    overflow: "hidden",
  },
   avatarStudent: {
    backgroundColor: "grey",
    width: 65,
    height: 65,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  containerStudentsInfo:{
     flex: 1
  },
  studentNameText :{
   fontSize: 17,
   fontWeight: 600,
  },
   studentCourseText :{
   fontSize: 14,
   fontWeight: 500,
  },
  studentStatus:{
    position: "absolute",
    right:10,
    top:10

  }

});

export default studentStyles
