import { EventModel } from "@/api/events/model";
import { StudentModel } from "@/api/students/model";
import React, { createContext, useContext, useState } from "react";
// Types
type UserContextType = {
  //userId
  userId: string;
  setUserId: (userId: string)  => void;

  // studentNumber
  studentNumber: string;
  setStudentNumber: (studentNumber: string) => void;
  // student data
  studentData: StudentModel;
  setStudentData: (studentData: StudentModel) => void;

  // events data
  eventData: EventModel[];
  setEventData: (eventData: EventModel[]) => void;

  studentToken: string;
  setStudentToken: (token: string) => void;
};

// Create Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [studentNumber, setStudentNumber] = useState("");
  const [userId, setUserId] = useState("");
  const [studentData, setStudentData] = useState<StudentModel | any>();
  const [eventData, setEventData] = useState<EventModel[]| any>();

  const [studentToken, setStudentToken] = useState<string>("no token");

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
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