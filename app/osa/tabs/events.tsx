import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EventModel } from "@/api/events/model";
import LinearbackGround from "@/components/LinearBackGround";
import { useUser } from "@/src/userContext";
import { useFocusEffect, useRouter } from "expo-router";
import eventStyles from "../styles/events.styles";
import Styles from "../styles/globalCss";
const Events = () => {
  const { studentToken } = useUser();
  const router = useRouter();
  const officerName = "OSA Officer";
  const firstLetterName = officerName.charAt(0).toUpperCase();

  const [searchText, setSearchText] = useState("");
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // trigger events
  const handlePrintAttendance = (id: string) => {
    router.push(`../../PrintAttendances/${id}`);
  };
  const handlePrint = async (id: string) => {
    router.push(`../../PrintFolder/${id}`);
  };

  useFocusEffect(
    useCallback(() => {
      const loadEvents = async () => {};

      loadEvents();
    }, [])
  );

  // 🔹 Example Data
  const exampleData: EventModel[] = [
    {
      id: "1",
      whoPostedName: "Aries",
      eventTitle: "CPC Donation Drive",
      eventShortDescription: "Help the community through donations.",
      eventBody: "Join us in our CPC Donation Drive to support those in need.",
      allStudentAttending: 120,
      eventDate: "2025-10-28",
      eventTime: "8:00 AM",
      eventTimeLength: "8:00 AM - 5:00 PM",
      eventLocation: "Auditorium",
      eventCategory: "Community",
      eventOrganizer: { organizerName: "OSA", organizerEmail: "osa@cpc.edu" },
      eventAttendances: [],
      eventAgendas: [],
      evaluationQuestions: [],
      eventEvaluationDetails: [],
    },
    {
      id: "2",
      whoPostedName: "Aries",
      eventTitle: "Wellness Seminar",
      eventShortDescription: "Promoting mental and physical health.",
      eventBody: "Attend our seminar with experts from the health sector.",
      allStudentAttending: 80,
      eventDate: "2025-11-05",
      eventTime: "9:00 AM",
      eventTimeLength: "9:00 AM - 4:00 PM",
      eventLocation: "Hall A",
      eventCategory: "Health",
      eventOrganizer: { organizerName: "OSA", organizerEmail: "osa@cpc.edu" },
      eventAttendances: [],
      eventAgendas: [],
      evaluationQuestions: [],
      eventEvaluationDetails: [],
    },
    {
      id: "3",
      whoPostedName: "Aries",
      eventTitle: "Leadership Training",
      eventShortDescription: "Empower your leadership skills.",
      eventBody: "A training program for future leaders of CPC.",
      allStudentAttending: 95,
      eventDate: "2025-11-10",
      eventTime: "8:30 AM",
      eventTimeLength: "8:30 AM - 5:00 PM",
      eventLocation: "Main Hall",
      eventCategory: "Training",
      eventOrganizer: { organizerName: "OSA", organizerEmail: "osa@cpc.edu" },
      eventAttendances: [],
      eventAgendas: [],
      evaluationQuestions: [],
      eventEvaluationDetails: [],
    },
  ];

  // 🔹 Platform-specific icon for mobile/web
  const platformIcon = Platform.OS === "web" ? "print" : "save";

  // 🔹 Render each event card
  const renderAllEvents = ({ item }: { item: EventModel }) => (
    <View style={eventStyles.containerItem}>
      <Image
        source={require("@/assets/images/auditorium.jpg")}
        style={eventStyles.image}
        resizeMode="cover"
      />
      <View style={{ padding: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18, color: "#222" }}>
          {item.eventTitle}
        </Text>
        <Text style={{ fontSize: 14, color: "#555" }}>
          {item.eventShortDescription}
        </Text>
        <Text style={{ fontSize: 12, color: "#777", marginTop: 4 }}>
          {item.eventDate} • {item.eventTimeLength}
        </Text>
        <Text style={{ marginTop: 4 }}>Posted By: {item.whoPostedName}</Text>

        {/* 🔹 Buttons Row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          {/* Attendance — unchanged */}
          <Pressable
            style={eventStyles.iconButton}
            onPress={() => handlePrintAttendance(item.id)}
          >
            <FontAwesome5 name={platformIcon} size={18} color="#000" />
            <Text style={eventStyles.iconText}>Attendance</Text>
          </Pressable>

          {/* Evaluation */}
          <Pressable
            style={eventStyles.iconButton}
            onPress={() => handlePrint(item.id)}
          >
            <FontAwesome5 name={platformIcon} size={18} color="#000" />
            <Text style={eventStyles.iconText}>Evaluation</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <LinearbackGround>
      <SafeAreaView style={[Styles.safeAreaView, { flex: 1 }]}>
        <View style={[Styles.container, { flex: 1 }]}>
          {/* 🔹 Header */}
          <View style={eventStyles.headerContainer}>
            <View style={eventStyles.avatar}>
              <Text style={eventStyles.avatarText}>{firstLetterName}</Text>
            </View>

            <View style={eventStyles.searchContainer}>
              <TextInput
                style={eventStyles.input}
                placeholder="Search events..."
                placeholderTextColor="#777"
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
              />
              <TouchableOpacity>
                <Ionicons name="search" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{ marginHorizontal: 10 }}
              onPress={() => setShowAnnouncementModal(true)}
            >
              <FontAwesome5 name="bullhorn" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* 🔹 All Events */}
          <Text style={Styles.title}>All Events</Text>

          {/* ✅ Scrollable FlatList */}
          <FlatList
            data={exampleData}
            keyExtractor={(item) => item.id}
            renderItem={renderAllEvents}
            contentContainerStyle={[
              eventStyles.containerFlatlist,
              { paddingBottom: 100 },
            ]}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default Events;
