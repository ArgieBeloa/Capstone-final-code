import axios from "axios";
import { BASE_URL } from "./spring";


// add student notification
//   /{id}/addNotification
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
