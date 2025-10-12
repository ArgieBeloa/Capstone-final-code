// 483729
import LinearbackGround from "@/components/LinearBackGround";
import { useUser } from "@/src/userContext";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { registerStudent } from "@/api/spring";

// 👇 Replace with your actual data fetch functions
import { getAllStudents, getStudentById } from "@/api/StudentService";
import Loading from "@/components/Loading";
import Mymodal from "@/components/Mymodal";
import { COLORS } from "@/constants/ColorCpc";
import { Student } from "../Oop/Types";

interface StudentSuggestionData {
  id: string;
  studentName: string;
}

const OsaScreen: React.FC = () => {
  const officerName = "OSA Officer";
  const { studentToken } = useUser();
  const firstLetterName = officerName.charAt(0).toUpperCase();

  const [studentSuggestionData, setStudentSuggestionData] = useState<
    StudentSuggestionData[]
  >([]);

  const [searchText, setSearchText] = useState("");
  const [searchStudentId, setSearchStudentId] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<
    StudentSuggestionData[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const [searchStudentData, setSearchStudentData] = useState<Student>();
  const [currentOfficer, setCurrentOfficer] = useState<Student[]>();
  const [studentNumber, setStudentNumber] = useState();

  // 📢 Announcement modal states
  const [allTokens, setAllTokens] = useState();
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");

  //   press function then modal promote then copy array the modify the expo token the category to officer

  //   loading announcement
  const [loading, setLoading] = useState(false);

  // loading search student
  const [searchLoading, setSearchLoading] = useState(false);
  const [promotionStatus, setPromotionStatus] = useState(false);

  //   modal showPromoteArea
  const [showPromoteArea, setShowPromoteArea] = useState(false);
  const [isPromoted, setIsPromoted] = useState(false);

  const handlePromote = async () => {
    setShowPromoteArea(false);
    setPromotionStatus(true);

    // copy array then change category to officer and expo token to ""
    try {
      // Example: copy and modify fields

      if (searchStudentData) {
        const updatedStudent: Student = {
          ...searchStudentData,
          category: "officer",
          studentPassword: "officer" + studentNumber,
        };

        setSearchStudentData(updatedStudent);

        // 2️⃣ then call your register API
        await registerStudent(updatedStudent);

        setIsPromoted(true);
      }

      setPromotionStatus(false);
    } catch (error) {
    } finally {
      setPromotionStatus(false);
    }
  };

  // 🧠 Load all students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const students = await getAllStudents(studentToken);
        setStudentSuggestionData(students);

        const onlyOfficers = students.filter(
          (item: Student) => item.category?.toLowerCase() === "officer"
        );
        setCurrentOfficer(onlyOfficers)

        const tokens = students
          .map((s: { tokenId?: string }) => s.tokenId)
          .filter(Boolean);
        setAllTokens(tokens);
        // console.log(tokens);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  // 🔍 Filter students
  useEffect(() => {
    if (isSelecting) {
      setIsSelecting(false);
      return;
    }

    if (searchText.trim() === "") {
      setFilteredStudents(studentSuggestionData);
      setShowResults(false);
    } else {
      const lower = searchText.toLowerCase();
      const filtered = studentSuggestionData.filter((item) =>
        item.studentName.toLowerCase().includes(lower)
      );
      setFilteredStudents(filtered);
      setShowResults(true);
    }
  }, [searchText, studentSuggestionData]);

  const handleSearch = async () => {
    setSearchLoading(true);

    try {
      const student = await getStudentById(studentToken, searchStudentId);

      setSearchStudentData(student);
      setStudentNumber(student.studentNumber);
      setSearchLoading(false);
    } catch (error) {
      setSearchLoading(false);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectStudent = (item: StudentSuggestionData) => {
    setIsSelecting(true);
    setSearchStudentId(item.id);
    setSearchText(item.studentName);
    setShowResults(false);
  };

  const renderHighlightedText = (name: string) => {
    if (!searchText) return <Text style={styles.resultText}>{name}</Text>;

    const lowerName = name.toLowerCase();
    const lowerSearch = searchText.toLowerCase();
    const startIndex = lowerName.indexOf(lowerSearch);

    if (startIndex === -1) return <Text style={styles.resultText}>{name}</Text>;

    const endIndex = startIndex + searchText.length;
    const before = name.slice(0, startIndex);
    const match = name.slice(startIndex, endIndex);
    const after = name.slice(endIndex);

    return (
      <Text style={styles.resultText}>
        {before}
        <Text style={styles.highlight}>{match}</Text>
        {after}
      </Text>
    );
  };

  //   handle all announcement
  function onSendAnnouncementPress(): void {}

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: COLORS.Forth,
            width: "95%",
            marginHorizontal: "auto",
            marginVertical: 10,
            borderRadius: 10,
          }}
        >
          <View style={styles.headerContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{firstLetterName}</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                placeholder="Search student..."
                placeholderTextColor="#777"
                value={searchText}
                onChangeText={(text) => {
                  setSearchText(text);
                  setShowResults(text.trim() !== "");
                }}
              />
              <TouchableOpacity onPress={handleSearch}>
                <Ionicons name="search" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            {/* 📣 Announcement Button */}
            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              onPress={() => setShowAnnouncementModal(true)}
            >
              <FontAwesome5 name="bullhorn" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* 🔍 Dropdown Search Results */}
          {showResults && filteredStudents.length > 0 && (
            <View style={styles.resultsContainer}>
              <FlatList
                data={filteredStudents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => handleSelectStudent(item)}
                  >
                    {renderHighlightedText(item.studentName)}
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Student Search Container */}
          <View
            style={{
              margin: 10,
              backgroundColor: COLORS.Third,
              borderRadius: 10,
              padding: 8,
            }}
          >
            {searchStudentData && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: COLORS.textColorWhite,
                  borderRadius: 10,
                  padding: 10,
                  elevation: 2,
                }}
                onPress={() => {
                  setShowPromoteArea(true);
                }}
              >
                {/* Avatar */}
                <View
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 25,
                    backgroundColor: COLORS.Primary,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {searchStudentData.studentName?.charAt(0).toUpperCase()}
                  </Text>
                </View>

                {/* Student Info */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 16, fontWeight: "600", color: "black" }}
                  >
                    {searchStudentData.studentName}
                  </Text>
                  <Text style={{ fontSize: 14, color: "gray" }}>
                    {searchStudentData.studentNumber}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/*current officer container */}

          <Animated.FlatList
            data={currentOfficer} // replace with your state or array of Student objects
            keyExtractor={(item) =>
              item.id?.toString() || Math.random().toString()
            }
            renderItem={({ item }: { item: Student }) => {
              const firstLetter =
                item.studentName?.charAt(0).toUpperCase() || "?";
              const isOfficer = item.category?.toLowerCase() === "officer";

              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    marginBottom: 10,
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 2,
                  }}
                >
                  {/* Avatar */}
                  <View
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                      backgroundColor: "#2D9CDB",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 20,
                        fontWeight: "700",
                      }}
                    >
                      {firstLetter}
                    </Text>
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: "#222",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      {item.studentName}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: "#7B8A9A",
                        fontSize: 13,
                        marginTop: 2,
                      }}
                    >
                      {item.studentNumber ?? ""}{" "}
                      {item.course ? `• ${item.course}` : ""}
                    </Text>
                  </View>

                  {/* Right icons */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 8,
                    }}
                  >
                    {isOfficer ? (
                      <FontAwesome5
                        name="user-shield"
                        size={18}
                        color="#2D9CDB"
                      />
                    ) : (
                      <Ionicons
                        name="person-circle-outline"
                        size={22}
                        color="#7B8A9A"
                      />
                    )}
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#7B8A9A"
                      style={{ marginLeft: 10 }}
                    />
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          {/* 📢 Announcement Modal */}
          <Modal
            visible={showAnnouncementModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowAnnouncementModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalHeader}>📢 Send Announcement</Text>

                <TextInput
                  style={styles.modalInput}
                  placeholder="Title"
                  value={announcementTitle}
                  onChangeText={setAnnouncementTitle}
                />

                <TextInput
                  style={[
                    styles.modalInput,
                    { height: 100, textAlignVertical: "top" },
                  ]}
                  placeholder="Message"
                  multiline
                  value={announcementMessage}
                  onChangeText={setAnnouncementMessage}
                />

                <View style={styles.modalButtons}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowAnnouncementModal(false)}
                  />
                  <Button title="Send" onPress={onSendAnnouncementPress} />
                </View>
              </View>
            </View>
          </Modal>

          {/* 🔄 Loading Modal */}
          <Modal visible={loading} transparent animationType="fade">
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.6)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  padding: 20,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    marginTop: 10,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Sending Announcement...
                </Text>
              </View>
            </View>
          </Modal>

          {/*  search Loading Modal */}
          <Modal visible={searchLoading} transparent animationType="fade">
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.6)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  padding: 20,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="large" color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    marginTop: 10,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Searching...
                </Text>
              </View>
            </View>
          </Modal>

          {/* show modal search the promote  */}
          <Modal visible={showPromoteArea} transparent animationType="fade">
            <View
              style={{
                flex: 1,
                backgroundColor: "black",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.Forth,
                  padding: 20,
                  borderRadius: 10,
                  alignItems: "center",
                  marginHorizontal: 10,
                }}
              >
                <Text style={{ textAlign: "center", fontSize: 19 }}>
                  {`Are you sure to promote this student?name: ${searchStudentData?.studentName}`}{" "}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setShowPromoteArea(false);
                    handlePromote();
                  }}
                  style={{
                    backgroundColor: "green",
                    marginVertical: 10,
                    borderRadius: 6,
                  }}
                >
                  <Text
                    style={{
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    Promote
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowPromoteArea(false)}
                  style={{ borderRadius: 6, backgroundColor: "red" }}
                >
                  <Text
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "white",
                    }}
                  >
                    cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Loading visible={promotionStatus} />
          <Mymodal
            visible={isPromoted}
            message="Student Promoted"
            onClose={() => {
              setIsPromoted(false);
            }}
          />

          {/* end of class */}
        </View>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default OsaScreen;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
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
  resultsContainer: {
    position: "absolute",
    top: 70,
    left: 70,
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
});
