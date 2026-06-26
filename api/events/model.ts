import {
  EvaluationQuestion,
  EventAgenda,
  EventAttendance,
  EventEvaluationDetails,
  EventOrganizer,
} from "./utils";

// ===============================
// 📦 Event Model Interface (TS version of EventModel.java)
// ===============================
export interface EventModel {
  id: string;

  // 🧑‍💼 Poster / creator info
  whoPostedName?: string; // optional for compatibility

  // 📝 Event Info
  eventTitle: string;
  eventShortDescription: string;
  eventBody: string;
  allStudentAttending: number;
  eventDate: string; // e.g., "2025-11-15"
  eventTime: string; // e.g., "09:00 AM"
  eventTimeLength: string; // e.g., "2 hours"
  evaluationStart: string;
  evaluationEnd: string;
  eventLocation: string;
  eventCategory: string;

  // 🧑‍🎓 Organizer
  eventOrganizer: EventOrganizer;

  // 🧾 Arrays / relations
  eventAttendances: EventAttendance[];
  eventAgendas: EventAgenda[];
  evaluationQuestions: EvaluationQuestion[];
  eventEvaluationDetails: EventEvaluationDetails[];

  // 🖼️ Image fields
  eventImageId?: string; // MongoDB ObjectId of image in GridFS
  eventImageUrl?: string; // Public URL from backend (e.g. https://.../api/events/image/{id})
}
