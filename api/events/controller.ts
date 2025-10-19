import axios from "axios";
import { EventModel } from "./model";
import { EventAttendance } from "./utils";

// ✅ Base URL of your Spring Boot backend
const BASE_URL = "http://localhost:8080/api/events";


// ✅ 1. Get all events (public)
export async function getAllEvents(token: string): Promise<EventModel[]> {
  
  const res = await axios.get(`${BASE_URL}`,{
     headers: { Authorization: `Bearer ${token}` },
  }
    
  );
  return res.data;
}

// ✅ 2. Get event by ID (public)
export async function getEventById(token: string, id: string): Promise<EventModel> {
  const res = await axios.get(`${BASE_URL}/${id}`,{
     headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}


// ✅ 3. Create event (only ADMIN or OFFICER)
export async function createEvent(event: EventModel, token: string): Promise<EventModel> {
  const res = await axios.post(`${BASE_URL}/create`, event, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// ✅ 4. Add Attendance (only authorized)
export async function addEventAttendance(
  eventId: string,
  attendance: EventAttendance,
  token: string
): Promise<EventModel> {
  const res = await axios.post(`${BASE_URL}/${eventId}/addAttendance`, attendance, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// ✅ 5. Update Event (only ADMIN or OFFICER)
export async function updateEvent(
  eventId: string,
  newEvent: EventModel,
  token: string
): Promise<EventModel> {
  const res = await axios.put(`${BASE_URL}/${eventId}`, newEvent, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// ✅ 6. Delete Event (only ADMIN)
export async function deleteEvent(eventId: string, token: string): Promise<string> {
  const res = await axios.delete(`${BASE_URL}/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
