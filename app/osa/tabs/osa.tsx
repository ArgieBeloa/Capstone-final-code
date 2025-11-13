import {
  getAllStudents,
  promoteStudent,
  sendExpoNotification,
} from "@/api/admin/controller";
import { StudentModel } from "@/api/students/model";
import LinearbackGround from "@/components/LinearBackGround";
import Loading from "@/components/Loading";
import Mymodal from "@/components/Mymodal";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Styles from "../styles/globalCss";

interface StudentSuggestionData {
  id: string;
  studentName: string;
  studentNumber: string;
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

  const [searchStudentData, setSearchStudentData] = useState<
    StudentModel | undefined
  >();
  const [currentOfficer, setCurrentOfficer] = useState<StudentModel[]>([]);
  const [studentNumber, setStudentNumber] = useState("");

  const [allTokens, setAllTokens] = useState<{ notificationId: string }[]>([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingSendNotification, setLoadingSendNotification] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [promotionStatus, setPromotionStatus] = useState(false);
  const [showPromoteArea, setShowPromoteArea] = useState(false);
  const [isPromoted, setIsPromoted] = useState(false);

  // 🧠 Load all students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const students = await getAllStudents(studentToken);

        const onlyOfficers = students.filter(
          (item: StudentModel) => item.role?.toLowerCase() === "officer"
        );
        setCurrentOfficer(onlyOfficers);

        const studentNameAndId: any = students.map((s: StudentModel) => ({
          id: s.id,
          studentName: s.studentName,
          studentNumber: s.studentNumber,
        }));
        setStudentSuggestionData(studentNameAndId);

        const notificationIds = students
          .filter((s) => !!s.notificationId)
          .map((student) => ({
            notificationId: student.notificationId,
          }));

        setAllTokens(notificationIds);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  // 🔍 Filter students when typing
  useEffect(() => {
    if (searchText.trim() === "") {
      setShowResults(false);
      return;
    }

    const lower = searchText.toLowerCase();
    const filtered = studentSuggestionData.filter((item) =>
      item.studentName.toLowerCase().includes(lower)
    );
    setFilteredStudents(filtered);
    setShowResults(true);
  }, [searchText, studentSuggestionData]);

  // ✅ Select student
  const handleSelectStudent = (item: StudentSuggestionData) => {
    setSearchStudentId(item.id);
    setSearchText(item.studentName);
    setStudentNumber(item.studentNumber);
    console.log(item.id);

    // 🧠 Delay closing dropdown slightly so touch event completes first
    setTimeout(() => {
      setShowResults(false);
    }, 20);
  };

  // ✅ Search student manually
  const handleSearchIcon = async () => {
    if (!studentNumber) {
      Alert.alert("⚠️", "Please select a student first before searching.");
      return;
    }

    setSearchLoading(true);
    try {
      const students = await getAllStudents(studentToken);

      const student = students.find((s) => s.id === searchStudentId);
      setSearchStudentData(student);

      console.log("Searched student:", student);
    } catch (error) {
      console.error("Error fetching student:", error);
      Alert.alert("❌ Error", "Unable to fetch student details.");
    } finally {
      setSearchLoading(false);
    }
  };

  // 🔼 Promote selected student
  const handlePromote = async () => {
    setShowPromoteArea(false);
    setPromotionStatus(true);
    setSearchLoading(true);
    try {
      await promoteStudent(studentToken, searchStudentId);

      setIsPromoted(true);

      Alert.alert("Success 🎉", "Student has been successfully promoted!", [
        { text: "OK" },
      ]);
    } catch (error: any) {
      console.error(
        "❌ Error promoting student:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error ❌",
        `Failed to promote student.\n${
          error.response?.data?.message || error.message
        }`,
        [{ text: "OK" }]
      );
    } finally {
      setSearchLoading(false);
      setPromotionStatus(false);
    }
  };

  // 📢 Send announcement to all
  const handleSendAnnouncement = async (title: string, message: string) => {
    if (!title.trim() || !message.trim()) {
      Alert.alert("Missing fields", "Please fill out both title and message!");
      return;
    }

    try {
      setLoading(true);

      const extactAllTokens: string[] = allTokens.map(
        (item) => item.notificationId
      );

      console.log(extactAllTokens);
      await sendExpoNotification(studentToken, {
        tokens: extactAllTokens,
        title,
        body: message,
      });
     
      setAnnouncementTitle("")
      setAnnouncementMessage("")

      Alert.alert("✅ Success", "Announcement sent successfully!");
    } catch (error: any) {
      console.error("❌ Error sending announcement:", error);
      Alert.alert("Error", "Failed to send announcement!");
    } finally {
      setLoading(false);
    }
  };
  // ✨ Highlight match text in dropdown
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

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          {/* Header */}
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
                onChangeText={(text) => setSearchText(text)}
              />
              <TouchableOpacity onPress={handleSearchIcon}>
                <Ionicons name="search" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            {/* Announcement Button */}
            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              onPress={() => setShowAnnouncementModal(true)}
            >
              <FontAwesome5 name="bullhorn" size={18} color="black" />
            </TouchableOpacity>
          </View>

          {/* Search Results Dropdown */}
          {showResults && filteredStudents.length > 0 && (
            <View style={StyleSheet.absoluteFillObject}>
              {/* Transparent overlay to close suggestions */}
              <Pressable
                style={styles.overlay}
                onPress={() => setShowResults(false)}
              />

              {/* Suggestions dropdown */}
              <View style={styles.resultsContainer}>
                <FlatList
                  keyboardShouldPersistTaps="handled"
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
            </View>
          )}

          {/* Selected Student Card */}
          <View style={styles.selectedStudentContainer}>
            {searchStudentData && (
              <TouchableOpacity
                style={styles.selectedStudentCard}
                onPress={() => setShowPromoteArea(true)}
              >
                <View style={styles.studentAvatar}>
                  <Text style={styles.studentAvatarText}>
                    {searchStudentData.studentName?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.studentName}>
                    {searchStudentData.studentName}
                  </Text>
                  <Text style={styles.studentNumber}>
                    {searchStudentData.studentNumber}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* 🆙 Promote Area */}
          {showPromoteArea && (
            <View style={styles.promoteContainer}>
              <Text style={styles.promoteTitle}>
                Promote this student to Officer?
              </Text>
              <View style={styles.promoteButtons}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: COLORS.Primary }]}
                  onPress={handlePromote}
                >
                  <Text style={styles.buttonText}>Yes, Promote</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: COLORS.Secondary }]}
                  onPress={() => setShowPromoteArea(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Officer List */}
          <Text style={styles.currentOfficerText}>Current Officers</Text>

          <Animated.FlatList
            data={currentOfficer}
            keyExtractor={(item) =>
              item.id?.toString() || Math.random().toString()
            }
            renderItem={({ item }: { item: StudentModel }) => {
              const firstLetter =
                item.studentName?.charAt(0).toUpperCase() || "?";
              const isOfficer = item.role?.toLowerCase() === "officer";
              return (
                <TouchableOpacity style={styles.officerItem}>
                  <View style={styles.officerAvatar}>
                    <Text style={styles.officerAvatarText}>{firstLetter}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.officerName}>{item.studentName}</Text>
                    <Text style={styles.officerDetails}>
                      {item.studentNumber ?? ""}{" "}
                      {item.course ? `• ${item.course}` : ""}
                    </Text>
                  </View>
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
                </TouchableOpacity>
              );
            }}
          />

          {/* Modals */}
          <Loading visible={promotionStatus || loading || searchLoading} />
          <Mymodal
            redirectPath="osa/osa"
            visible={isPromoted}
            message="Student Promoted"
            onClose={() => setIsPromoted(false)}
          />

          {/* announcement modal */}
          {/* 📢 Announcement Modal */}
          <Modal
            visible={showAnnouncementModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowAnnouncementModal(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  width: "85%",
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  padding: 20,
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    marginBottom: 15,
                    color: COLORS.Primary,
                  }}
                >
                  📢 Send Announcement
                </Text>

                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    padding: 10,
                    marginBottom: 10,
                  }}
                  placeholder="Title"
                  value={announcementTitle}
                  onChangeText={setAnnouncementTitle}
                />

                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    padding: 10,
                    height: 100,
                    textAlignVertical: "top",
                    marginBottom: 10,
                  }}
                  placeholder="Message"
                  multiline
                  value={announcementMessage}
                  onChangeText={setAnnouncementMessage}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setShowAnnouncementModal(false)}
                    style={{
                      flex: 1,
                      backgroundColor: "#ddd",
                      paddingVertical: 10,
                      borderRadius: 8,
                      marginRight: 5,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#333", fontWeight: "600" }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={loadingSendNotification}
                    onPress={() =>
                      handleSendAnnouncement(
                        announcementTitle,
                        announcementMessage
                      )
                    }
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.Primary,
                      paddingVertical: 10,
                      borderRadius: 8,
                      marginLeft: 5,
                      alignItems: "center",
                    }}
                  >
                    {loading ? (
                      <>
                        <ActivityIndicator
                          size="small"
                          color="#fff"
                          style={{ marginRight: 8 }}
                        />
                        <Text style={{ color: "#fff", fontWeight: "600" }}>
                          Sending...
                        </Text>
                      </>
                    ) : (
                      <Text style={{ color: "#fff", fontWeight: "600" }}>
                        Send
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {loading && (
              <View style={Styles.loadingOverlay}>
                <View style={Styles.loadingBox}>
                  <ActivityIndicator size="large" color={COLORS.Primary} />
                  <Text style={Styles.loadingText}>
                    Sending announcement...
                  </Text>
                </View>
              </View>
            )}
          </Modal>
        </View>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default OsaScreen;

// 🎨 Styles
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: COLORS.Forth,
    width: "95%",
    marginHorizontal: "auto",
    marginVertical: 10,
    borderRadius: 10,
    paddingBottom: 10,
  },
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
  avatarText: { fontWeight: "600", color: "white", fontSize: 18 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e2e2ff",
    borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1,
    marginLeft: 10,
  },
  input: { flex: 1, height: 40, color: "#000" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 999,
  },
  resultsContainer: {
    position: "absolute",
    top: 75,
    left: 10,
    right: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 1000,
    elevation: 10,
    maxHeight: 200,
    borderRadius: 8,
  },
  resultItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  resultText: { fontSize: 16, color: "#333" },
  highlight: { color: "#007bff", fontWeight: "700" },
  selectedStudentContainer: {
    margin: 10,
    backgroundColor: COLORS.Third,
    borderRadius: 10,
    padding: 8,
  },
  selectedStudentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.textColorWhite,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  currentOfficerText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 700,
  },
  studentAvatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: COLORS.Primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  studentAvatarText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  studentName: { fontSize: 16, fontWeight: "600", color: "black" },
  studentNumber: { fontSize: 14, color: "gray" },

  promoteContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  promoteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 10,
  },
  promoteButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  officerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  officerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2D9CDB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  officerAvatarText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  officerName: { color: "#222", fontSize: 16, fontWeight: "600" },
  officerDetails: { color: "#7B8A9A", fontSize: 13, marginTop: 2 },
});
