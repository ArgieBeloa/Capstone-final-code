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
  studentId: string;
  studentName: string;
  studentAverageRate: number;
  studentSuggestion: string;

  studentEvaluationInfos: StudentEvaluationInfo[];
}
export interface StudentEvaluationInfo {
  question: string;
  studentRate: number;
}

export interface Event{
  id: string;

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
  eventId: string;
  id: string;
  eventName: string;
  attendedDate: string;
  evaluated: boolean;
}

export interface StudentRecentEvaluation {
  eventId: string;
  eventTitle: string;
  studentRatingsGive: number;
  studentDateRated: string;
}
export interface StudentEventAttendedAndEvaluationDetails {
  eventId: string;
  eventTitle: string;
  eventDateAndTime: string;
  attended: boolean;
  evaluated: boolean;
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
  studentEventAttendedAndEvaluationDetails: StudentEventAttendedAndEvaluationDetails[];
}
