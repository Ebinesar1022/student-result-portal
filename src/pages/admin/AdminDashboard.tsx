import React from "react";
import { Box, Button, Stack, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ApiDebugPanel from "../../components/common/ApiDebugPanel";
interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const AdminDashboard = ({ darkMode, setDarkMode }: Props) => {
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          background: "linear-gradient(135deg, #356f60, #99f2c8)",
          display: "flex",
          alignItems: "center", 
          justifyContent: "center", 
        }}
      >
        <Box
          sx={{
            p: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 900,
              borderRadius: 3,
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Admin Controls
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" mb={3}>
              Manage teachers, classes, and audit logs
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => navigate("/admin/teachers")}
              >
                Teachers
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate("/admin/classes")}
              >
                Classes
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate("/admin/audit")}
              >
                Audit
              </Button>
            </Stack>

            {/* API Debug Panel */}
            <Box sx={{ mt: 4 }}>
              <ApiDebugPanel />
            </Box>
          </Paper>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default AdminDashboard;
