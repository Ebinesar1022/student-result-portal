import { useEffect, useState } from "react";
import { CrudService } from "../../api/CrudService";
import {
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Student } from "../../models/Student";
import StudentDetailsDrawer from "./StudentDetailsDrawer";
import "../../styles/login.css";
import "../../styles/StudentDashboard.css";
import InfoIcon from "@mui/icons-material/Info";
import PageLoader from "../common/PageLoader";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props {
  rollNo: string;
  setSnackbar: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      message: string;
      severity: "success" | "error" | "warning" | "info";
    }>
  >;
}

const PASS_MARK = 35;
// const getPercentage = (subjects: { marks: number }[]) => {
//   const total = subjects.reduce((sum, s) => sum + s.marks, 0);
//   return Math.round(total / subjects.length);
// };

const StudentDashboard: React.FC<Props> = ({ rollNo, setSnackbar }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await CrudService.getStudentByRoll(rollNo);
      const cls = await CrudService.getClasses();
      setStudent(res);
      setClasses(cls);
      setSnackbar({
        open: true,
        message: "Student logged in successfully",
        severity: "success",
      });
    };
    load();
  }, [rollNo]);

  if (!student) return <PageLoader />;

  const isPass = student.subjects?.every((s) => s.marks >= PASS_MARK) ?? false;

  const className =
    classes.find((c) => c.id === student.classId)?.className || "N/A";
    const cls = classes.find((c) => c.id === student.classId);


  const getStatus = (marks: number) => (marks >= PASS_MARK ? "PASS" : "FAIL");

  const getGrade = (marks: number) => {
    if (marks < PASS_MARK) return "FAIL";
    if (marks >= 90) return "A";
    if (marks >= 75) return "B";
    if (marks >= 60) return "C";
    return "D";
  };

  const downloadMarksheet = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("New School", 105, 18, { align: "center" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("MARKSHEET", 105, 28, { align: "center" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Exam Name: ${cls?.examName || "N/A"}`, 105, 38, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    doc.text(`Name: ${student.name}`, 20, 42);
    doc.text(`Roll No: ${student.rollNo}`, 20, 50);
    doc.text(`Class: ${className}`, 20, 58);

    const tableData = student.subjects.map((s, i) => [
      i + 1,
      s.name,
      s.marks,
      getStatus(s.marks),
      getGrade(s.marks),
    ]);

    autoTable(doc, {
      startY: 65,
      head: [["S.No", "Subject", "Marks", "Status", "Grade"]],
      body: tableData,
      styles: { halign: "center" },
      headStyles: { fillColor: [25, 118, 210] },
    });

    doc.save(`${student.rollNo}_Marksheet.pdf`);
  };

  return (
    <Box className="landing-stu">
      <Box className="login-page">
        <Box className="student-dashboard-wrapper">
          <Paper elevation={3} className="student-dashboard-card">
            <Box
              className="student-header"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Box textAlign="center" mb={2}>
                <img
                  src={student.photo || "/images/default-avatar.png"}
                  alt="Student"
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid #1976d2",
                  }}
                />
              </Box>

              <Typography variant="h4">{student.name}</Typography>
              <Typography variant="h6">Roll No: {student.rollNo}</Typography>
              <Typography variant="h6">Class: {className}</Typography>

              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => setOpenDetails(true)}
                startIcon={<InfoIcon />}
              >
                DETAILS
              </Button>
            </Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Exam: <strong>{cls.examName}</strong>
            </Typography>

            <Typography
              mt={2}
              color={isPass ? "green" : "red"}
              fontWeight="bold"
            >
              Overall Result: {isPass ? "PASS" : "FAIL"}
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <Grid container justifyContent="center">
              <Box display="flex" gap={2} flexWrap="wrap">
                {student.subjects.map((sub) => {
                  const pass = sub.marks >= PASS_MARK;
                  return (
                    <Paper
                      elevation={4}
                      key={sub.name}
                      sx={{ p: 2, width: 150, textAlign: "center" }}
                    >
                      <Typography>{sub.name}</Typography>
                      <CircularProgress
                        variant="determinate"
                        value={sub.marks}
                        size={60}
                        thickness={4}
                      />
                      <Typography>{sub.marks}%</Typography>
                      <Typography color={pass ? "green" : "red"}>
                        {pass ? "PASS" : "FAIL"}
                      </Typography>
                    </Paper>
                  );
                })}
              </Box>
            </Grid>

            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={downloadMarksheet}
              >
                Download Marksheet (PDF)
              </Button>
            </Box>

            <StudentDetailsDrawer
              open={openDetails}
              onClose={() => setOpenDetails(false)}
              student={student}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentDashboard;
