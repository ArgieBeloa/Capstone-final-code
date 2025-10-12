import HeaderOfficer from "@/components/HeaderOfficer";
import LinearbackGround from "@/components/LinearBackGround";
import OfficerDisplayEvents from "@/components/OfficerDisplayEvents";
import { COLORS } from "@/constants/ColorCpc";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event } from "./Oop/Types";

const TestDesign = () => {
  const exampleEventData: Event[] = [
    {
      id: "1",
      eventTitle: "PSIT Day",
      eventShortDescription: "A fun celebration of IT excellence!",
      eventBody: "Join us for PSIT Day 2025 with seminars and competitions.",
      allStudentAttending: 10,
      eventDate: "2025-10-15",
      eventTime: "09:00 AM",
      eventLocation: "Main Auditorium",
      eventCategory: "Academic",
      eventTimeLength: "4 hours",
      eventAgendas: [
        {
          agendaTime: "09:00 AM",
          agendaTitle: "Opening Ceremony",
          agendaHost: "Dean of IT",
        },
        {
          agendaTime: "10:00 AM",
          agendaTitle: "Coding Challenge",
          agendaHost: "Prof. Rivera",
        },
      ],
      eventStats: { attending: 120, interested: 60 },
      eventOrganizer: {
        organizerName: "CPC IT Department",
        organizerEmail: "it@cpc.edu.ph",
      },
      eventEvaluationDetails: null,
      evaluationQuestions: null,
      eventPerformanceDetails: null,
      eventAttendance: [
        {
          id: "123",
          studentName: "argie",
          timeAttended: "October 9, 2025",
        },
      ],
      eventStudentEvaluations: null,
      eventAveragePerformance: 4.5,
    },
  ];

  return (
    <LinearbackGround>
      <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
        <View
          style={{
            // flex: 1,
            alignItems: "center",
            width: "95%",
            backgroundColor: COLORS.Forth,
            margin: 10,
            borderRadius: 10,
          }}
        >
          {/* Header */}

          <View style={{ zIndex: 10, width: "100%" }}>
            <HeaderOfficer
              officerName={"Aires"}
              eventSuggestionData={[
                { eventId: "1", eventTitle: "PSIT DAY" },
                { eventId: "2", eventTitle: "Season Of Creation" },
                { eventId: "3", eventTitle: "Enrollment Hub" },
              ]}
            />
          </View>

          {/* Put this below header so dropdown can appear above */}
          <View style={{ flex: 1, zIndex: 0, width: "100%" }}>
            <Text style={styles.subTitleText}>Latest Events</Text>
            <OfficerDisplayEvents events={exampleEventData} />
          </View>
        </View>
      </SafeAreaView>
    </LinearbackGround>
  );
};

export default TestDesign;

const styles = StyleSheet.create({
  subTitleText: {
    marginTop: 10,
    marginLeft: 10,
    fontWeight: 700,
    fontSize: 20,
  },
});
