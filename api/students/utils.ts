// ===============================
// 🧑‍🎓 Student Utilities Interfaces
// ===============================

// 🔹 StudentUpcomingEvents.java
export interface StudentUpcomingEvents {
  eventImageId?: string; // MongoDB ObjectId of image in GridFS
  eventImageUrl?: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
}

// 🔹 StudentEventAttended.java
export interface StudentEventAttended {
  eventId: string;
  eventTitle: string;
  studentDateAttended: string; // ISO date string
  evaluated: boolean;
}

// 🔹 StudentRecentEvaluation.java
export interface StudentRecentEvaluation {
  eventId: string;
  eventTitle: string;
  studentRatingsGive: number;
  studentDateRated: string;
}

// 🔹 StudentNotification.java
export interface StudentNotification {
  eventId: string;
  eventTitle: string;
  eventShortDescription: string;
}

// 🔹 StudentEventAttendedAndEvaluationDetails.java
export interface StudentEventAttendedAndEvaluationDetails {
  eventId: string;
  eventTitle: string;
  eventDateAndTime: string;
  attended: boolean;
  evaluated: boolean;
}

// 🔹 StudentEvaluationInfo.java
export interface StudentEvaluationInfo {
  question: string;
  studentRate: number;
}

// 🔹 StudentEvaluationDetails.java
export interface StudentEvaluationDetails {
  studentName: string;
  studentAverageRate: number;
  studentSuggestion: string;
  studentEvaluationInfos: StudentEvaluationInfo[];
}
