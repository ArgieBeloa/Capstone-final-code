import axios from "axios";
import { StudentModel } from "../students/model";
import { StudentNotification } from "../students/utils";
import { AdminModel } from "./adminModel";
import { GLOBAL_URL } from "./url";
import {
  approvalUpdateEvent,
  currentOfficer,
  evaluationTemplates,
  ForgetPassword,
} from "./utils";

// ✅ Base URL of your Spring Boot backend
// const BASE_URL = "https://securebackend-ox2e.onrender.com/api/auth";

const BASE_URL = `${GLOBAL_URL}/api/auth`;

// GET Admin data by id
export async function getAdminById(
  token: string,
  id: string,
): Promise<AdminModel> {
  const res = await axios.get(`${BASE_URL}/admin/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
// POST

// Officer
export async function addNewOfficer(
  currentOfficer: currentOfficer | undefined,
  id: string,
  token: string,
): Promise<string> {
  const res = await axios.post(
    `${BASE_URL}/admin/addNewOfficer/${id}`,
    currentOfficer,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
}

// Approval Event
export async function addApprovalEvent(
  approvalUpdateEvents: approvalUpdateEvent,
  id: string,
  token: string,
): Promise<string> {
  const res = await axios.post(
    `${BASE_URL}/admin/addApprovalEvent/${id}`,
    approvalUpdateEvents,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
}

// Evaluation Template
// GET TEMPLATE
export async function getEvaluationTemplate(
  adminId: string,
  token: string,
): Promise<evaluationTemplates[]> {
  const res = await axios.get(
    `${BASE_URL}/admin/evaluationTemplates/${adminId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
}

// ADD evaluation template
export async function addEvaluationTemplate(
  newEvaluationTemplate: evaluationTemplates,
  adminId: string,
  token: string,
): Promise<string> {
  const res = await axios.post(
    `${BASE_URL}/admin/addEvaluationTemplate/${adminId}`,
    newEvaluationTemplate,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
}

// Delete
// DELETE Approval Event
export const deleteApprovalEvent = async (
  adminId: string,
  eventId: string,
  token: string,
): Promise<AdminModel> => {
  try {
    const response = await axios.delete<AdminModel>(
      `${BASE_URL}/admin/${adminId}/eventApproval/${eventId}`,
      {
        headers: {
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.log("Delete Approval Event Error:", error?.response?.data || error);
    throw error;
  }
};

// DELETE Current Officer
export const deleteCurrentOfficer = async (
  adminId: string,
  studentId: string,
  token: string,
): Promise<AdminModel> => {
  try {
    const response = await axios.delete<AdminModel>(
      `${BASE_URL}/admin/${adminId}/currentOfficer/${studentId}`,
      {
        headers: {
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.log(
      "Delete Current Officer Error:",
      error?.response?.data || error,
    );
    throw error;
  }
};

// DELETE Evaluation Template
export const deleteEvaluationTemplate = async (
  adminId: string,
  templateId: string,
  token: string,
): Promise<AdminModel> => {
  try {
    const response = await axios.delete<AdminModel>(
      `${BASE_URL}/admin/${adminId}/evaluationTemplate/${templateId}`,
      {
        headers: {
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.log(
      "Delete Evaluation Template Error:",
      error?.response?.data || error,
    );
    throw error;
  }
};

/* ===========================================================
   ✅ 1. Register a new student
   POST /api/auth/register 
=========================================================== */
export async function registerStudent(
  newStudent: StudentModel,
  token: string,
): Promise<string> {
  const res = await axios.post(`${BASE_URL}/register`, newStudent, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function registerStudentOpen(
  newStudent: StudentModel,
): Promise<string> {
  const res = await axios.post(`${BASE_URL}/registerOpen`, newStudent);
  return res.data;
}
/* ===========================================================
   ✅ 2. Login (student)
   POST /api/auth/login
=========================================================== */
export async function loginStudent(
  studentNumber: string,
  studentPassword: string,
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
  token: string,
): Promise<string> {
  const res = await axios.post(
    `${BASE_URL}/admin/addStudentNotification`,
    event,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
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
  },
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
      },
    );

    console.log("✅ Notification sent successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Failed to send notification:",
      error?.response?.data || error.message,
    );
    throw error;
  }
}

/* ===========================================================
   ✅ 7. only admin or officer can add student attendance (ADMIN or OFFICER)
   POST /api/auth/admin/addAttendance/{studentId}
=========================================================== */
/**
 * Promotes a user by their ID (requires JWT token).
 * @param userId - The MongoDB ObjectId of the user to promote.
 * @param token - The JWT token of the admin or authorized user.
 * @returns The API response data or throws an error if the request fails.
 */
export async function promoteStudent(
  token: string,
  userId: string,
  canEditEvent: boolean,
  canAddEvent: boolean,
): Promise<any> {
  try {
    const response = await axios.patch(
      `${BASE_URL}/promote/${userId}?canEdit=${canEditEvent}&canAdd=${canAddEvent}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Error ${error.response.status}: ${
          error.response.data.message || error.response.data
        }`,
      );
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
}

export async function demoteOfficer(
  userId: string,
  token: string,
): Promise<any> {
  try {
    const response = await axios.patch(
      `${BASE_URL}/demote/${userId}`,
      {}, // no body needed
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Error ${error.response.status}: ${error.response.data.message || error.response.data}`,
      );
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }
}
export async function updateStudentByIdApi(
  id: string,
  token: string,
  updatedStudent: StudentModel,
): Promise<StudentModel> {
  try {
    const response = await axios.put(
      `${BASE_URL}/admin/updateStudentById/${id}`,
      updatedStudent,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("❌ Error updating event:");
    throw error.response?.data || error;
  }
}

export async function deleteStudent(
  id: string,
  token: string,
): Promise<string> {
  try {
    if (!token) {
      throw new Error("Token is missing");
    }

    const response = await axios.delete(
      `${BASE_URL}/admin/deleteStudent/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    console.log("✅ Student deleted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error deleting event:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
}

export async function resetPassword(
  token: string,
  forgetPassword: ForgetPassword,
): Promise<string> {
  try {
    if (!token) {
      throw new Error("Token is missing");
    }

    const response = await axios.post(
      `${BASE_URL}/admin/resetPassword`,
      forgetPassword,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error deleting event:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error;
  }
}
