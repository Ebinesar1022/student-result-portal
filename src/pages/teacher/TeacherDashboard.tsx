import { Box, Typography, Avatar, IconButton } from "@mui/material";
import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "../../components/common/Navbar";
import AssignedClasses from "./AssignedClasses";
import { Teacher } from "../../models/Teacher";
import TeacherProfileDrawer from "../../components/teacher/TeacherProfileDrawer";
import "../../styles/welcome.css";
import { CrudService } from "../../api/CrudService";

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function TeacherDashboard({ darkMode, setDarkMode }: Props) {
  const location = useLocation();

  const [teacher, setTeacher] = useState<Teacher>(
    location.state as Teacher
  );

  const [profileOpen, setProfileOpen] = useState(false);

  const refreshTeacher = async () => {
    const updated = await CrudService.get<Teacher>(`/teachers/${teacher.id}`);
    setTeacher(updated);

  };

  return (
    <React.Fragment>
      <Navbar
        title={`Welcome ${teacher.name}`}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <Box className="welcome-con" sx={{position:"relative",pt:5}}>
      <Box
        position="absolute"
        top={72}
        right={8}
        zIndex={1200}
      >
        <IconButton onClick={() => setProfileOpen(true)}>
          <Avatar sx={{ bgcolor: "primary.main"}}>
            {teacher.name.charAt(0)}
          </Avatar>
        </IconButton>
        <Typography variant="subtitle2" align="center">
          {teacher.name}
        </Typography>
      </Box>

      <Box p={3}>
        <Typography variant="h6" mb={2}>
          Assigned Classes & Subjects
        </Typography>

        <AssignedClasses teacher={teacher} />
      </Box>

      {/* 👤 PROFILE DRAWER */}
      <TeacherProfileDrawer
        open={profileOpen}
        teacher={teacher}
        onClose={() => setProfileOpen(false)}
        onUpdated={refreshTeacher}
      />
      </Box>
    </React.Fragment>
  );
}
