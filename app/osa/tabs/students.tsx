import { StudentModel } from "@/api/students/model";
import LinearbackGround from "@/components/LinearBackGround";
import LinearProgressBar from "@/components/LinearProgressBar";
import { useUser } from "@/src/userContext";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
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
  const { studentToken, eventData } = useUser();
  const router = useRouter();

  const officerName = "OSA Officer";
  const firstLetterName = officerName.charAt(0).toUpperCase();

  const numberOfEvents: number = 1;

  const [searchText, setSearchText] = useState("");
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // 🔹 Animation setup
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  // Animate list appearance
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

  // Example static data
  const studentsData: StudentModel[] = [
    {
      id: "1",
      studentNumber: "2023-001",
      studentPassword: "",
      role: "STUDENT",
      studentName: "John Doe",
      course: "BSCS",
      department: "Computer Science",
      notificationId: "",
      studentUpcomingEvents: [],
      studentEventAttended: [
        {
          eventId: "e1",
          eventTitle: "Orientation",
          studentDateAttended: "2025-10-01",
          evaluated: true,
        },
      ],
      studentRecentEvaluations: [
        {
          eventId: "e1",
          eventTitle: "Orientation",
          studentRatingsGive: 0,
          studentDateRated: "2025-10-01",
        },
      ],
      studentNotifications: [],
      studentEventAttendedAndEvaluationDetails: [],
    },
    {
      id: "2",
      studentNumber: "2023-002",
      studentPassword: "",
      role: "STUDENT",
      studentName: "Jane Smith",
      course: "BSIT",
      department: "Information Technology",
      notificationId: "",
      studentUpcomingEvents: [],
      studentEventAttended: [],
      studentRecentEvaluations: [],
      studentNotifications: [],
      studentEventAttendedAndEvaluationDetails: [],
    },
  ];

  // 🔹 Color icon logic
  const getColorIcon = (student: StudentModel): string => {
    const attended = student.studentEventAttended.length;
    const evaluatedCount = student.studentEventAttended.filter(
      (e) => e.evaluated
    ).length;

    if (numberOfEvents === 0) return "gray";

    const attendanceRate = attended / numberOfEvents;
    const evaluationRate = evaluatedCount / numberOfEvents;

    if (attendanceRate === 1 && evaluationRate >= 0.8) {
      return "green"; // Excellent
    } else if (attendanceRate >= 0.5) {
      return "orange"; // Average
    } else {
      return "red"; // Poor
    }
  };

  // 🔹 Render each student
  const studentRenderItem = ({ item }: { item: StudentModel }) => (
    <Animated.View
      style={[
        studentStyles.containerItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      {/* Avatar */}
      <View style={studentStyles.avatarStudent}>
        <Text style={studentStyles.avatarText}>
          {item.studentName.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Student Info */}
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

        {/* Progress Bars */}
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

  // Run animation on focus
  useFocusEffect(
    useCallback(() => {
      animateList();
    }, [])
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

            {/* Search */}
            <View style={studentStyles.searchContainer}>
              <TextInput
                style={studentStyles.input}
                placeholder="Search student..."
                placeholderTextColor="#777"
                value={searchText}
                onChangeText={setSearchText}
              />
              <TouchableOpacity>
                <Ionicons name="search" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            {/* Announcement */}
            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              onPress={() => setShowAnnouncementModal(true)}
            >
              <FontAwesome5 name="bullhorn" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <Text style={Styles.title}>All Students</Text>

          {/* List */}
          {numberOfEvents ? (
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
              Loading students...
            </Text>
          )}
        </View>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Students;
