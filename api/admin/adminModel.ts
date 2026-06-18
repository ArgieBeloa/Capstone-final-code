/*
  POSTMAN EXAMPLE
{
  "adminName": "Father Aguason",
  "currentOfficer": [
    
  ],
  "approvalUpdateEvents": [
    
  ],
  "evaluationTemplates": [
  ]
}
*/

import {
  approvalUpdateEvent,
  currentOfficer,
  evaluationTemplates,
} from "./utils";

export interface AdminModel {
  adminName: string;
  currentOfficer: currentOfficer[];
  evaluationTemplates: evaluationTemplates[];
  approvalUpdateEvents: approvalUpdateEvent[];
}
