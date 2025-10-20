import axios from "axios";
import { EventModel } from "./model";
import { EventAttendance, EventEvaluationDetails } from "./utils";

// ✅ Base URL of your Spring Boot backend
const BASE_URL = "http://10.12.173.25:8080/api/events";

/**
 * ✅ 1. Get all events (public)
 */
export async function getAllEvents(token: string): Promise<EventModel[]> {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Fetched all events:", response.data.length);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching all events:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * ✅ 2. Get event by ID (public)
 */
export async function getEventById(token: string, id: string): Promise<EventModel> {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Event fetched successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching event by ID:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * ✅ 3. Create event (only ADMIN or OFFICER)
 */
export async function createEvent(event: EventModel, token: string): Promise<EventModel> {
  try {
    const response = await axios.post(`${BASE_URL}/create`, event, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Event created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error creating event:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * ✅ 4. Add Attendance (authorized roles)
 */
export async function addEventAttendanceRecords(
  token: string,
  eventId: string,
  attendance: EventAttendance
): Promise<EventModel> {
  try {
    const response = await axios.post(`${BASE_URL}/${eventId}/addAttendance`, attendance, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Attendance added successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error adding attendance:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * ✅ 5. Add Evaluation for event
 */
export async function addEventEvaluationRecords(
  token: string,
  eventId: string,
  evaluation: EventEvaluationDetails
): Promise<any> {
  try {
    const response = await axios.post(`${BASE_URL}/${eventId}/addEvaluation`, evaluation, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Evaluation added successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error adding evaluation:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * ✅ 6. Update Event (only ADMIN or OFFICER)
 */
export async function updateEvent(
  eventId: string,
  newEvent: EventModel,
  token: string
): Promise<EventModel> {
  try {
    const response = await axios.put(`${BASE_URL}/${eventId}`, newEvent, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Event updated successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error updating event:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * ✅ 7. PATCH: Update "allStudentAttending" (public – STUDENT/OFFICER/ADMIN)
 */
export async function updateAllStudentAttending(
  token: string,
  eventId: string,
  newCount: number
): Promise<any> {
  try {
    const formattedToken = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token.trim()}`;

    console.log("🪙 Final Authorization Header:", formattedToken);

    const response = await axios.patch(
      `${BASE_URL}/updateAllStudentAttending/${eventId}?newCount=${newCount}`,
      {}, // No request body
      {
        headers: {
          Authorization: formattedToken,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Updated allStudentAttending successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error updating allStudentAttending:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

/**
 * ✅ 8. Delete Event (only ADMIN)
 */
export async function deleteEvent(eventId: string, token: string): Promise<string> {
  try {
    const response = await axios.delete(`${BASE_URL}/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Event deleted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error deleting event:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

/**
 * 🕒 Returns the current date and time in Philippine format (UTC+8)
 * Example Output: "2025-10-19T11:37 pm"
 */
export function getPhilippineDateTime(): string {
  const now = new Date();
  const phOffsetMinutes = 8 * 60; // UTC+8
  const phTime = new Date(now.getTime() + phOffsetMinutes * 60 * 1000);

  const year = phTime.getUTCFullYear();
  const month = String(phTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(phTime.getUTCDate()).padStart(2, "0");

  let hours = phTime.getUTCHours();
  const minutes = String(phTime.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // convert '0' to '12'

  const timeString = `${hours}:${minutes} ${ampm}`;
  return `${year}-${month}-${day}T${timeString}`;
}
