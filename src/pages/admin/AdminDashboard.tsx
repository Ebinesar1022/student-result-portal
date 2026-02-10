import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const AdminDashboard = ({ darkMode, setDarkMode }: Props) => {
  const navigate = useNavigate();

  return (
    <>
      <Box p={4}>
        <Typography variant="h5" mb={3}>
          Admin Controls
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
      </Box>
    </>
  );
};

export default AdminDashboard;
