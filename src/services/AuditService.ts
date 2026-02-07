import { CrudService } from "../api/CrudService";

export const AuditService = {
  log: async (
    action: string,
    entityType: string,
    entityId: string,
    description: string
  ) => {
    try {
      await CrudService.post("/audit", {
        action,
        entityType,
        entityId,
        description,
      });
    } catch (e) {
      console.error("Audit failed", e);
    }
  },
};
