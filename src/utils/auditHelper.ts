import { AuditService } from "../services/AuditService";

export const auditCreate = (
  entityType: string,
  entityId: string,
  description: string
) => {
  AuditService.log("CREATE", entityType, entityId, description);
};

export const auditUpdate = (
  entityType: string,
  entityId: string,
  description: string
) => {
  AuditService.log("UPDATE", entityType, entityId, description);
};

export const auditDelete = (
  entityType: string,
  entityId: string,
  description: string
) => {
  AuditService.log("DELETE", entityType, entityId, description);
};

export const auditDownload = (
  entityType: string,
  entityId: string,
  description: string
) => {
  AuditService.log("DOWNLOAD", entityType, entityId, description);
};
