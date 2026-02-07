import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import AssignedClasses from "./AssignedClasses";
import { Teacher } from "../../models/Teacher";

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function TeacherDashboard({ darkMode, setDarkMode }: Props) {
  const location = useLocation();
  const teacher = location.state as Teacher;

  return (
    <>
      <Navbar title={`Welcome ${teacher.name}`} darkMode={darkMode} setDarkMode={setDarkMode} />
      <Box p={3}>
        <Typography variant="h6" mb={2}>
          Assigned Classes & Subjects
        </Typography>

        <AssignedClasses teacher={teacher} />
      </Box>
    </>
  );
}
