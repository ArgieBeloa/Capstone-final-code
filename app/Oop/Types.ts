export interface EventAgenda {
  agendaTime: string;
  agendaTitle: string;
  agendaHost: string;
}

export interface EventStats {
  attending: number;
  interested: number;
}

export interface EventOrganizer {
  organizerName: string;
  organizerEmail: string;
}

export interface EventEvaluationDetail {
  evaluationQuestion: string | null;
  studentRate: number;
  studentSuggestion: string | null;
}

export interface EventPerformanceDetail {
  numberOfStudent: number;
  numberOfStudentRatedGive: number;
}

export interface Event {
  id: string;
  eventTitle: string;
  eventShortDescription: string;
  eventBody: string;
  allStudentAttending: number;
  eventDate: string;
  eventTime: string | null;
  eventLocation: string;
  eventCategory: string | null;
  eventTimeLength: string | null;
  eventAgendas: EventAgenda[] | null;
  eventStats: EventStats | null;
  eventOrganizer: EventOrganizer | null;
  eventEvaluationDetails: EventEvaluationDetail[] | null;
  eventPerformanceDetails: EventPerformanceDetail[] | null;
  eventAveragePerformance: number;
}
