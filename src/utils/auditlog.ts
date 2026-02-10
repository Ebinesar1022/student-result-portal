import { AuditService } from "../services/AuditService";

export interface AuditPayload {
  actorType: "ADMIN" | "TEACHER" | "STUDENT";
  actorId: string;
  actorName: string;
  actorCode: string;

  action:
    | "LOGIN"
    | "LOGOUT"
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "DOWNLOAD";

  entityType: string;
  entityId: string;

  description: string;

  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export const auditLog = async (payload: AuditPayload) => {
  await AuditService.log({
    ...payload,
    createdAt: new Date().toISOString(),
  });
};
