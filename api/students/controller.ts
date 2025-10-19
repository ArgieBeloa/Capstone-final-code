import axios from "axios";
import { EventEvaluationDetails } from "../events/utils";
import { StudentModel } from "./model";
import {
  StudentEventAttended,
  StudentEventAttendedAndEvaluationDetails,
  StudentRecentEvaluation,
  StudentUpcomingEvents,
} from "./utils";

const BASE_URL = "http://localhost:8080/api/student";

// ✅ Helper for auth headers

// ===================================
// 🧑‍🎓 STUDENT CONTROLLER API SERVICE
// ===================================

// ✅ GET Student by ID
export async function getStudentById(
  token: string,
  studentId: string
): Promise<StudentModel> {
  const res = await axios.get(`${BASE_URL}/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// ✅ POST Add Recent Evaluation
export async function addRecentEvaluation(
  token: string,
  studentId: string,
  evaluation: StudentRecentEvaluation
): Promise<StudentModel> {
  const res = await axios.post(
    `${BASE_URL}/${studentId}/addRecentEvaluation`,
    evaluation, {
    headers: { Authorization: `Bearer ${token}` },
  });
    
  return res.data;
}

// ✅ POST Add Attendance + Evaluation (Student or Officer/Admin)
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

// ✅ POST Add Attended Event
export async function addEventAttendance(
  token: string,
  studentId: string,
  event: StudentEventAttended
): Promise<StudentModel> {
  const res = await axios.post(
    `${BASE_URL}/${studentId}/addEventAttendance`,
    event, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  return res.data;
}

// ✅ POST Add Upcoming Event
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

// ✅ POST Add Event Evaluation (STUDENT / OFFICER / ADMIN)
export async function addEventEvaluation(
  token: string,
  eventId: string,
  evaluation: EventEvaluationDetails
): Promise<any> {
  const res = await axios.post(
    `${BASE_URL}/${eventId}/addEvaluation`,
    evaluation, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// ✅ PATCH Mark Event as Evaluated
export async function markEventAsEvaluated(
  token: string,
  studentId: string,
  eventId: string
): Promise<any> {
  const res = await axios.patch(
    `${BASE_URL}/${studentId}/events/${eventId}/markEvaluated`,
    {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// PUT
// ✅ Mark student as attended
export async function markStudentAttended(token: string,studentId: string, eventId: string): Promise<any> {
  const res = await axios.put(
    `${BASE_URL}/mark-attended/${studentId}/${eventId}`,
    {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// ✅ Mark student as evaluated
export async function markStudentEvaluated(token: string,studentId: string, eventId: string): Promise<any> {
  const res = await axios.put(
    `${BASE_URL}/mark-evaluated/${studentId}/${eventId}`,
    {}
    , {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}


// ✅ DELETE Notification
export async function deleteStudentNotification(
  token: string,
  studentId: string,
  notificationId: string
): Promise<any> {
  const res = await axios.delete(
    `${BASE_URL}/${studentId}/notifications/${notificationId}`
    , {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
