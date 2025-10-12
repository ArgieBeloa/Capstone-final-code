// src/api/eventApi.ts
import axios from "axios";

import { EventAgenda, EventAttendance, EventEvaluationDetail, EventOrganizer, EventPerformanceDetail, EventStats, EventStudentEvaluation } from "@/app/Oop/Types";
import { BASE_URL } from "./spring";
export interface Agenda {
  agendaTime: string;
  agendaTitle: string;
  agendaHost: string;
}

export interface EvaluationQuestion {
  questionId: string;
  questionText: string;
}

export interface EventPayload {
  id?: string;

  // Basic Info
  eventTitle: string;
  eventShortDescription: string;
  eventBody: string;

  // Schedule
  eventDate: string;
  eventTime: string | null;
  eventTimeLength: string | null;
  eventLocation: string;
  eventCategory: string | null;

  // Attendance & Evaluation
  allStudentAttending: number;
  attendanceRate: number | null;
  evaluationAvg: number | null;

  // Event Data
  eventAgendas: EventAgenda[] | null;
  eventStats: EventStats | null;
  eventOrganizer: EventOrganizer | null;
  evaluationQuestions: EvaluationQuestion[] | null;
  eventEvaluationDetails: EventEvaluationDetail[] | null;
  eventPerformanceDetails: EventPerformanceDetail[] | null;
  eventAttendances: EventAttendance[] | null;
  eventStudentEvaluations: EventStudentEvaluation[] | null;
  eventAveragePerformance: number;
}


export const addEvent = async (token: string, eventData: EventPayload) => {
  const response = await axios.post(`${BASE_URL}/events/add`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // if (response.status === 401) {
  //   const text = response.toString();
  //   if (text.includes("Token expired")) {
  //     // ✅ Handle expiration
  //     alert("Session expired, please log in again");
  //   }
  // }

  return response.data;
};
