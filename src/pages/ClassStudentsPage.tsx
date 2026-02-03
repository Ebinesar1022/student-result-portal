import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Box,
  TextField,
  InputAdornment,
  Pagination,
  Typography,
  Stack
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { CrudService } from "../api/CrudService";
import StudentTable from "../components/admin/StudentTable";
import AddStudentDialog from "../components/admin/AddStudentDialog";
import EditStudentDialog from "../components/admin/EditStudentDialog";
import { ClassModel } from "../models/Class";
import { Student } from "../models/Student";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";
import SearchIcon from "@mui/icons-material/Search";
import "../styles/landing.css";
import ConfirmDialog from "../components/common/ConfirmDialog";

const ROWS_PER_PAGE = 5;

const ClassStudentsPage = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );

  const { id } = useParams();
  const classId = id as string;
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [cls, setCls] = useState<ClassModel | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [editData, setEditData] = useState<Student | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = async () => {
    const classes = await CrudService.getClasses();
    const found = classes.find((c) => c.id === classId) || null;
    setCls(found);

    const studs = await CrudService.getStudentsByClass(classId);
    setStudents(studs);
  };

  useEffect(() => {
    load();
  }, [load,classId]);

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase()),
    );
  }, [students, search]);

  const totalPages = Math.ceil(filteredStudents.length / ROWS_PER_PAGE);

  const paginatedStudents = filteredStudents.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  if (!cls) return <Typography>No class Found</Typography>;

  return (
    <React.Fragment>
      <Box className="landing-wrapper">
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Box display="flex" sx={{ ml: 3 }}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIosNewSharpIcon />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Box>
          <Stack direction="row" spacing={4} sx={{ ml: 4 }}>
            <Button variant="contained" onClick={() => setOpenAdd(true)}>
              Add Student to {cls.className}
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate(`/class/${classId}/marks`)}
            >
              Mark Details
            </Button>
          </Stack>
        </Box>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <TextField
            size="small"
            placeholder="Search by Name or Roll No"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{
              color: "#fff",
              minWidth: 220,
              "& .MuiInputBase-input": {
                color: "#fff",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "#fff",
                opacity: 1,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#fff",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#fff",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#fff",
              },

              "& .MuiSvgIcon-root": {
                color: "#fff",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <StudentTable
          students={paginatedStudents}
          onDelete={(id) => {
            setSelectedStudentId(id);
            setConfirmOpen(true);
          }}
          onEdit={(s) => setEditData(s)}
        />
        {confirmOpen && (
          <ConfirmDialog
            open={confirmOpen}
            title="Delete Student"
            message="Are you sure you want to delete this student?"
            onCancel={() => {
              setConfirmOpen(false);
              setSelectedStudentId(null);
            }}
            onConfirm={async () => {
              if (selectedStudentId !== null) {
                await CrudService.deleteStudent(selectedStudentId);
                load();
              }
              setConfirmOpen(false);
              setSelectedStudentId(null);
            }}
          />
        )}

        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}

        {openAdd && (
          <AddStudentDialog
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            classId={classId}
            classCode={cls.classCode}
            subjects={cls.subjects}
            refresh={load}
          />
        )}

        {editData && (
          <EditStudentDialog
            open={true}
            data={editData}
            onClose={() => setEditData(null)}
            refresh={load}
          />
        )}
      </Box>
    </React.Fragment>
  );
};

export default ClassStudentsPage;
