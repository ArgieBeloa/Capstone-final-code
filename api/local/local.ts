import AsyncStorage from "@react-native-async-storage/async-storage";

import { EventAttendance } from "@/api/events/utils";
import { LocalEventAttendance } from "./localUtils";

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
  Record<string, LocalEventAttendance>
> => {
  try {
    const keys = await AsyncStorage.getAllKeys();

    const attendanceKeys = keys.filter((k) => k.startsWith("localStudents_"));

    const entries = await AsyncStorage.multiGet(attendanceKeys);

    const result: Record<string, LocalEventAttendance> = {};

    for (const [key, value] of entries) {
      if (!value) continue;

      const attendance = JSON.parse(value) as LocalEventAttendance;

      result[attendance.eventId] = attendance;
    }

    return result;
  } catch (e) {
    console.error(e);
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
// ADD local attenande for after use
export const saveAttendance = async (
  eventId: string,
  eventTitle: string,
  attendances: EventAttendance[],
) => {
  const key = `localStudents_${eventId}`;

  const data: LocalEventAttendance = {
    eventId,
    eventTitle,
    attendances,
  };

  await AsyncStorage.setItem(key, JSON.stringify(data));
};

// VIEW the local attenance
export const loadLocalAttendance = async (
  eventId: string,
): Promise<LocalEventAttendance | null> => {
  const key = `localStudents_${eventId}`;

  const data = await AsyncStorage.getItem(key);

  if (!data) return null;

  return JSON.parse(data);
};

// ➕ Add student (prevent duplicate ID)
export const addStudent = async (
  eventId: string,
  eventTitle: string,
  student: EventAttendance,
): Promise<LocalEventAttendance> => {
  log(`ADDING student to event ${eventId}`, student);

  const attendance = await loadLocalAttendance(eventId);

  // First student for this event
  if (!attendance) {
    const newAttendance: LocalEventAttendance = {
      eventId,
      eventTitle,
      attendances: [student],
    };

    await saveAttendance(eventId, eventTitle, newAttendance.attendances);

    log("ADD COMPLETE", newAttendance);

    return newAttendance;
  }

  // Prevent duplicates
  const exists = attendance.attendances.some(
    (s) =>
      s.studentId === student.studentId ||
      s.studentNumber === student.studentNumber,
  );

  if (exists) {
    log("ADD FAILED: STUDENT ALREADY EXISTS", student);
    return attendance;
  }

  attendance.attendances.push(student);

  await saveAttendance(
    attendance.eventId,
    attendance.eventTitle,
    attendance.attendances,
  );

  log("ADD COMPLETE", attendance);

  return attendance;
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
