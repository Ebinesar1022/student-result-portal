import { CrudService } from "../api/CrudService";
import { AuditLog } from "../models/AuditLog";

export const AuditService = {
  log: async (data: any) => {
    try {
      await CrudService.post("/audit", data);
    } catch (e) {
      console.error("Audit failed", e);
    }
  },

  get: async (filters: any): Promise<AuditLog[]> => {
    const params = new URLSearchParams(filters).toString();
    return CrudService.get(`/audit?${params}`);
  },
};
