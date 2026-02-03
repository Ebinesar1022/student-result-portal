import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TableContainer,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Student } from "../../models/Student";
import "../../styles/landing.css";

const StudentTable=({
  students,
  onDelete,
  onEdit,
}: {
  students: Student[];
  onDelete: (id: number) => void;
  onEdit: (s: Student) => void;
})=> {
  return (
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
                <EditIcon />
              </IconButton>

              <IconButton
                onClick={() => {
                  if (!s.id) return;
                  onDelete(s.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </TableContainer>
  );
}
export default StudentTable;
