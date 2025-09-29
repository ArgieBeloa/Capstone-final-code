// src/api/eventApi.ts
import axios from "axios";

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
  eventTitle: string;
  eventShortDescription: string;
  eventBody: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventCategory: string;
  eventTimeLength: string;
  allStudentAttending: number;
  eventAgendas: Agenda[];
  eventStats: {
    attending: number;
    interested: number;
  };
  eventOrganizer: {
    organizerName: string;
    organizerEmail: string;
  };
  evaluationQuestions: EvaluationQuestion[];
  eventEvaluationDetails: any[];
  eventPerformanceDetails: any[];
  eventStudentEvaluations: any[];
  eventAveragePerformance: number;
}

export const addEvent = async (tokenPass: string, eventData: EventPayload) => {
  const token = tokenPass.trim()
  const response = await axios.post(`${BASE_URL}/events/add`, eventData,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
 return response.data
};
