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

// ENUM COURSE
export enum Course {
  DOCTOR_OF_PHILOSOPHY = "Doctor of Philosophy",
  MASTER_OF_ARTS_IN_EDUCATION = "Master of Arts in Education",
  MASTER_OF_PUBLIC_ADMINISTRATION = "Master of Public Administration",
  MASTER_OF_BUSINESS_ADMINISTRATION = "Master in Business Administration",

  COLLEGE_OF_LAW = "College of Law",

  BACHELOR_OF_ARTS = "Bachelor of Arts",
  BACHELOR_OF_SCIENCE_IN_PSYCHOLOGY = "Bachelor of Science in Psychology",
  BACHELOR_OF_SCIENCE_IN_MATHEMATICS = "Bachelor of Science in Mathematics",
  BACHELOR_OF_SECONDARY_EDUCATION = "Bachelor of Secondary Education",
  BACHELOR_OF_ELEMENTARY_EDUCATION = "Bachelor of Elementary Education",
  BACHELOR_OF_PHYSICAL_EDUCATION = "Bachelor of Physical Education",
  BACHELOR_OF_SCIENCE_IN_CRIMINOLOGY = "Bachelor of Science in Criminology",
  BACHELOR_OF_SCIENCE_IN_ACCOUNTANCY = "Bachelor of Science in Accountancy",
  BACHELOR_OF_SCIENCE_IN_BUSINESS_ADMINISTRATION = "Bachelor of Science in Business Administration",
  BACHELOR_OF_SCIENCE_IN_HOSPITALITY_MANAGEMENT = "Bachelor of Science in Hospitality Management",
  BACHELOR_OF_SCIENCE_IN_TOURISM_MANAGEMENT = "Bachelor of Science in Tourism & Management",
  BACHELOR_OF_SCIENCE_IN_INFORMATION_TECHNOLOGY = "Bachelor of Science in Information Technology",
  BACHELOR_OF_SCIENCE_IN_CIVIL_ENGINEERING = "Bachelor of Science in Civil Engineering",
  BACHELOR_OF_SCIENCE_IN_COMPUTER_ENGINEERING = "Bachelor of Science in Computer Engineering",
  BACHELOR_OF_SCIENCE_IN_ELECTRICAL_ENGINEERING = "Bachelor of Science in Electrical Engineering",
  BACHELOR_OF_SCIENCE_IN_MARINE_ENGINEERING = "Bachelor of Science in Marine Engineering",
}

// DEPARTMENT ENUM
export enum Department {
  CET = "College of Engineering and Technology",
  CBMA = "College of Business Management and Accountancy",
  CHTM = "College of Hospitality and Tourism Management",
  CASE = "College of Arts, Sciences and Education",
  CCJ = "College of Criminal Justice",
  LAW = "College of Law",
  GRADUATE = "Graduate School",
  CME = "College of Marine Engineering",
}

export const DepartmentCourses = {
  [Department.GRADUATE]: [
    Course.DOCTOR_OF_PHILOSOPHY,
    Course.MASTER_OF_ARTS_IN_EDUCATION,
    Course.MASTER_OF_PUBLIC_ADMINISTRATION,
    Course.MASTER_OF_BUSINESS_ADMINISTRATION,
  ],

  [Department.LAW]: [Course.COLLEGE_OF_LAW],

  [Department.CASE]: [
    Course.BACHELOR_OF_ARTS,
    Course.BACHELOR_OF_SCIENCE_IN_PSYCHOLOGY,
    Course.BACHELOR_OF_SCIENCE_IN_MATHEMATICS,
    Course.BACHELOR_OF_SECONDARY_EDUCATION,
    Course.BACHELOR_OF_ELEMENTARY_EDUCATION,
    Course.BACHELOR_OF_PHYSICAL_EDUCATION,
  ],

  [Department.CCJ]: [Course.BACHELOR_OF_SCIENCE_IN_CRIMINOLOGY],

  [Department.CBMA]: [
    Course.BACHELOR_OF_SCIENCE_IN_ACCOUNTANCY,
    Course.BACHELOR_OF_SCIENCE_IN_BUSINESS_ADMINISTRATION,
  ],

  [Department.CHTM]: [
    Course.BACHELOR_OF_SCIENCE_IN_HOSPITALITY_MANAGEMENT,
    Course.BACHELOR_OF_SCIENCE_IN_TOURISM_MANAGEMENT,
  ],

  [Department.CET]: [
    Course.BACHELOR_OF_SCIENCE_IN_INFORMATION_TECHNOLOGY,
    Course.BACHELOR_OF_SCIENCE_IN_CIVIL_ENGINEERING,
    Course.BACHELOR_OF_SCIENCE_IN_COMPUTER_ENGINEERING,
    Course.BACHELOR_OF_SCIENCE_IN_ELECTRICAL_ENGINEERING,
  ],
  [Department.CME]: [Course.BACHELOR_OF_SCIENCE_IN_MARINE_ENGINEERING],
};
