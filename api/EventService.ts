import axios from "axios";

import { BASE_URL } from "./spring";

// parameter import
import { EventAttendance, StudentEvaluationInfo } from "@/app/Oop/Types";

// GET
export const getEventById = async (token: string, id: any) => {
  try {
    const api = `${BASE_URL}/events/id/${id}`;

    const event = await axios.get(api, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return event.data;
  } catch (error) {
    console.log(error);
  }
};

// GET ALL EVENT
export const getAllEvents = async (token:string) => {

  const api =  `${BASE_URL}/events/getAll`

  try {
    const allEvent = await axios.get(api, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })


    return allEvent.data
  } catch (error) {
    
  }
  
}

// by title
export const getEventByTitle = async (token: string, title: string) => {
  
  try {
    const api = `${BASE_URL}/events/category/${title}`
    const event = await axios.get(api, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

    return event.data
    

  } catch (error) {
    console.log(error)
    
  }
  
}

// POST
export interface EventEvaluation {
  studentId: string;                // backend needs ID too
  studentName: string;
  studentAverageRate: number;
  studentSuggestion: string;
  studentEvaluationInfos: StudentEvaluationInfo[]; // ✅ correct type
}

export const addEventEvaluation = async (
  token: string,
  eventId: string,
  evaluationData: EventEvaluation
) => {
  try {
    const api = `${BASE_URL}/events/${eventId}/eventEvaluationDetails`;

    // backend expects an array of evaluations
    const response = await axios.post(api, [evaluationData], {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error submitting evaluation:", error.response || error);
    throw error;
  }
};

// add student to event data
export const addStudentToEventAttendance = async (
  id: string,
  token: string,
  newAttendance: EventAttendance[]
) => {
  const api = `${BASE_URL}/events/${id}/addEventAttendance`;
  try {
    const eventAttendance = await axios.post(api, newAttendance, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(eventAttendance)

    return eventAttendance.data;
  } catch (error) {
    console.log(error);
  }
};

// 


// DELETE

// Delete attendance by studentNumber + eventId
export const deleteStudentAttendance = async (
  token: string,
  studentNumber: string,
  eventId: string
) => {
  try {
    const url = `${BASE_URL}/students/${studentNumber}/delete/studentAttendance/${eventId}`;

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // success response from backend
  } catch (error: any) {
    console.error("Error deleting student attendance:", error.response?.data || error.message);
    throw error;
  }
};


// update area
// updateAttending.ts
export async function updateAllStudentAttending(token: string, eventId: string, count: number) {
  try {
    const url = `${BASE_URL}/events/${eventId}/attending?count=${count}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to update attending: ${response.statusText}`);
    }

    const data = await response.text(); // or response.json() if your API returns JSON
    // console.log('Update response:', data);
    return data;
  } catch (error) {
    console.error('Error updating attending:', error);
    throw error;
  }
}


// http://localhost:8080/api/students/20250001/delete/studentNotification/evt101


// props generated 

