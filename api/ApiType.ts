export interface StudentAttended {
  eventId: string
  eventTitle: string
  studentDateAttended: string
}

// events

interface EventAgendas {
  agendaTime: string;
  agendaTitle: string;
  agendaHost: string;
}

interface EventStats {
  attending: number;
  interested: number;
}
interface EventOrganizer {
  organizerName: string;
  organizerEmail: string;
}

interface EventEvaluationDetails {
  evaluationQuestion: string;
  studentRate: number;
  studentSuggestion: string;
}
interface EventPerformanceDetails {
  numberOfStudent: number;
  numberOfStudentGive: number;
}

export interface EventInterface {
  id: string;
  eventTitle: string;
  eventShortDescription: string;
  eventBody: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventCategory: string;
  eventTimeLength: string;
  eventAgendas: EventAgendas[];
  eventStats: EventStats;
  eventOrganizer: EventOrganizer;
  eventEvaluationDetails: EventEvaluationDetails[];
  eventPerformanceDetails: EventPerformanceDetails[];
  allStudentAttending: number;
};