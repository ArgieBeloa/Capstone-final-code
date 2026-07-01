import { getAllStudents } from "@/api/admin/controller";
import { StudentModel } from "@/api/students/model";
import { StudentEventAttendedAndEvaluationDetails } from "@/api/students/utils";
import Styles from "@/app/osa/styles/globalCss";
import studentStyles from "@/app/osa/styles/students.styles";
import LinearbackGround from "@/components/LinearBackGround";
import LinearProgressBar from "@/components/LinearProgressBar";
import { COLORS } from "@/constants/ColorCpc";
import { useUser } from "@/src/userContext";
import {
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated2 from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const Students = () => {
  const { studentToken, eventData } = useUser();
  const officerName = "OSA Officer";
  const firstLetterName = officerName.charAt(0).toUpperCase();

  const [studentsData, setStudentsData] = useState<StudentModel[]>([]);
  const [allStudents, setAllStudents] = useState<StudentModel[]>([]); // ✅ Keep all students for reset
  const [searchText, setSearchText] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<StudentModel[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<
    StudentEventAttendedAndEvaluationDetails[]
  >([]);
  const [student, setStudent] = useState<StudentModel>();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = (id: string) => {
    const student = allStudents.find((student) => student.id === id);
    // if(!student?.studentEventAttendedAndEvaluationDetails.length){

    // }
    setSelectedStudent(student?.studentEventAttendedAndEvaluationDetails || []);
    setStudent(student);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedStudent([]);
  };

  const numberOfEvents: number = 1;

  // 🔹 Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  const animateList = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 🔹 Fetch all students
  useFocusEffect(
    useCallback(() => {
      const loadStudents = async () => {
        try {
          const data = await getAllStudents(studentToken);
          setStudentsData(data);
          setAllStudents(data);
        } catch (err) {
          console.error("Error loading students:", err);
        }
      };
      loadStudents();
      animateList();
    }, [studentToken]),
  );

  // 🔹 Filter logic for dropdown
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredStudents([]);
      setShowResults(false);
      return;
    }

    const lower = searchText.toLowerCase();
    const filtered = studentsData.filter((student) =>
      student.studentName.toLowerCase().includes(lower),
    );

    // ✅ Only show dropdown if text doesn’t exactly match a student
    if (
      filtered.length > 0 &&
      !filtered.some((s) => s.studentName === searchText)
    ) {
      setFilteredStudents(filtered);
      setShowResults(true);
    } else {
      setFilteredStudents([]);
      setShowResults(false);
    }
  }, [searchText]);

  // 🔹 Search button → filter by name, student number, or id
  const handleSearch = () => {
    setShowResults(false);

    if (searchText.trim() === "") {
      setStudentsData(allStudents);
      return;
    }

    const lower = searchText.toLowerCase();
    const match = allStudents.filter(
      (s) =>
        s.studentName.toLowerCase() === lower ||
        s.studentNumber.toLowerCase() === lower ||
        s.id?.toLowerCase() === lower,
    );

    if (match.length > 0) {
      setStudentsData(match);
    } else {
      setStudentsData([]);
    }
  };

  // 🔹 Reset to full list if search is cleared
  useEffect(() => {
    if (searchText.trim() === "") {
      setStudentsData(allStudents);
    }
  }, [searchText, allStudents]);

  // 🔹 Color logic
  const getColorIcon = (student: StudentModel): string => {
    const attended = student.studentEventAttended.length;
    const evaluatedCount = student.studentEventAttended.filter(
      (e) => e.evaluated,
    ).length;

    if (numberOfEvents === 0) return "gray";
    const attendanceRate = attended / numberOfEvents;
    const evaluationRate = evaluatedCount / numberOfEvents;

    if (attendanceRate === 1 && evaluationRate >= 0.8) return "green";
    else if (attendanceRate >= 0.5) return "orange";
    else return "red";
  };

  // 🔹 Render each student card
  const studentRenderItem = ({ item }: { item: StudentModel }) => (
    <TouchableOpacity onPress={() => handleOpenModal(item.id as string)}>
      <Animated.View
        style={[
          studentStyles.containerItem,
          { opacity: fadeAnim, transform: [{ translateY }] },
        ]}
      >
        {/* Avatar */}
        <View style={studentStyles.avatarStudent}>
          <Text style={studentStyles.avatarText}>
            {item.studentName.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Info */}
        <View style={studentStyles.containerStudentsInfo}>
          <Text style={studentStyles.studentNameText}>
            Name: {item.studentName}
          </Text>
          <Text style={studentStyles.studentCourseText}>
            Course: {item.course}
          </Text>
          <Text style={studentStyles.studentCourseText}>
            #: {item.studentNumber}
          </Text>

          <LinearProgressBar
            value={item.studentEventAttended.length}
            max={numberOfEvents}
            title={"Attendance"}
          />
          <LinearProgressBar
            value={item.studentRecentEvaluations.length}
            max={numberOfEvents}
            title={"Evaluation"}
          />
        </View>

        {/* Status Icon */}
        <View style={studentStyles.studentStatus}>
          <MaterialIcons
            name="sentiment-very-satisfied"
            size={24}
            color={getColorIcon(item)}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <LinearbackGround>
      <SafeAreaView style={[Styles.safeAreaView, { flex: 1 }]}>
        <View style={[Styles.container, { flex: 1 }]}>
          {/* Header */}
          <View style={studentStyles.headerContainer}>
            <View style={studentStyles.avatar}>
              <Text style={studentStyles.avatarText}>{firstLetterName}</Text>
            </View>

            {/* Search Bar */}
            <View style={studentStyles.searchContainer}>
              <TextInput
                style={studentStyles.input}
                placeholder="Search student..."
                placeholderTextColor="#777"
                value={searchText}
                onChangeText={setSearchText}
              />
              <TouchableOpacity onPress={handleSearch}>
                <Ionicons name="search" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            {/* Announcement */}
            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              onPress={() => setShowAnnouncementModal(true)}
            >
              <FontAwesome5 name="bullhorn" size={18} color="black" />
            </TouchableOpacity>

            {/* Add */}
            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              onPress={() => {
                router.push("../../addStudentbyAdmin/register");
              }}
            >
              <FontAwesome5 name="plus" size={18} color="black" />
            </TouchableOpacity>
          </View>

          {/* Search Dropdown */}
          {showResults && filteredStudents.length > 0 && (
            <View style={Styles.resultsContainer}>
              <FlatList
                data={filteredStudents}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={Styles.resultItem}
                    onPress={() => {
                      setSearchText(item.studentName);
                      setShowResults(false);
                      setFilteredStudents([]);
                      // ✅ Filter main list to this student
                      setStudentsData([item]);
                    }}
                  >
                    <Text style={Styles.resultText}>{item.studentName}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Title */}
          <Text style={Styles.title}>All Students</Text>

          {/* Student List */}
          {studentsData.length > 0 ? (
            <FlatList
              data={studentsData}
              keyExtractor={(item: any) => item.id}
              renderItem={studentRenderItem}
              contentContainerStyle={[
                studentStyles.containerFlatlist,
                { paddingBottom: 100 },
              ]}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No students found.
            </Text>
          )}
        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.sectionTitle}>
                Event Attended & Evaluated
              </Text>
              <View style={{ flexDirection: "column", marginVertical: 10 }}>
                <Text
                  style={styles.sectionTitle}
                >{`Event Attended ${student?.studentEventAttended.length}/${eventData.length}`}</Text>
                <Text style={styles.sectionTitle}>{`Event Evaluated ${
                  student?.studentEventAttended.filter(
                    (event) => event.evaluated === true,
                  ).length
                }/${eventData.length}`}</Text>
                {/* <Text style={styles.sectionTitle}>Overall Percentage</Text> */}
                <Text style={styles.sectionTitle}>
                  {`Attendance: ${
                    (student?.studentEventAttended?.length ?? 0) !== 0
                      ? `${Math.round(
                          ((student?.studentEventAttended?.length ?? 0) /
                            eventData.length) *
                            100,
                        )}%`
                      : "0%"
                  }`}
                </Text>
                <Text style={styles.sectionTitle}>
                  {`Evaluated: ${
                    (student?.studentEventAttended?.length ?? 0) !== 0
                      ? `${Math.round(
                          ((student?.studentEventAttended.filter(
                            (event) => event.evaluated === true,
                          ).length ?? 0) /
                            eventData.length) *
                            100,
                        )}%`
                      : "0%"
                  }`}
                </Text>
              </View>

              {selectedStudent.length !== 0 ? (
                <Animated2.FlatList
                  data={selectedStudent}
                  keyExtractor={(item) => item.eventId}
                  style={{ flex: 1 }}
                  showsVerticalScrollIndicator
                  renderItem={({ item }) => (
                    <Animated.View style={styles.eventCard}>
                      <View>
                        <Text style={styles.eventText}>{item.eventTitle}</Text>
                        <Text style={styles.eventText}>
                          {item.eventDateAndTime}
                        </Text>
                      </View>

                      <View
                        style={{
                          justifyContent: "center",
                          flexDirection: "row",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        {item.attended ? (
                          <Entypo name="check" size={24} color="green" />
                        ) : (
                          <Entypo name="cycle" size={24} color="orange" />
                        )}
                        <Text style={styles.statusText}>
                          {" "}
                          {item.attended ? "Attended" : "Pending"}
                        </Text>

                        {item.evaluated ? (
                          <Entypo name="check" size={24} color="green" />
                        ) : (
                          <Entypo name="cross" size={24} color="red" />
                        )}
                        <Text style={styles.statusText}>Evaluated</Text>
                      </View>
                    </Animated.View>
                  )}
                />
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text>No events available!</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={handleCloseModal}
                style={{
                  backgroundColor: "#007AFF",
                  padding: 12,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Students;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Forth,
    marginHorizontal: "auto",
    marginVertical: 10,
    padding: 10,
    width: "95%",
    maxWidth: 600,
    borderRadius: 7,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  avatarArea: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: { color: "white", fontSize: 20, fontWeight: "bold" },
  studentInfo: { marginVertical: 5 },
  infoText: { fontWeight: "500", marginBottom: 2 },
  circleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  textWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  ratingText: {
    color: COLORS.TextColor,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 7,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eventText: { fontWeight: "500", fontSize: 13 },
  statusText: { fontSize: 10, fontWeight: "500", marginHorizontal: 4 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 20,
  },
  modalBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    minWidth: 250,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
