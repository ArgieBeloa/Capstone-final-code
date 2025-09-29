import axios from "axios";

import { BASE_URL } from "./spring";

// parameter import
import { EventAttendance, EventEvaluationDetail } from "@/app/Oop/Types";

// GET
export const getEventById = async (token: string, id: any) => {
  try {
    const api = `${BASE_URL}/events/id/${id}`;

    const event = await axios.get(api, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return event.data;
  } catch (error) {
    console.log(error);
  }
};

// POST
export interface EventEvaluation {
  studentName: string;
  studentAverageRate: number;
  studentSuggestion: string;
  studentEvaluationInfos: EventEvaluationDetail[];
}

export const addEventEvaluation = async (
  token: string,
  eventId: string,
  evaluationData: EventEvaluation
) => {
  try {
    const api = `${BASE_URL}/events/${eventId}/eventEvaluationDetails`;

    // backend expects [ { ... } ]
    const response = await axios.post(api, [evaluationData], {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error submitting evaluation:", error.response || error);
    throw error;
  }
};


export const addStudentToEventAttendance = async (
  id: string,
  token: string,
  newAttendance: EventAttendance[]
) => {
  const api = `${BASE_URL}/events/${id}/addEventAttendance`;
  try {
    const eventAttendance = await axios.post(api, newAttendance, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return eventAttendance.data;
  } catch (error) {
    console.log(error);
  }
};

// DELETE

// Delete attendance by studentNumber + eventId
export const deleteStudentAttendance = async (
  token: string,
  studentNumber: string,
  eventId: string
) => {
  try {
    const url = `${BASE_URL}/students/${studentNumber}/delete/studentAttendance/${eventId}`;

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // success response from backend
  } catch (error: any) {
    console.error("Error deleting student attendance:", error.response?.data || error.message);
    throw error;
  }
};


// http://localhost:8080/api/students/20250001/delete/studentNotification/evt101
