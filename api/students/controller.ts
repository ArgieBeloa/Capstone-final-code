import axios from "axios";
import { EventEvaluationDetails } from "../events/utils";
import { StudentModel } from "./model";
import {
  StudentEventAttended,
  StudentEventAttendedAndEvaluationDetails,
  StudentRecentEvaluation,
  StudentUpcomingEvents,
} from "./utils";

// =======================================
// 🌐 BASE ENDPOINTS
// =======================================
const BASE_URL = "http://10.12.173.25:8080/api/student";
const apiForAttendance = "http://10.12.173.25:8080";

// =======================================
// 🧑‍🎓 STUDENT CONTROLLER API SERVICE
// =======================================

/**
 * 🔍 Get student details by ID
 */
export async function getStudentById(
  token: string,
  studentId: string
): Promise<StudentModel> {
  const res = await axios.get(`${BASE_URL}/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/**
 * 📝 Add a recent evaluation record for a student
 */
export async function addRecentEvaluation(
  token: string,
  studentId: string,
  evaluation: StudentRecentEvaluation
): Promise<StudentModel> {
  const res = await axios.post(
    `${BASE_URL}/${studentId}/addRecentEvaluation`,
    evaluation,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

/**
 * 🧾 Add attendance + evaluation (for Student or Officer/Admin)
 */
export async function addEventAttendanceAndEvaluation(
  token: string,
  studentId: string,
  event: StudentEventAttendedAndEvaluationDetails
): Promise<StudentModel> {
  const res = await axios.post(
    `${BASE_URL}/${studentId}/addAttendedEvaluation`,
    event,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

/**
 * 🕒 Add an attended event for a student
 */
export async function addEventAttendance(
  token: string,
  studentId: string,
  event: StudentEventAttended
): Promise<StudentModel> {
  const res = await axios.post(
    `${apiForAttendance}/api/auth/admin/addAttendance/${studentId}`,
    event,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

/**
 * 📅 Add an upcoming event to student's record
 */
export async function addUpcomingEvent(
  token: string,
  studentId: string,
  event: StudentUpcomingEvents
): Promise<StudentModel> {
  const res = await axios.post(
    `${BASE_URL}/${studentId}/addUpcomingEvent`,
    event,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

/**
 * 🧠 Add an event evaluation (Student / Officer / Admin)
 */
export async function addEventEvaluation(
  token: string,
  eventId: string,
  evaluation: EventEvaluationDetails
): Promise<any> {
  const res = await axios.post(
    `${BASE_URL}/${eventId}/addEvaluation`,
    evaluation,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

/**
 * ✅ POST: Mark event as evaluated for a specific student
 *  - Requires valid JWT token
 *  - No request body needed
 */
export async function markEventAsEvaluated(
  token: string,
  studentId: string,
  eventId: string
): Promise<any> {
  try {
    const response = await axios.post(
      `${BASE_URL}/${studentId}/events/${eventId}/markEvaluated`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Event successfully marked as evaluated:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error marking event as evaluated:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

// =======================================
// 🟢 PUT REQUESTS
// =======================================

/**
 * 🕒 Mark student as attended for a specific event
 */
export async function markStudentAttended(
  token: string,
  studentId: string,
  eventId: string
): Promise<any> {
  const res = await axios.put(
    `${BASE_URL}/mark-attended/${studentId}/${eventId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

/**
 * 🧾 Mark student as evaluated for a specific event
 */
export async function markStudentEvaluated(
  token: string,
  studentId: string,
  eventId: string
): Promise<any> {
  const res = await axios.put(
    `${BASE_URL}/mark-evaluated/${studentId}/${eventId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

// =======================================
// 🗑️ DELETE REQUESTS
// =======================================

/**
 * 🧹 Delete a specific notification for a student
 */
export async function deleteStudentNotification(
  token: string,
  studentId: string,
  notificationId: string
): Promise<any> {
  const res = await axios.delete(
    `${BASE_URL}/${studentId}/notifications/${notificationId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

/**
 * 🗑️ DELETE: Remove a student's upcoming event
 * 
 * @param token - JWT token (include the 'Bearer' prefix automatically)
 * @param studentId - The student's MongoDB ID
 * @param eventId - The upcoming event ID to delete
 * 
 * @returns Updated StudentModel after deletion
 * 
 * ✅ Example:
 * deleteUpcomingEvent(token, "68f4d09348d6e16db6b260f3", "68f08f2fea9158bed4ff2eb2");
 */
export async function deleteUpcomingEvent(
  token: string,
  studentId: string,
  eventId: string
): Promise<any> {
  try {
    const response = await axios.delete(
      `${BASE_URL}/${studentId}/upcomingEvents/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Upcoming event deleted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error deleting upcoming event:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

