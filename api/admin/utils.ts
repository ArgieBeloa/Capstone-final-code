import { EventModel } from "../events/model";
import { EvaluationQuestion } from "../events/utils";

export interface currentOfficer {
  studentId: string;
  studentName: string;
  studentNumber: string;
  canEditEvent: boolean;
  canAddEvent: boolean;
}

export interface ForgetPassword {
  studentNumber: string;
  newPassword: string;
}

export interface evaluationTemplates {
  id: string;
  templateName: string;
  evaluationQuestions: EvaluationQuestion[];
}
export interface approvalUpdateEvent extends EventModel {
  approve: boolean;
}
export const id = "6a324a76054e165bcb1dae54";
