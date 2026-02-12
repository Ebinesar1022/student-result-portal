import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  TableContainer,
  Paper,
  Box,
  TextField,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Teacher } from "../../models/Teacher";
import { CrudService } from "../../api/CrudService";
import EditTeacherDialog from "./EditTeacherDialog";
import AssignClassSubjectDialog from "./AssignClassSubjectDialog";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import React, { useState } from "react";
import "../../styles/audit-table.css";

interface Props {
  teachers: Teacher[];
  refresh: () => void;
}

const TeacherTable = ({ teachers, refresh }: Props) => {
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [assignTeacher, setAssignTeacher] = useState<Teacher | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this teacher?")) return;
    await CrudService.delete(`/teachers/${id}`);
    refresh();
  };
  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.teacherNo.toLowerCase().includes(search.toLowerCase()),
  );
  const paginatedTeachers = filteredTeachers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <React.Fragment>
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
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              label="Search by Name or Teacher No"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
                InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon color="action" />
        </InputAdornment>
      ),
    }}
            />
          </Box>

          <TableContainer className="audit-table-container">
            <Table className="audit-table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Teacher No</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedTeachers.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.name}</TableCell>
                    <TableCell>{t.teacherNo}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => setAssignTeacher(t)}
                      >
                        <AssignmentIcon />
                        <Button>Assign</Button>
                      </IconButton>
                      <IconButton
                        color="success"
                        onClick={() => setEditTeacher(t)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(t.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredTeachers.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
        </Paper>
      </Box>

      {editTeacher && (
        <EditTeacherDialog
          teacher={editTeacher}
          onClose={() => setEditTeacher(null)}
          refresh={refresh}
        />
      )}

      {assignTeacher && (
        <AssignClassSubjectDialog
          teacher={assignTeacher}
          onClose={() => setAssignTeacher(null)}
        />
      )}
    </React.Fragment>
  );
};

export default TeacherTable;
