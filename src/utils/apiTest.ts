/**
 * Frontend-backend communication test helpers used by ApiDebugPanel.
 */

import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5062/api";

interface TestEndpoint {
  method: "GET" | "POST";
  path: string;
  description: string;
  payload?: Record<string, unknown>;
}

interface TestResult {
  endpoint: string;
  method: string;
  status: "PASS" | "FAIL";
  statusCode?: number;
  error?: string;
  responseTime: number;
}

const endpoints: TestEndpoint[] = [
  { method: "GET", path: "/classes", description: "Get all classes" },
  { method: "GET", path: "/students", description: "Get all students" },
  { method: "GET", path: "/teachers", description: "Get all teachers" },
  {
    method: "POST",
    path: "/auth/login",
    description: "Login endpoint",
    payload: { username: "admin", password: "admin123" },
  },
  { method: "GET", path: "/marks", description: "Get marks" },
  { method: "GET", path: "/audit", description: "Get audit logs" },
];

export const runApiTests = async () => {
  const results: TestResult[] = [];

  for (const endpoint of endpoints) {
    const startTime = performance.now();
    const fullUrl = `${API_BASE}${endpoint.path}`;

    try {
      let response;

      if (endpoint.method === "GET") {
        response = await axios.get(fullUrl, { timeout: 5000 });
      } else {
        response = await axios.post(fullUrl, endpoint.payload ?? {}, {
          timeout: 5000,
        });
      }

      results.push({
        endpoint: endpoint.path,
        method: endpoint.method,
        status: "PASS",
        statusCode: response.status,
        responseTime: Math.round(performance.now() - startTime),
      });
    } catch (error: any) {
      results.push({
        endpoint: endpoint.path,
        method: endpoint.method,
        status: "FAIL",
        statusCode: error.response?.status,
        error: error.response?.statusText || error.message || "Unknown error",
        responseTime: Math.round(performance.now() - startTime),
      });
    }
  }

  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const avgResponseTime = Math.round(
    results.reduce((sum, r) => sum + r.responseTime, 0) / results.length,
  );

  return {
    success: failed === 0,
    passed,
    failed,
    results,
    avgResponseTime,
  };
};

export const quickHealthCheck = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE}/classes`, { timeout: 5000 });
    return response.status === 200;
  } catch {
    return false;
  }
};
