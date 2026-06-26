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
  evaluationTime: string;
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
export interface OfficerCredentials {
  canEditEvent: boolean;
  canAddEvent: boolean;
}

// 🔹 StudentEvaluationDetails.java
export interface StudentEvaluationDetails {
  studentName: string;
  studentAverageRate: number;
  studentSuggestion: string;
  studentEvaluationInfos: StudentEvaluationInfo[];
}

// PRINT STUDENT NAMES
// export const printStudentNames = async (studentNames: string) => {
//   const html = `
//     <html>
//       <body>
//         <pre>${studentNames}</pre>
//       </body>
//     </html>
//   `;

//   await Print.printAsync({ html });
// };
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

export function normalizeName(name: String): String {
  return name
    .toLocaleLowerCase()
    .replace(/[.,]/g, "")
    .replace(/\s+/g, "")
    .trim();
}
export const psychologyStudents = [
  { studentName: "AMPOYOS, PAULA ISABELLE A." },
  { studentName: "BILLONES, YVONE GRACE C." },
  { studentName: "DAIZ, RANEAE BANATE." },
  { studentName: "DAPILAGA, DISEREE A." },
  { studentName: "DELA CRUZ, KLEO MAE" },
  { studentName: "LEONES, NYLLAH FRANCESCA B." },
  { studentName: "PALMON, ID GEL" },
  { studentName: "YAP, ZSEIHN ASHLEY L." },
  { studentName: "VALIENTE, ALLAN JEORGE S." },
];

export const bsedEnglishStudents = [
  { studentName: "ALIB, MARY FAITH JOY B." },
  { studentName: "BANTAY, THARIENE JOYCE F." },
  { studentName: "BULQUERIN, JESSICA E." },
  { studentName: "DELANDAO, APRIL JOY" },
  { studentName: "DEMANDACO, MARIEL B." },
  { studentName: "MAYO, MECHAELLA P." },
  { studentName: "OPALEC, MA. MAYLODY A." },
  { studentName: "BARRES, GLENDELA." },
];

export const bsedFilipinoStudents = [
  { studentName: "BILLONES, AMELYN D." },
  { studentName: "CATALUÑA, ARCHEL KATE G." },
  { studentName: "DELLAVA, JOYLYN D." },
  { studentName: "MONTOYA, HANNAH MAE G." },
  { studentName: "VILLANUEVA, ALEX MIRIAN ANGELIQUE A." },
  { studentName: "LUTERO, JOHN ALBERT H." },
];

export const bpedStudents = [
  { studentName: "CORTEZ, DESIREE L." },
  { studentName: "GUANZON, JAMAIRE F." },
  { studentName: "TUNGALA, JANNA A." },
  { studentName: "CALIMPONG, RAFAEL B." },
  { studentName: "JARCE, FRANCIS PHILIP A." },
];

export const civilEngineeringStudents = [
  { studentName: "BACLI, ABCEDE NICOLE M." },
  { studentName: "BALORO, VIRLEN ELIJAH" },
  { studentName: "CAÑEDO, ABEGAIL A." },
  { studentName: "CORROS, LARIJEAN C." },
  { studentName: "DELA CRUZ, JANE ROSE D." },
  { studentName: "FAGAR, VJ GRACE F." },
  { studentName: "MADRELJOS, JOEYLYN B." },
  { studentName: "MANABAT, JULIE ANNE C." },
  { studentName: "NUÑEZ, JOANA MAE B." },
  { studentName: "VILLARUEL, ELAIZAH D." },
  { studentName: "AGUILING, JOSE ANGELO" },
  { studentName: "AGULTO, CYPRIAN JADE L." },
  { studentName: "ALBAY, JOSEPH VINCENT R." },
  { studentName: "ANONOY, GENRICK E." },
  { studentName: "BALLADARES, MARK CHRISTIAN S." },
  { studentName: "BACTASOLO, CHRISTIAN JERO A." },
  { studentName: "BESA, RHENEER JOHN B." },
  { studentName: "BONGANAY, ISAGANI, JR. L." },
  { studentName: "BRAVO, DANLOYD F." },
  { studentName: "BULAQUEÑA, TOBEY L." },
  { studentName: "CORTES, JASPER C." },
  { studentName: "DEADO, RIX B." },
  { studentName: "DELA PEÑA, KIAN L." },
  { studentName: "FELOSOPO, RHOEL JOHN Q." },
  { studentName: "LAGON, DAREL J." },
  { studentName: "LARA, EL CHRISTIAN JAY D." },
  { studentName: "MARTINEZ, MARK STEPHEN" },
  { studentName: "PATRIARCA, JUAVANILE P." },
  { studentName: "RIVERA, CLEM DEREK G." },
  { studentName: "SIAPNO, JR., EDUARDO C." },
];
