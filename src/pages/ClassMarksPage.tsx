import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Typography,
  Button,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CrudService } from "../api/CrudService";
import Navbar from "../components/common/Navbar"
import { ClassModel } from "../models/Class";
import { Student } from "../models/Student";
import "../styles/landing.css";

interface Props {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const PASS_MARK = 35;

type FilterType = "ALL" | "PASS" | "FAIL" | "ABOVE_50" | "ABOVE_90" | "CENTUM";


const getOverallStatus = (subjects: any[]) =>
  subjects.every((s) => s.marks >= PASS_MARK) ? "PASS" : "FAIL";

const getOverallGrade = (subjects: any[]) => {
  if (subjects.some((s) => s.marks < PASS_MARK)) return "FAIL";

  const avg = subjects.reduce((sum, s) => sum + s.marks, 0) / subjects.length;

  if (avg >= 90) return "A";
  if (avg >= 75) return "B";
  if (avg >= 60) return "C";
  return "D";
};

const getMark = (subjects: any[], subject: string) =>
  subjects.find((s) => s.name === subject)?.marks ?? "-";


const ClassMarksPage: React.FC<Props> = ({ darkMode, setDarkMode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [cls, setCls] = useState<ClassModel | null>(null);
  const [filter, setFilter] = useState<FilterType>("ALL");

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const classes = await CrudService.getClasses();
      const foundClass = classes.find((c) => c.id === id) || null;
      setCls(foundClass);

      const studs = await CrudService.getStudentsByClass(id);
      setStudents(studs);
    };

    load();
  }, [id]);

  if (!cls) return null;


  const filteredStudents = students.filter((student) => {
    const status = getOverallStatus(student.subjects);
    const avg =
      student.subjects.reduce((a: number, b: any) => a + b.marks, 0) /
      student.subjects.length;

    switch (filter) {
      case "PASS":
        return status === "PASS";
      case "FAIL":
        return status === "FAIL";
      case "ABOVE_50":
        return avg >= 50;
      case "ABOVE_90":
        return avg >= 90;
      case "CENTUM":
        return student.subjects.some((s: any) => s.marks === 100);
      default:
        return true;
    }
  });

  return (
    <>
      <Navbar
        title={`${cls.className} - Mark Details`}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <Box className="landing-wrap">
        <Box p={3}>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Back
          </Button>

          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              startAdornment={<FilterListIcon sx={{ mr: 1, color: "#fff" }} />}
              sx={{
                color: "#fff", 
                minWidth: 220,

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
            >
              <MenuItem value="ALL">All Students</MenuItem>
              <MenuItem value="PASS">Pass</MenuItem>
              <MenuItem value="FAIL">Fail</MenuItem>
              <MenuItem value="ABOVE_50">Above 50%</MenuItem>
              <MenuItem value="ABOVE_90">Above 90%</MenuItem>
              <MenuItem value="CENTUM">Centum</MenuItem>
            </Select>
          </Box>

          <TableContainer component={Paper} elevation={6}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Roll No</b>
                  </TableCell>

                  {cls.subjects.map((sub) => (
                    <TableCell key={sub} align="center">
                      <b>{sub}</b>
                    </TableCell>
                  ))}

                  <TableCell align="center">
                    <b>Status</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Grade</b>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredStudents.map((s) => {
                  const status = getOverallStatus(s.subjects);
                  const grade = getOverallGrade(s.subjects);

                  return (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.rollNo}</TableCell>

                      {cls.subjects.map((sub) => (
                        <TableCell key={sub} align="center">
                          {getMark(s.subjects, sub)}
                        </TableCell>
                      ))}

                      <TableCell
                        align="center"
                        sx={{
                          color: status === "PASS" ? "green" : "red",
                          fontWeight: 700,
                        }}
                      >
                        {status}
                      </TableCell>

                      <TableCell align="center">
                        <Typography fontWeight={700}>{grade}</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default ClassMarksPage;
