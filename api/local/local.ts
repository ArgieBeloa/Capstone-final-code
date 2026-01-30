import AsyncStorage from "@react-native-async-storage/async-storage";

import { EventAttendance } from "@/api/events/utils";

// 🔑 Dynamic storage key per event
const getStorageKey = (eventId: string) => `localStudents_${eventId}`;

// 🔍 Logger helper
const log = (action: string, payload?: any) => {
  console.log(`[AsyncStorage] ${action}`, payload ?? "");
};

// 🔍 Debug all keys
export const debugStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const data = await AsyncStorage.multiGet(keys);
  log("DEBUG STORAGE", data);
};
// 📦 Load ALL local attendance (all events)
export const loadAllLocalAttendance = async (): Promise<
  Record<string, EventAttendance[]>
> => {
  try {
    log("LOADING ALL LOCAL ATTENDANCE...");

    const keys = await AsyncStorage.getAllKeys();

    // only keys that belong to attendance
    const attendanceKeys = keys.filter((k) => k.startsWith("localStudents_"));

    if (attendanceKeys.length === 0) {
      log("NO LOCAL ATTENDANCE FOUND");
      return {};
    }

    const entries = await AsyncStorage.multiGet(attendanceKeys);

    const result: Record<string, EventAttendance[]> = {};

    for (const [key, value] of entries) {
      if (!value) continue;

      try {
        const eventId = key.replace("localStudents_", "");
        result[eventId] = JSON.parse(value) as EventAttendance[];
      } catch (err) {
        console.error("[AsyncStorage] PARSE ERROR", key, err);
      }
    }

    log("ALL LOCAL ATTENDANCE LOADED", result);
    return result;
  } catch (error) {
    console.error("[AsyncStorage] LOAD ALL ERROR", error);
    return {};
  }
};

// 💾 Save (overwrite)
export const saveStudents = async (
  eventId: string,
  students: EventAttendance[],
): Promise<void> => {
  const key = getStorageKey(eventId);
  log(`SAVING students for event ${eventId}`, students);
  await AsyncStorage.setItem(key, JSON.stringify(students));
  log("SAVE COMPLETE");
};

// 📥 Load all students for event
export const loadStudents = async (
  eventId: string,
): Promise<EventAttendance[]> => {
  const key = getStorageKey(eventId);
  log(`READING students for event ${eventId}...`);
  const data = await AsyncStorage.getItem(key);

  if (!data) {
    log("NO DATA FOUND");
    return [];
  }

  try {
    const parsed = JSON.parse(data) as EventAttendance[];
    log("READ SUCCESS", parsed);
    return parsed;
  } catch (error) {
    console.error("[AsyncStorage] PARSE ERROR", error);
    return [];
  }
};

// ➕ Add student (prevent duplicate ID)
export const addStudent = async (
  eventId: string,
  student: EventAttendance,
): Promise<EventAttendance[]> => {
  log(`ADDING student to event ${eventId}`, student);

  const students = await loadStudents(eventId);

  if (students.some((s) => s.studentId === student.studentId)) {
    log("ADD FAILED: DUPLICATE ID", student.studentId);
    return students;
  }

  const updated = [...students, student];
  await saveStudents(eventId, updated);

  log("ADD COMPLETE", updated);
  return updated;
};

// ✏️ Update by student ID
export const updateStudentById = async (
  eventId: string,
  id: string,
  newValue: Partial<EventAttendance>,
): Promise<EventAttendance[]> => {
  log(`UPDATING student ${id} for event ${eventId}`, newValue);

  const students = await loadStudents(eventId);
  const updated = students.map((s) =>
    s.studentId === id ? { ...s, ...newValue } : s,
  );

  await saveStudents(eventId, updated);
  log("UPDATE COMPLETE", updated);

  return updated;
};

// ❌ Delete by event in local storage using eventID
export const deleteLocalAttendanceByEventId = async (
  eventId: string,
): Promise<void> => {
  try {
    const key = getStorageKey(eventId);

    log(`DELETING LOCAL ATTENDANCE for event ${eventId}...`);
    await AsyncStorage.removeItem(key);

    log("DELETE SUCCESS");
  } catch (error) {
    console.error("[AsyncStorage] DELETE ERROR", error);
  }
};

// 🧹 Clear all students for event
export const clearStudents = async (eventId: string) => {
  const key = getStorageKey(eventId);
  log(`CLEARING all students for event ${eventId}`);
  await AsyncStorage.removeItem(key);
};
