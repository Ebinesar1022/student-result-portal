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
  Avatar,
  Typography,
  Drawer,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import OTP from "../common/OTP";
import ConfirmDialog from "../common/ConfirmDialog";
import TableSkeleton from "../common/TableSkeleton";
import AddClassDialog from "./AddClassDialog";
import EditClassDialog from "./EditClassDialog";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { CrudService } from "../../api/CrudService";
import { ClassModel } from "../../models/Class";
import "../../styles/landing.css";
import AdminProfile from "./AdminProfile";
interface Props {
  setSnackbar: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      message: string;
      severity: "success" | "error" | "warning" | "info";
    }>
  >;
}

const ClassManager: React.FC<Props> = ({ setSnackbar }) => {
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [deleteClass, setDeleteClass] = useState<ClassModel | null>(null);
  const [editClass, setEditClass] = useState<ClassModel | null>(null);

  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);

    const data = await CrudService.getClasses();

    const sorted = [...data].sort((a, b) =>
      a.classCode.localeCompare(b.classCode),
    );

    setClasses(sorted);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const deleteClassWithStudents = async (classId: string) => {
    const students = await CrudService.getStudentsByClass(classId);

    await Promise.all(
      students.map((s) => CrudService.delete(`/students/${s.id}`)),
    );

    await CrudService.delete(`/classes/${classId}`);
    load();
  };

  if (loading) {
    return <TableSkeleton rows={4} columns={3} />;
  }

  return (
    <Box className="landing-wrapper">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 900,
          mx: "auto",
          width: "100%",
          minHeight: 48,
        }}
      >
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          size="small"
          sx={{
            px: 1.5,
            py: 0.5,
            fontSize: "0.75rem",
            minHeight: 30,
          }}
          startIcon={<ArrowBackIosIcon />}
        >
          Back
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{
            px: 1.5,
            py: 0.5,
            fontSize: "0.75rem",
            minHeight: 30,
          }}
          startIcon={<AddBoxIcon />}
          onClick={() => setOpenAdd(true)}
        >
          ADD CLASS
        </Button>
        <Box
          onClick={() => setProfileOpen(true)}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
            p: 1,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.05)",
            },
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#1976d2",
            }}
          >
            A
          </Avatar>

          <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 500 }}>
            Admin
          </Typography>
        </Box>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 400,
          maxWidth: 1000,
          mx: "auto",
          mt: 5,
          borderRadius: 2,
          boxShadow: 10,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ width: "15%", bgcolor: "#70bfe9", fontSize: 20 }}
                align="center"
                width="20%"
              >
                <strong>Class</strong>
              </TableCell>
              <TableCell
                sx={{ width: "35%", bgcolor: "#70bfe9", fontSize: 20 }}
                align="center"
                width="50%"
              >
                <strong>Subjects</strong>
              </TableCell>
              <TableCell
                sx={{ width: "22%", bgcolor: "#70bfe9", fontSize: 20 }}
                align="center"
                width="30%"
              >
                <strong>Exam Name</strong>
              </TableCell>
              <TableCell
                sx={{ width: "28%", bgcolor: "#70bfe9", fontSize: 20 }}
                align="center"
                width="30%"
              >
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {classes.map((c) => (
              <TableRow key={c.id}>
                <TableCell sx={{ fontSize: 16 }} align="center">
                  {c.className}
                </TableCell>

                <TableCell sx={{ fontSize: 16 }} align="center">
                  {c.subjects.join(", ")}
                </TableCell>

                <TableCell sx={{ fontSize: 16 }} align="center">
                  {c.examName || "-"}
                </TableCell>

                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/class/${c.id}/students`)}
                    sx={{ mr: 1 }}
                  >
                    Add Student
                  </Button>

                  <IconButton color="primary" onClick={() => setEditClass(c)}>
                    <EditIcon />
                  </IconButton>

                  <IconButton color="error" onClick={() => setDeleteClass(c)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Drawer
        anchor="right"
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      >
        <Box sx={{ width: 380, p: 3 }}>
          <AdminProfile onClose={() => setProfileOpen(false)} />
        </Box>
      </Drawer>

      <AddClassDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        refresh={load}
        setSnackbar={setSnackbar}
      />

      {editClass && (
        <EditClassDialog
          open
          selectedClass={editClass}
          onClose={() => setEditClass(null)}
          refresh={load}
          setSnackbar={setSnackbar}
        />
      )}

      {deleteClass && (
        <ConfirmDialog
          open
          title="Delete Class"
          message={`Are you sure you want to delete ${deleteClass.className}?`}
          onCancel={() => setDeleteClass(null)}
          onConfirm={() => {
            const adminEmail = localStorage.getItem("adminEmail");
            if (!adminEmail) {
              alert("Admin email not verified. Go to Admin Profile.");
              return;
            }
            setOtpOpen(true);
          }}
        />
      )}
      {deleteClass && (
        <OTP
          open={otpOpen}
          email={localStorage.getItem("adminEmail")!}
          onClose={() => setOtpOpen(false)}
          onSuccess={async () => {
            await deleteClassWithStudents(deleteClass.id);
            setSnackbar({
              open: true,
              message: "Class deleted successfully",
              severity: "warning",
            });
            setOtpOpen(false);
            setDeleteClass(null);
          }}
        />
      )}
    </Box>
  );
};

export default ClassManager;
