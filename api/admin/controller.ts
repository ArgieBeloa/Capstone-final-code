import axios from "axios";
import { StudentModel } from "../students/model";
import { StudentNotification } from "../students/utils";

// ✅ Base URL of your Spring Boot backend
const BASE_URL = "https://securebackend-ox2e.onrender.com/api/auth";

/* ===========================================================
   ✅ 1. Register a new student
   POST /api/auth/register 
=========================================================== */
export async function registerStudent(
  newStudent: StudentModel
): Promise<string> {
  const res = await axios.post(`${BASE_URL}/register`, newStudent);
  return res.data;
}

/* ===========================================================
   ✅ 2. Login (student)
   POST /api/auth/login
=========================================================== */
export async function loginStudent(
  studentNumber: string,
  studentPassword: string
): Promise<{ _id: string; role: string; token: string }> {
  const res = await axios.post(`${BASE_URL}/login`, {
    studentNumber,
    studentPassword,
  });
  return res.data;
}

/* ===========================================================
   ✅ 3. Get all student notification IDs (ADMIN only)
   GET /api/auth/admin/allStudentNotificationIds
=========================================================== */
export async function getAllStudentNotificationIds(token: string): Promise<{
  message: string;
  total: number;
  data: any[];
}> {
  const res = await axios.get(`${BASE_URL}/admin/allStudentNotificationIds`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/* ===========================================================
   ✅ 4. GET All Students And sort notificationID (ADMIN or OFFICER)
   GET /api/auth/admin/allStudents
=========================================================== */
export async function getAllStudents(token: string): Promise<StudentModel[]> {
  const res = await axios.get(`${BASE_URL}/admin/allStudents`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/* ===========================================================
   ✅ 5. Add notification to all students (ADMIN or OFFICER)
   POST /api/auth/admin/addStudentNotification
=========================================================== */
export async function addStudentNotificationToAll(
  event: StudentNotification,
  token: string
): Promise<string> {
  const res = await axios.post(
    `${BASE_URL}/admin/addStudentNotification`,
    event,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

/* ===========================================================
   ✅ 6. notify by their token (ADMIN or OFFICER)
   POST /api/auth/admin/sendExpoNotification
=========================================================== */
// 🚀 Function to send Expo notifications (ADMIN or OFFICER only)
export async function sendExpoNotification(
  token: string,
  payload: {
    tokens: string[];
    title: string;
    body: string;
  }
): Promise<string> {
  try {
    // ✅ Convert tokens from objects → plain strings

    const response = await axios.post(
      `${BASE_URL}/admin/sendExpoNotification`,
      payload,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Notification sent successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Failed to send notification:",
      error?.response?.data || error.message
    );
    throw error;
  }
}

/* ===========================================================
   ✅ 7. only admin or officer can add student attendance (ADMIN or OFFICER)
   POST /api/auth/admin/addAttendance/{studentId}
=========================================================== */
