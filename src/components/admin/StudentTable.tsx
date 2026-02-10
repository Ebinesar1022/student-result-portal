import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TableContainer,
  Paper,
  Button, Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StudentDetailsDrawer from "../student/StudentDetailsDrawer";
import React, { useState } from "react";
import { Student } from "../../models/Student";
import "../../styles/landing.css";

const StudentTable=({
  students,
  onDelete,
  onEdit,
}: {
  students: Student[];
  onDelete: (id: string) => void;
  onEdit: (s: Student) => void;
})=> {
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // const handleOpenDetails = (student: Student) => {
  //   setSelectedStudent(student);
  //   setOpenDetails(true);
  // };

  return (
    <React.Fragment>
     <TableContainer
        component={Paper}
        sx={{
          maxHeight: 400,
          maxWidth: 800,
          mx: "auto",
          borderRadius: 2,
          boxShadow: 10,
          mt:5
        }}>
    <Table size="small">
      <TableHead>
        <TableRow sx={{bgcolor:"#78ece0"}}>
          <TableCell>Name</TableCell>
          <TableCell>Roll No</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {students.map((s) => (
          <TableRow key={s.id}>
            <TableCell>{s.name}</TableCell>
            <TableCell>{s.rollNo}</TableCell>
            <TableCell>
              <IconButton onClick={() => onEdit(s)}>
                <EditIcon sx={{color:"blue"}} />
              </IconButton>

              <IconButton
                onClick={() => {
                  if (!s.id) return;
                  onDelete(s.id);
                }}
              >
                <DeleteIcon sx={{color:"red"}} />
              </IconButton>
               <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => {setOpenDetails(true); setSelectedStudent(s);}}
                startIcon={<InfoIcon />}
              >
                DETAILS
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </TableContainer>
    {selectedStudent && (
  <StudentDetailsDrawer
    open={openDetails}
    onClose={() => setOpenDetails(false)}
    student={selectedStudent}
  />
)}
</React.Fragment>
  );
}
export default StudentTable;
