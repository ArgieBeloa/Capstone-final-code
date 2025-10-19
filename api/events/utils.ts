// ===============================
// 📦 Event Utilities Interfaces
// ===============================

// 🔹 StudentEvaluationInfo.java
export interface StudentEvaluationInfo {
  question: string;
  studentRate: number;
}

// 🔹 EventOrganizer.java
export interface EventOrganizer {
  organizerName: string;
  organizerEmail: string;
}

// 🔹 EventEvaluationDetails.java
export interface EventEvaluationDetails {
  studentName: string;
  studentAverageRate: number;
  studentSuggestion: string;
  studentEvaluationInfos: StudentEvaluationInfo[];
}

// 🔹 EventAttendance.java
export interface EventAttendance {
  studentId: string;
  studentNumber: string;
  studentName: string;
  role: string;
  department: string;
  dateScanned: string; // ISO 8601 or formatted date string
}

// 🔹 EvaluationQuestion.java
export interface EvaluationQuestion {
  questionId: string;
  questionText: string;
}

// 🔹 EventAgenda.java
export interface EventAgenda {
  agendaTime: string;  // e.g. "09:00 AM" or ISO time string
  agendaTitle: string; // e.g. "Opening Remarks"
  agendaHost: string;  // e.g. "Dr. John Smith"
}
