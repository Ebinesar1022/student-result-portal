/**
 * Frontend-Backend Communication Test Script
 * This utility helps verify all API endpoints are responding correctly
 */

import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5062/api";

interface TestResult {
  endpoint: string;
  method: string;
  status: "✅ PASS" | "❌ FAIL";
  statusCode?: number;
  error?: string;
  responseTime: number;
}

const results: TestResult[] = [];

// Test endpoints
const endpoints = [
  { method: "GET", path: "/classes", description: "Get all classes" },
  { method: "GET", path: "/students", description: "Get all students" },
  { method: "GET", path: "/teachers", description: "Get all teachers" },
  { method: "POST", path: "/auth/login", description: "Login endpoint (requires credentials)" },
  { method: "GET", path: "/marks", description: "Get marks" },
  { method: "GET", path: "/audit", description: "Get audit logs" },
];

export const runApiTests = async () => {
  console.log("🔍 Starting Frontend-Backend Connection Tests...\n");
  console.log(`Backend URL: ${API_BASE}\n`);

  for (const endpoint of endpoints) {
    const startTime = performance.now();
    const fullUrl = `${API_BASE}${endpoint.path}`;

    try {
      let response;
      
      if (endpoint.method === "GET") {
        response = await axios.get(fullUrl, { timeout: 5000 });
      } else if (endpoint.method === "POST") {
        // For POST endpoints, send dummy test data
        response = await axios.post(
          fullUrl,
          { username: "test", password: "test" },
          { timeout: 5000 }
        );
      } else {
        throw new Error(`Unsupported method: ${endpoint.method}`);
      }

      const responseTime = performance.now() - startTime;
      
      results.push({
        endpoint: endpoint.path,
        method: endpoint.method,
        status: "✅ PASS",
        statusCode: response?.status || 200,
        responseTime: Math.round(responseTime),
      });

      console.log(
        `✅ ${endpoint.method} ${endpoint.path} - ${response.status} (${Math.round(responseTime)}ms)`
      );
    } catch (error: any) {
      const responseTime = performance.now() - startTime;
      const errorMsg =
        error.response?.statusText ||
        error.message ||
        "Unknown error";

      results.push({
        endpoint: endpoint.path,
        method: endpoint.method,
        status: "❌ FAIL",
        statusCode: error.response?.status,
        error: errorMsg,
        responseTime: Math.round(responseTime),
      });

      console.log(
        `❌ ${endpoint.method} ${endpoint.path} - ${errorMsg} (${Math.round(responseTime)}ms)`
      );
    }
  }

  // Summary
  const passed = results.filter((r) => r.status === "✅ PASS").length;
  const failed = results.filter((r) => r.status === "❌ FAIL").length;
  const avgResponseTime = Math.round(
    results.reduce((sum, r) => sum + r.responseTime, 0) / results.length
  );

  console.log("\n" + "=".repeat(50));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(50));
  console.log(`✅ Passed: ${passed}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);
  console.log(`⏱️  Avg Response Time: ${avgResponseTime}ms`);
  console.log("=".repeat(50) + "\n");

  return {
    success: failed === 0,
    passed,
    failed,
    results,
    avgResponseTime,
  };
};

// Quick connectivity check
export const quickHealthCheck = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE}/classes`, { timeout: 5000 });
    return response.status === 200;
  } catch {
    return false;
  }
};
