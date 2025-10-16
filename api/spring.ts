import axios from "axios";
// npx eas build --profile development --platform android

// interface
import { EventAttendance, Student, StudentUpcomingEvents } from "@/app/Oop/Types";
import { StudentAttended } from "./ApiType";

  // export const BASE_URL = "http://10.43.54.25:8080/api"; // Use your local IP and port
  export const BASE_URL = "https://thesisbackendcodestudent-1.onrender.com/api"; // Use your local IP and port

// auth student
export const authStudent = async (
  studentNumber: string,
  studentPassword: string
) => {
  try {
    const token = await axios.post(`${BASE_URL}/students/login`, {
      studentNumber,
      studentPassword,
    });

    return token.data;
  } catch (error) {
    console.error("Failed to authenticate student:", error);
    throw error;
  }
};

// register student

// const API_URL = 'https://capstonestudentloginapi.onrender.com/api/students/register';

export async function registerStudent(newStudent: Student): Promise<any> {
  try {
    const response = await axios.post(`${BASE_URL}/students/register`,newStudent);

    return response.data;
  } catch (error) {
    console.error("Register API Error:", error);
    throw error;
  }
}

// getStudentData using studentID
export const studentDataFunction = async (
  studentNumber: string,
  token: string
) => {
  try {
    const trimmedToken = token.trim();
    const studentData = await axios.get(
      `${BASE_URL}/students/${studentNumber}`,
      {
        headers: {
          Authorization: `Bearer ${trimmedToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return studentData.data;
  } catch (error) {
    console.error("Failed to get student Data: ", error);
    throw error;
  }
};

// get all events
export const eventsDataFunction = async (token: string) => {
  try {
    const events = await axios.get(`${BASE_URL}/events/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return events.data;
  } catch (error) {
    console.error("Failed to get event data: ", error);
    throw error;
  }
};

// get event by id
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
// haddle update event
type updateDocumentProp = {
  id?: string;
  eventTitle?: string;
  eventShortDescription?: string;
  eventBody?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  eventCategory?: string;
  eventTimeLength?: string;
  eventAgendas?: any;
  eventStats?: any;
  eventOrganizer?: any;
  eventEvaluationDetails?: any;
  eventPerformanceDetails?: any;
  allStudentAttending?: Number;
};
export const updateStudentEventData = async (
  id: any,
  token: string,
  updateDocument: updateDocumentProp
) => {
  try {
    const api = `${BASE_URL}/events/update/${id}`;

    const eventUpdate = await axios.put(api, updateDocument, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return eventUpdate.data[0];
  } catch (error) {
    console.log(error);
  }
};

// update student upcoming event
export const addStudentUpcomingEvent = async (
  studentId: string,
  token: string,
  upcomingEventData: StudentUpcomingEvents[]
) => {
  const api = `${BASE_URL}/students/${studentId}/upcomingEvents`;
  try {
    const upcomingEvent = await axios.post(api, upcomingEventData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return upcomingEvent.data;
  } catch (error) {
    console.log(error);
  }
};
// add event student attendance
export const addEventAttendance = async (
  id: string,
  token: string,
  eventAttendance: EventAttendance
) => {
  const api = `${BASE_URL}/events/${id}/addEventAttendance`;
  try {
    const eventStudentAttendance = await axios.post(api, eventAttendance, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return eventStudentAttendance.data;
  } catch (error) {
    console.log(error);
  }
};


// add student to event attended
export const addStudentAttended = async (
  id: string,
  token: string,
  studentAttend: StudentAttended[]
) => {
  const api = `${BASE_URL}/students/${id}/eventAttended`;


  try {
    const studentAttended = await axios.post(api, studentAttend, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return studentAttended.data;
  } catch (error) {
    console.log(error);
  }
};


// increase student notication number

export async function increaseStudentNotification(
  id: string,
  numberOfNotification: number
) {
  try {
    const response = await axios.patch(
      `${BASE_URL}/${id}/increaseNumberOfNotification`,
      {}, // empty body
      {
        params: { numberOfNotification },
      }
    );
    return response.data; // StudentModel returned
  } catch (error) {
    console.error("Error increasing student notification:", error);
    throw error;
  }
}


