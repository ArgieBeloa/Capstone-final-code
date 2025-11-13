import { getAllStudents } from "@/api/admin/controller";
import { StudentModel } from "@/api/students/model";
import LinearbackGround from "@/components/LinearBackGround";
import LinearProgressBar from "@/components/LinearProgressBar";
import { useUser } from "@/src/userContext";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Styles from "../styles/globalCss";
import studentStyles from "../styles/students.styles";

const Students = () => {
  const { studentToken } = useUser();
  const officerName = "OSA Officer";
  const firstLetterName = officerName.charAt(0).toUpperCase();

  const [studentsData, setStudentsData] = useState<StudentModel[]>([]);
  const [allStudents, setAllStudents] = useState<StudentModel[]>([]); // ✅ Keep all students for reset
  const [searchText, setSearchText] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<StudentModel[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

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
    }, [studentToken])
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
      student.studentName.toLowerCase().includes(lower)
    );

    // ✅ Only show dropdown if text doesn’t exactly match a student
    if (filtered.length > 0 && !filtered.some((s) => s.studentName === searchText)) {
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
        s.id?.toLowerCase() === lower
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
      (e) => e.evaluated
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
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Students;
