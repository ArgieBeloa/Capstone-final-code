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

export interface EventPerformanceDetail {
  numberOfStudent: number;
  numberOfStudentRatedGive: number;
}
export interface EventAttendance {
  id: string;
  studentName: string;
  timeAttended: string;
}
export interface EventStudentEvaluation {
  id: string;
  studentName: string;
  timeEvaluated: string;
}
export interface EvaluationQuestion {
  questionId: string;
  questionText: string;
}
export interface EventEvaluationDetail {
  studentName: string;
  studentAverageRate: number;
  studentSuggestion: string;

  studentEvaluationInfos: StudentEvaluationInfo[];
}
export interface StudentEvaluationInfo {
  question: string;
  studentRate: number;
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
  evaluationQuestions: EvaluationQuestion[] | null;
  eventPerformanceDetails: EventPerformanceDetail[] | null;
  eventAttendance: EventAttendance[] | null;
  eventStudentEvaluations: EventStudentEvaluation[] | null;
  eventAveragePerformance: number;
}
// Student.ts
export interface StudentNotification {
  eventId: string;
  eventTitle: string;
  eventShortDescription: string;
}
export interface StudentUpcomingEvents {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string | null;
  eventLocation: string;
  numberOfStudentAttending: number;
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
  id?: string;
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
  numberOfNotification: number;
  studentUpcomingEvents: StudentUpcomingEvents[];
  studentNotifications: StudentNotification[];
  studentEventAttended: StudentEventAttended[];
  studentRecentEvaluations: StudentRecentEvaluation[];
}
