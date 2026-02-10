export interface AuditLog {
  id: string;

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
    | "VIEW"
    | "DOWNLOAD";

  entityType: "AUTH" | "MARK" | "STUDENT" | "CLASS" | "SUBJECT";
  entityId: string;

  description: string;

  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];

  createdAt: string;
}
