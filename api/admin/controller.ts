import axios from "axios";
import { StudentModel } from "../students/model";
import { StudentNotification } from "../students/utils";


// ✅ Base URL of your Spring Boot backend
const BASE_URL = "http://localhost:8080/api/auth";

/* ===========================================================
   ✅ 1. Register a new student
   POST /api/auth/register 
=========================================================== */
export async function registerStudent(newStudent: StudentModel): Promise<string> {
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
   ✅ GET All Students And sort notificationID (ADMIN or OFFICER)
   GET /api/auth/admin/allStudents
=========================================================== */
export async function getAllStudents(
  token: string
): Promise<StudentModel []> {
  const res = await axios.get(`${BASE_URL}/admin/allStudents`,{
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/* ===========================================================
   ✅ 4. Add notification to all students (ADMIN or OFFICER)
   POST /api/auth/admin/addStudentNotification
=========================================================== */
export async function addStudentNotificationToAll(
  event: StudentNotification,
  token: string
): Promise<string> {
  const res = await axios.post(`${BASE_URL}/admin/addStudentNotification`, event, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
