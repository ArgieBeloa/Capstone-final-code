import {
  OfficerCredentials,
  StudentEventAttended,
  StudentEventAttendedAndEvaluationDetails,
  StudentNotification,
  StudentRecentEvaluation,
  StudentUpcomingEvents,
} from "./utils";

export interface StudentModel {
  id?: string;

  // 🔐 Credentials
  studentNumber: string;
  studentPassword?: string;

  // 🧭 Access control
  officerCredentials: OfficerCredentials;

  // 🧑‍🎓 Student info
  studentName: string;
  course: string;
  department: string;
  notificationId: string;

  // 📅 Related arrays
  studentUpcomingEvents: StudentUpcomingEvents[];
  studentEventAttended: StudentEventAttended[];
  studentRecentEvaluations: StudentRecentEvaluation[];
  studentNotifications: StudentNotification[];
  studentEventAttendedAndEvaluationDetails: StudentEventAttendedAndEvaluationDetails[];
}
