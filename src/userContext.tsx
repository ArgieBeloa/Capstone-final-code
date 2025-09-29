import { Event, Student } from "@/app/Oop/Types";
import React, { createContext, useContext, useState } from "react";
// Types
type UserContextType = {
  // studentNumber
  studentNumber: string;
  setStudentNumber: (studentNumber: string) => void;
  // student data
  studentData: Student | any;
  setStudentData: (studentData: Student) => void;

  // events data
  eventData: Event | any;
  setEventData: (eventData: Event) => void;

  studentToken: string;
  setStudentToken: (token: string) => void;
};

// Create Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [studentNumber, setStudentNumber] = useState("");
  const [studentData, setStudentData] = useState<any>(null);
  const [eventData, setEventData] = useState<Event>();

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