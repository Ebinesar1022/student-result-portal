import React, { useState } from "react";
import { Button, Box, Paper, Typography, CircularProgress, Alert } from "@mui/material";
import { runApiTests, quickHealthCheck } from "../../utils/apiTest";

const ApiDebugPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const handleRunTests = async () => {
    setLoading(true);
    try {
      const results = await runApiTests();
      setTestResults(results);
    } catch (error) {
      console.error("Test execution error:", error);
      setTestResults({
        success: false,
        error: "Failed to run tests",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCheck = async () => {
    setLoading(true);
    try {
      const connected = await quickHealthCheck();
      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        m: 2,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        border: "2px dashed #ccc",
      }}
    >
      <Typography variant="h6" gutterBottom>
        🔧 API Debug Panel
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleQuickCheck}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Quick Health Check"}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRunTests}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Run Full Tests"}
        </Button>
      </Box>

      {isConnected !== null && (
        <Alert severity={isConnected ? "success" : "error"} sx={{ mb: 2 }}>
          {isConnected
            ? "✅ Backend is reachable!"
            : "❌ Backend is not responding. Check if the server is running on port 5062"}
        </Alert>
      )}

      {testResults && (
        <Box
          sx={{
            backgroundColor: "#fff",
            p: 2,
            borderRadius: 1,
            fontFamily: "monospace",
            fontSize: "12px",
            maxHeight: "400px",
            overflowY: "auto",
            border: "1px solid #ddd",
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Test Results:
          </Typography>
          <Typography
            component="div"
            sx={{
              color: testResults.success ? "#4caf50" : "#f44336",
              fontWeight: "bold",
            }}
          >
            {testResults.success
              ? `✅ All tests passed (${testResults.passed}/${testResults.passed + testResults.failed})`
              : `❌ ${testResults.failed} test(s) failed`}
          </Typography>
          <Typography component="div" sx={{ mt: 1, color: "#666" }}>
            Average response time: {testResults.avgResponseTime}ms
          </Typography>

          {testResults.results && (
            <Box sx={{ mt: 2 }}>
              {testResults.results.map((result: any, idx: number) => (
                <Typography key={idx} component="div" sx={{ color: result.status === "✅ PASS" ? "#4caf50" : "#f44336" }}>
                  {result.status} {result.method} {result.endpoint} ({result.responseTime}ms)
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default ApiDebugPanel;
