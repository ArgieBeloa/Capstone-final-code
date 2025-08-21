import React, { createContext, useContext, useState } from "react";

interface StudentRecentEvaluations {
  eventId: string;
  eventTitle: string;
  studentRatingsGive: number;
  studentDateRated: string;
}
interface StudentEventAttended {
  eventId: string;
  eventTitle: string;
  studentDateAttended: string;
}
type StudentData = {
  id: string;
  studentName: string;
  studentPassword: string;
  course: string;
  department: string;
  notificationId: string;
  studentAverageAttendance: number;
  studentUpcomingEvents: StudentUpcomingEvents[];

  studentAverageRatings: number;

  studentEventAttended: StudentEventAttended[];
  studentRecantEvaluations: StudentRecentEvaluations[];
};

interface EventAgendas {
  agendaTime: string;
  agendaTitle: string;
  agendaHost: string;
}

interface EventStats {
  attending: number;
  interested: number;
}
interface EventOrganizer {
  organizerName: string;
  organizerEmail: string;
}

interface EventEvaluationDetails {
  evaluationQuestion: string;
  studentRate: number;
  studentSuggestion: string;
}
interface EventPerformanceDetails {
  numberOfStudent: number;
  numberOfStudentGive: number;
}
interface StudentUpcomingEvents {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  numberOfStudentAttending: number;
}

type EventData = {
  id: string;
  eventTitle: string;
  eventShortDescription: string;
  eventBody: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventCategory: string;
  eventTimeLength: string;
  eventAgendas: EventAgendas[];
  eventStats: EventStats;
  eventOrganizer: EventOrganizer;
  studentUpcomingEvents: StudentUpcomingEvents[];
  eventEvaluationDetails: EventEvaluationDetails[];
  eventPerformanceDetails: EventPerformanceDetails[];
  allStudentAttending: number;
};

// Types
type UserContextType = {
  // studentNumber
  studentNumber: string;
  setStudentNumber: (studentNumber: string) => void;
  // student data
  studentData: StudentData | any;
  setStudentData: (studentData: StudentData) => void;

  // events data
  eventData: EventData | any;
  setEventData: (eventData: EventData) => void;

  studentToken: string;
  setStudentToken: (token: string) => void;
};

// Create Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [studentNumber, setStudentNumber] = useState("");
  const [studentData, setStudentData] = useState<any>(null);
  const [eventData, setEventData] = useState<EventData>();

  const [studentToken, setStudentToken] = useState<string>("no token");

  return (
    <UserContext.Provider
      value={{
        studentNumber,
        setStudentNumber,
        studentData,
        setStudentData,
        eventData,
        setEventData,
        studentToken,
        setStudentToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
};