export interface EventAgenda {
  agendaTime: string;
  agendaTitle: string;
  agendaHost: string;
}

export interface EventStats {
  attending: number;
  interested: number;
}

export interface EventOrganizer {
  organizerName: string;
  organizerEmail: string;
}

export interface EventEvaluationDetail {
  evaluationQuestion: string | null;
  studentRate: number;
  studentSuggestion: string | null;
}

export interface EventPerformanceDetail {
  numberOfStudent: number;
  numberOfStudentRatedGive: number;
}

export interface Event {
  id: string;
  eventTitle: string;
  eventShortDescription: string;
  eventBody: string;
  allStudentAttending: number;
  eventDate: string;
  eventTime: string | null;
  eventLocation: string;
  eventCategory: string | null;
  eventTimeLength: string | null;
  eventAgendas: EventAgenda[] | null;
  eventStats: EventStats | null;
  eventOrganizer: EventOrganizer | null;
  eventEvaluationDetails: EventEvaluationDetail[] | null;
  eventPerformanceDetails: EventPerformanceDetail[] | null;
  eventAveragePerformance: number;
}
// Student.ts

export interface StudentUpcomingEvents {
  id: string;
  eventName: string;
  eventDate: string; // ISO date string (e.g., "2025-09-04T10:00:00Z")
}

export interface StudentEventAttended {
  id: string;
  eventName: string;
  attendedDate: string; // ISO date string
}

export interface StudentRecentEvaluation {
  id: string;
  evaluatorName: string;
  rating: number;
  comments?: string;
  evaluatedDate: string; // ISO date string
}

export interface Student {
  id: string;
  studentName: string;
  studentNumber: string;
  studentPassword: string;
  course: string;
  department: string;
  notificationId: string;
  macAddress: string;
  studentAverageAttendance: number;
  studentAverageRatings: number;
  tokenId: string;
  category: string;
  studentUpcomingEvents: StudentUpcomingEvents[];
  studentEventAttended: StudentEventAttended[];
  studentRecentEvaluations: StudentRecentEvaluation[];
}

