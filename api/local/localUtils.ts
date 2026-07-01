import { EventAttendance } from "../events/utils";

export interface LocalEventAttendance {
  eventId: string;
  eventTitle: string;
  attendances: EventAttendance[];
}
