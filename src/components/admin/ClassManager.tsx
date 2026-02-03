import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Box,
  TableContainer,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";

import ConfirmDialog from "../common/ConfirmDialog";
import TableSkeleton from "../common/TableSkeleton";
import AddClassDialog from "./AddClassDialog";
import EditClassDialog from "./EditClassDialog";

import { CrudService } from "../../api/CrudService";
import { ClassModel } from "../../models/Class";
import "../../styles/landing.css";

const ClassManager = () => {
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteClass, setDeleteClass] = useState<ClassModel | null>(null);
  const [editClass, setEditClass] = useState<ClassModel | null>(null);

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);

    const data = await CrudService.getClasses();

    // ✅ SORT BY CLASS CODE (ASCENDING)
    const sorted = [...data].sort((a, b) =>
      a.classCode.localeCompare(b.classCode)
    );

    setClasses(sorted);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const deleteClassWithStudents = async (classId: string) => {
    const students = await CrudService.getStudentsByClass(classId);
    await Promise.all(students.map((s) => CrudService.deleteStudent(s.id)));
    await CrudService.deleteClass(classId);
    load();
  };

  if (loading) {
    return <TableSkeleton rows={4} columns={3} />;
  }

  return (
    <Box className="landing-wrapper">
      <Button onClick={() => navigate(-1)}>← Back</Button>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        startIcon={<AddBoxIcon />}
        onClick={() => setOpenAdd(true)}
      >
        ADD CLASS
      </Button>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 400,
          maxWidth: 900,
          mx: "auto",
          mt: 5,
          borderRadius: 2,
          boxShadow: 10,
        }}
      >
        <Table stickyHeader>
          <TableHead sx={{ bgcolor: "#8ec4dd" }}>
            <TableRow sx={{bgcolor:"#723a7c"}}>
              <TableCell align="center" width="20%">
                Class
              </TableCell>
              <TableCell align="center" width="50%">
                Subjects
              </TableCell>
              <TableCell align="center" width="30%">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {classes.map((c) => (
              <TableRow key={c.id}>
                <TableCell align="center">{c.className}</TableCell>
                <TableCell align="center">
                  {c.subjects.join(", ")}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate(`/class/${c.id}/students`)
                    }
                  >
                    Add Student
                  </Button>

                  <IconButton
                    color="primary"
                    onClick={() => setEditClass(c)}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => setDeleteClass(c)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddClassDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        refresh={load}
      />

      {editClass && (
        <EditClassDialog
          open
          selectedClass={editClass}
          onClose={() => setEditClass(null)}
          refresh={load}
        />
      )}

      {deleteClass && (
        <ConfirmDialog
          open
          title="Delete Class"
          message={`Are you sure you want to delete ${deleteClass.className}?`}
          onCancel={() => setDeleteClass(null)}
          onConfirm={async () => {
            await deleteClassWithStudents(deleteClass.id);
            setDeleteClass(null);
          }}
        />
      )}
    </Box>
  );
};

export default ClassManager;
