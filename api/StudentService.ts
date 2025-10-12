import {
  StudentEventAttendedAndEvaluationDetails,
  StudentNotification,
  StudentRecentEvaluation
} from "@/app/Oop/Types";
import axios from "axios";
import { BASE_URL } from "./spring";

// GET
export const searchEventbyTitle = async (token: string, eventTitle: string) => {
  try {
    const api = `${BASE_URL}/events/${eventTitle}`;

    const event = axios.get(api, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return event;
  } catch (error) {
    console.log(error);
  }
};

// GET ALL STUDENTS
export const getAllStudents = async (token: string) => {
  try {
    const api = `${BASE_URL}/students/allStudentData`;

    const allStudents = await axios.get(api, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return allStudents.data;
  } catch (error) {
    console.log(error);
  }
};
// http://localhost:8080/api/students/id/68e8b3b76858c4b04e4f4418
export const getStudentById = async (token: string, id: string) => {
   
  const api =`${BASE_URL}/students/id/${id}`
  try {
    const student = await axios.get(api,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

    return student.data
    
  } catch (error) {
    console.log(error)
    
  }
  
}

// POST
export const addStudentNotificationApi = async (token: string, id: any) => {
  try {
    const api = `${BASE_URL}/students/${id}/addNotification}`;

    const notification = await axios.get(api, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return notification.data;
  } catch (error) {
    console.log(error);
  }
};

export const addStudentRecentEvaluation = async (
  token: string,
  studentId: string,
  studentRecentEvaluation: StudentRecentEvaluation[]
) => {
  try {
    const api = `${BASE_URL}/students/${studentId}/evaluation`;

    const evaluation = await axios.post(api, studentRecentEvaluation, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return evaluation.data;
  } catch (error) {
    console.log(error);
  }
};

export const addStudentProfileData = async (
  token: string,
  studentId: string,
  newData: StudentEventAttendedAndEvaluationDetails[]
) => {
  try {
    const api = `${BASE_URL}/students/${studentId}/addStudentProfileData`;

    const profileData = await axios.post(api, newData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(profileData.data);

    return profileData.data;
  } catch (error) {
    console.log(error);
  }
};

// Notication notify all
export const sendExpoNotification = async (payload: {
  tokens: string[];
  title: string;
  message: string;
}) => {
  try {
    const response = await axios.post(
      "https://exponotificationthesiscode-1.onrender.com/expo/send",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa("department:department2025")}`,
        },
      }
    );

    console.log("✅ Notification sent successfully:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("❌ Server error:", error.response.data);
    } else if (error.request) {
      console.error("⚠️ No response from server:", error.request);
    } else {
      console.error("🚫 Error setting up request:", error.message);
    }
    throw error;
  }
};

// add student notification data
// http://localhost:8080/api/students/68cd299fb59b796fbcca90b8/addNotification
export const addStudentNotification = async (token:string, studentId: string, studentNotification: StudentNotification[]) => {
  
  try {
    const api = `${BASE_URL}/students/${studentId}/addNotification`

    const notification = await axios.post(api, studentNotification, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    return notification.data
  } catch (error) {
    console.log(error)
  }
}





// PUT
export const updateProfileData = async (
  token: string,
  studentId: string,
  eventId: string,
  isAttended?: boolean,
  isEvaluated?: boolean
) => {
  try {
    const api = `${BASE_URL}/students/${studentId}/event/${eventId}/update-status`;

    const response = await axios.put(
      api,
      null, // no request body, just query params
      {
        params: {
          isAttended,
          isEvaluated,
        },
        headers: {
          Authorization: `Bearer ${token}`, // include your JWT or session token
        },
      }
    );

    console.log("Update success:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating event status:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateStudentEventEvaluated = async (
  token: string,
  studentId: string,
  eventId: string,
  evaluated: boolean
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/students/${studentId}/event/${eventId}/update-evaluated?evaluated=${evaluated}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update evaluation: ${response.status}`);
    }

    const data = await response.json();
    console.log("Updated student evaluation:", data);
    return data;
  } catch (error) {
    console.error("Error updating student evaluation:", error);
    throw error;
  }
};

// DELETE
// /{studentId}/delete/upcomingEvents/{eventId}
export const deleteSpecificStudentUpcomingEvents = async (
  token: string,
  studentId: string,
  eventId: string
) => {
  try {
    const api = `${BASE_URL}/students/${studentId}/delete/upcomingEvents/${eventId}`;

    const eventDelete = await axios.delete(api, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return eventDelete.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteSpecificStudentNotifications = async (
  token: string,
  studentId: string,
  eventId: string
) => {
  try {
    const api = `${BASE_URL}/students/${studentId}/delete/studentNotification/${eventId}`;

    const eventDelete = await axios.delete(api, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return eventDelete.data;
  } catch (error) {
    console.log(error);
  }
};
