import {
  EvaluationQuestion,
  EventAgenda,
  EventAttendance,
  EventEvaluationDetails,
  EventOrganizer
} from "./utils";

// Optional: If you have an EventAgenda type, import it too
// import { EventAgenda } from "./eventUtils"; // or wherever it's defined

// ===============================
// 📦 Event Model Interface (TS version of EventModel.java)
// ===============================
export interface EventModel {
  id: string;

  // Info
  eventTitle: string;
  eventShortDescription: string;
  eventBody: string;
  allStudentAttending: number;
  eventDate: string; // ISO 8601 or string
  eventTime: string; // e.g., "09:00 AM"
  eventLocation: string;
  eventCategory: string;
  eventTimeLength: string; // e.g., "2 hours"

  // Organizer
  eventOrganizer: EventOrganizer;

  // Arrays / relations
  eventAttendances: EventAttendance[];
  eventAgendas: EventAgenda[]; // If you have a TS interface for EventAgenda
  evaluationQuestions: EvaluationQuestion[];
  eventEvaluationDetails: EventEvaluationDetails[];
}
