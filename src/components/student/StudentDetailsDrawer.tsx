import {
  Drawer,
  Box,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import { CrudService } from "../../api/CrudService";
import { useState,useEffect } from "react";
import { Student } from "../../models/Student";
import "../../styles/studentDetailsDrawer.css";
import PageLoader from "../common/PageLoader";

interface Props {
  open: boolean;
  onClose: () => void;
  student: Student;
}

const StudentDetailsDrawer:React.FC<Props>=({
  open,
  onClose,
  student,
})=> {
  const [classes,setClasses]=useState<any[]>([]);
  useEffect(() => {
  CrudService.getClasses().then(setClasses);
}, []);
const className =
  classes.find(c => c.id === student.classId)?.className || "";
 if (!student) {
  return <PageLoader />;
}
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box className="student-drawer" sx={{ width: 320, p: 2 }}>
        <Typography variant="h6">Student Details</Typography>
        <Divider sx={{ my: 1 }} />

        <Stack spacing={1}>
          <Typography className="info-row"><b>Name:</b> {student.name}</Typography>
          <Typography className="info-row"><b>Roll No:</b> {student.rollNo}</Typography>
          <Typography className="info-row"><b>Class:</b> {className}</Typography>

          <Divider />

          <Typography className="info-row"><b>Gender:</b> {student.gender}</Typography>
          <Typography className="info-row"><b>Section:</b> {student.section.join(", ")}</Typography>
          <Typography className="info-row"><b>Phone:</b> {student.phone}</Typography>
          <Typography className="info-row"><b>Email:</b> {student.email}</Typography>
          <Typography className="info-row"><b>State:</b> {student.state}</Typography>
          <Typography className="info-row"><b>District:</b> {student.district}</Typography>
        </Stack>
      </Box>
    </Drawer>
  );
}
export default StudentDetailsDrawer;
