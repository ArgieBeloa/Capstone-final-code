import AsyncStorage from "@react-native-async-storage/async-storage";

const STUDENT_KEY = "offline_students";
const EVENT_KEY = "offline_events";

// -----------------------------
// SAVE STUDENT
// -----------------------------
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

// -----------------------------
// UPDATE STUDENT
// -----------------------------
export const updateStudentOfflineLocal = async (updatedStudent: any) => {
  try {
    const existing = await AsyncStorage.getItem(STUDENT_KEY);
    const students = existing ? JSON.parse(existing) : [];

    const updatedStudents = students.map((student: any) =>
      student.id === updatedStudent.id ? updatedStudent : student,
    );

    await AsyncStorage.setItem(STUDENT_KEY, JSON.stringify(updatedStudents));
  } catch (error) {
    console.log("Error updating student offline", error);
  }
};

// -----------------------------
// GET STUDENTS
// -----------------------------
export const getOfflineStudents = async () => {
  try {
    const data = await AsyncStorage.getItem(STUDENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Error getting students", error);
    return [];
  }
};

// -----------------------------
// SAVE EVENT
// -----------------------------
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

// -----------------------------
// UPDATE EVENT
// -----------------------------
export const updateEventOfflineLocal = async (updatedEvent: any) => {
  try {
    const existing = await AsyncStorage.getItem(EVENT_KEY);
    const events = existing ? JSON.parse(existing) : [];

    const updatedEvents = events.map((event: any) =>
      event.id === updatedEvent.id ? updatedEvent : event,
    );

    await AsyncStorage.setItem(EVENT_KEY, JSON.stringify(updatedEvents));
  } catch (error) {
    console.log("Error updating event offline", error);
  }
};

// -----------------------------
// GET EVENTS
// -----------------------------
export const getOfflineEvents = async () => {
  try {
    const data = await AsyncStorage.getItem(EVENT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Error getting events", error);
    return [];
  }
};

// -----------------------------
// CLEAR DATA
// -----------------------------
export const clearOfflineData = async () => {
  await AsyncStorage.removeItem(STUDENT_KEY);
  await AsyncStorage.removeItem(EVENT_KEY);
};
