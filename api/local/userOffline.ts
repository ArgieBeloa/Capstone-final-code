import AsyncStorage from "@react-native-async-storage/async-storage";

const STUDENT_KEY = "offline_students";
const EVENT_KEY = "offline_events";

// Save student data
export const saveStudentOfflineLocal = async (student: any) => {
  try {
    const existing = await AsyncStorage.getItem(STUDENT_KEY);
    const students = existing ? JSON.parse(existing) : [];

    students.push(student);

    await AsyncStorage.setItem(STUDENT_KEY, JSON.stringify(students));
  } catch (error) {
    console.log("Error saving student offline", error);
  }
};

// Get offline students
export const getOfflineStudents = async () => {
  try {
    const data = await AsyncStorage.getItem(STUDENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Error getting students", error);
    return [];
  }
};

// Save event offline
export const saveEventOfflineLocal = async (event: any) => {
  try {
    const existing = await AsyncStorage.getItem(EVENT_KEY);
    const events = existing ? JSON.parse(existing) : [];

    events.push(event);

    await AsyncStorage.setItem(EVENT_KEY, JSON.stringify(events));
  } catch (error) {
    console.log("Error saving event offline", error);
  }
};

// Get offline events
export const getOfflineEvents = async () => {
  try {
    const data = await AsyncStorage.getItem(EVENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Error getting events", error);
    return [];
  }
};

// Clear synced data
export const clearOfflineData = async () => {
  await AsyncStorage.removeItem(STUDENT_KEY);
  await AsyncStorage.removeItem(EVENT_KEY);
};
