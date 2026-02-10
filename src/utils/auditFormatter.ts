export const formatAuditValue = (value: any): string => {
  if (value === null || value === undefined) return "-";

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
      .join(" | ");
  }

  return String(value);
};
