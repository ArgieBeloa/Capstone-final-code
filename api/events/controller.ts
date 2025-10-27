import axios from "axios";
import { Platform } from "react-native";
import { EventModel } from "./model";
import { EventAttendance, EventEvaluationDetails, PickedImage } from "./utils";

// ✅ Base URL of your Spring Boot backend
const BASE_URL = "https://securebackend-ox2e.onrender.com/api/events";

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
    console.error(
      "❌ Error fetching all events:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

/**
 * ✅ 2. Get event by ID (public)
 */
export async function getEventById(
  token: string,
  id: string
): Promise<EventModel> {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Event fetched successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error fetching event by ID:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

/**
 * ✅ 3. Create event (only ADMIN or OFFICER)
 */
export async function createEvent(
  event: EventModel,
  token: string
): Promise<EventModel> {
  try {
    const response = await axios.post(`${BASE_URL}/create`, event, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Event created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error creating event:",
      error.response?.data || error.message
    );
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
    const response = await axios.post(
      `${BASE_URL}/${eventId}/addAttendance`,
      attendance,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("✅ Attendance added successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error adding attendance:",
      error.response?.data || error.message
    );
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
    const response = await axios.post(
      `${BASE_URL}/${eventId}/addEvaluation`,
      evaluation,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("✅ Evaluation added successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error adding evaluation:",
      error.response?.data || error.message
    );
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
    console.error(
      "❌ Error updating event:",
      error.response?.data || error.message
    );
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
      {},
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
export async function deleteEvent(
  eventId: string,
  token: string
): Promise<string> {
  try {
    const response = await axios.delete(`${BASE_URL}/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Event deleted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ Error deleting event:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
}

/**
 * ✅ 9. Upload Event Image (ADMIN or OFFICER)
 */
// 🚀 Upload to Spring Boot backend
  export const uploadImage = async (image: PickedImage,  eventId: string, token: string ) => {
    if (!image) {
      
      return;
    }

   
    const url = `https://securebackend-ox2e.onrender.com/api/events/${eventId}/upload-image`;

    try {
      const formData = new FormData();

      if (Platform.OS === "web") {
        // 🖥 Web: must use real File
        const response = await fetch(image.uri);
        const blob = await response.blob();
        const file = new File([blob], image.fileName ?? "upload.jpg", {
          type: image.type,
        });
        formData.append("file", file);
      } else {
        // 📱 Native
        formData.append("file", {
          uri:
            Platform.OS === "ios"
              ? image.uri.replace("file://", "")
              : image.uri,
          name: image.fileName,
          type: image.type,
        } as any);
      }

      // ✅ Axios auto-handles boundaries
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

     
      console.log("Response:", response.data);
    } catch (error: any) {
      console.error("Upload error:", error);
     
    }
  };

/**
 * ✅ 10. Get Event Image URL (public)
 * This helps display the image easily on the frontend.
 */
export function getEventImageUrl(eventImageId: string): string | null {
  if (!eventImageId) return null;
  return `${BASE_URL}/image/${eventImageId}`;
}

/**
 * ✅ 11. Fetch Event Image as Blob and return Object URL (public)
 * Usage: const imageUrl = await fetchEventImageById("68fe3f9be8afa9ebda9d2fd8");
 */
/**
 * ✅ Fetch Event Image as Blob with JWT authentication
 */

// Return a data URI usable by React Native Image
export const fetchEventImageById = async (
  imageURL: string,
  token: string
): Promise<string | null> => {
  try {
    const response = await fetch(
      `${imageURL}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("❌ Failed to fetch image:", response.status);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = base64ArrayBuffer(arrayBuffer);

    // ✅ Correctly format data URI
    const contentType = response.headers.get("Content-Type") || "image/jpeg";
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error("⚠️ Error fetching image:", error);
    return null;
  }
};

// ✅ Converts ArrayBuffer → Base64 (works better in RN)
const base64ArrayBuffer = (arrayBuffer: ArrayBuffer) => {
  let binary = "";
  const bytes = new Uint8Array(arrayBuffer);
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
};

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
  hours = hours ? hours : 12;

  const timeString = `${hours}:${minutes} ${ampm}`;
  return `${year}-${month}-${day}T${timeString}`;
}

// utils/getEventImageByLocation.ts
export const getEventImageByLocation = (location: string) => {
  switch (location) {
    case "Auditorium":
      return require("@/assets/images/auditorium.jpg");
    case "Slec":
      return require("@/assets/images/slec.jpg");
    case "CPC main":
      return require("@/assets/images/cpc_main.jpg");
    case "CPC Boulevard":
      return require("@/assets/images/cpcBoulevard.jpg");
    case "SM":
      return require("@/assets/images/sm.jpg");
    case "none":
      return require("@/assets/images/cpcLogo2.png");
    case "":
    default:
      return require("@/assets/images/cpcLogo2.png"); // fallback
  }
};
