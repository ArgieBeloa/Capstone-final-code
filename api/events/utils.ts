// ===============================
// 📦 Event Utilities Interfaces
// ===============================

// for notification
export interface ExpoNotificationPayload {
  tokens: string[]; // List of Expo push tokens
  title: string; // Notification title
  body: string; // Notification body message
}

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
  course: string;
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
  agendaTime: string; // e.g. "09:00 AM" or ISO time string
  agendaTitle: string; // e.g. "Opening Remarks"
  agendaHost: string; // e.g. "Dr. John Smith"
}

export interface QrGeneratorProps {
  eventId: string;
  eventTitle: string;
  officerToken: string;
}

export interface PickedImage {
  uri: string;
  type: string;
  fileName?: string;
}
export const removeDuplicateStudents = (
  data: EventEvaluationDetails[],
): EventEvaluationDetails[] => {
  const seen = new Set<string>();

  return data.filter(({ studentName }) => {
    const name = studentName.trim().toLowerCase();

    return name && !seen.has(name) && !!seen.add(name);
  });
};

export function getOverallEvaluationPerformance(
  evaluations: EventEvaluationDetails[],
) {
  if (!evaluations || evaluations.length === 0) {
    return {
      totalStudents: 0,
      overallAverageRate: 0,
      performance: "No Data",
    };
  }

  // combine all student average rates
  const totalAverage = evaluations.reduce(
    (sum, student) => sum + student.studentAverageRate,
    0,
  );

  const overallAverageRate = totalAverage / evaluations.length;

  // optional performance label
  let performance = "";

  if (overallAverageRate >= 4.5) {
    performance = "Excellent";
  } else if (overallAverageRate >= 3.5) {
    performance = "Very Good";
  } else if (overallAverageRate >= 2.5) {
    performance = "Good";
  } else if (overallAverageRate >= 1.5) {
    performance = "Fair";
  } else {
    performance = "Poor";
  }

  return {
    totalStudents: evaluations.length,
    overallAverageRate: Number(overallAverageRate.toFixed(2)),
    performance,
  };
}

// DATE CONFLICT

// read
export const parseLocalDateTimeUtils = (dateTime: string): Date => {
  const [datePart, timePart] = dateTime.split("T");

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second = 0] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute, second);
};

// Save to db
export const formatLocalDateTimeUTils = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}T` +
    `${pad(date.getHours())}:` +
    `${pad(date.getMinutes())}:` +
    `${pad(date.getSeconds())}`
  );
};
