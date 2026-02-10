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
import { auditLog } from "../../utils/auditlog";
import { getCurrentUser } from "../../utils/currentUser";

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

const StudentDashboard: React.FC<Props> = ({ rollNo, setSnackbar }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [marks, setMarks] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [openDetails, setOpenDetails] = useState(false);

  useEffect(() => {
    if (!rollNo) return;

    const load = async () => {
      // 1️⃣ Get student
      const stuRes = await CrudService.get<Student[]>(
        `/students?rollNo=${rollNo}`,
      );

      if (!stuRes.length) return;

      const stu = stuRes[0];

      // 2️⃣ Get marks from marks table
      const marksRes = await CrudService.get<any[]>(
        `/marks?studentId=${stu.id}`,
      );

      // 3️⃣ Get classes
      const cls = await CrudService.getClasses();

      setStudent(stu);
      setMarks(marksRes);
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

  // 🔥 Merge subjects with marks table
  const subjectMarks = student.subjects.map((sub) => {
    const mark = marks.find((m) => m.subject === sub.name);
    return {
      name: sub.name,
      marks: mark ? mark.marks : 0,
    };
  });

  const isPass = subjectMarks.every((s) => s.marks >= PASS_MARK);

  const classObj = classes.find((c) => c.id === student.classId);
  const className = classObj?.className || "N/A";
  const examName = classObj?.examName || "N/A";
  const currentUser = getCurrentUser();


  const getStatus = (m: number) => (m >= PASS_MARK ? "PASS" : "FAIL");

  const getGrade = (m: number) => {
    if (m < PASS_MARK) return "FAIL";
    if (m >= 90) return "A";
    if (m >= 75) return "B";
    if (m >= 60) return "C";
    return "D";
  };

  const downloadMarksheet = async () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("New School", 105, 18, { align: "center" });

  doc.setFontSize(16);
  doc.text("MARKSHEET", 105, 28, { align: "center" });
  doc.text(`Exam: ${examName}`, 105, 38, { align: "center" });

  doc.line(20, 42, 190, 42);

  doc.setFontSize(12);
  doc.text(`Name: ${student.name}`, 20, 50);
  doc.text(`Roll No: ${student.rollNo}`, 20, 58);
  doc.text(`Class: ${className}`, 20, 66);

  const tableData = subjectMarks.map((s, i) => [
    i + 1,
    s.name,
    s.marks,
    getStatus(s.marks),
    getGrade(s.marks),
  ]);

  autoTable(doc, {
    startY: 75,
    head: [["S.No", "Subject", "Marks", "Status", "Grade"]],
    body: tableData,
    styles: { halign: "center" },
    headStyles: { fillColor: [25, 118, 210] },
  });

  doc.save(`${student.rollNo}_Marksheet.pdf`);

  /* ================= AUDIT LOG ================= */

  if (currentUser) {
    await auditLog({
      actorType: "STUDENT",
      actorId: student.id,
      actorName: student.name,
      actorCode: student.rollNo,

      action: "DOWNLOAD",
      entityType: "MARKSHEET",
      entityId: student.id,

      description: `Downloaded marksheet for ${examName}`,

      changes: [
        {
          field: "subjects",
          oldValue: null,
          newValue: subjectMarks.length,
        },
        {
          field: "result",
          oldValue: null,
          newValue: isPass ? "PASS" : "FAIL",
        },
      ],
    });
  }

  /* ============================================= */

  setSnackbar({
    open: true,
    message: "Marksheet downloaded successfully",
    severity: "success",
  });
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
                {" "}
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
                />{" "}
              </Box>
              <Typography variant="h4">{student.name}</Typography>
              <Typography variant="h6">Roll No: {student.rollNo}</Typography>
              <Typography variant="h6">Class: {className}</Typography>

              <Button
                variant="outlined"
                onClick={() => setOpenDetails(true)}
                startIcon={<InfoIcon />}
              >
                DETAILS
              </Button>
            </Box>

            <Typography mt={1}>
              Exam: <strong>{examName}</strong>
            </Typography>

            <Typography
              mt={2}
              fontWeight="bold"
              color={isPass ? "green" : "red"}
            >
              Overall Result: {isPass ? "PASS" : "FAIL"}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Grid container justifyContent="center">
              <Box display="flex" gap={2} flexWrap="wrap">
                {subjectMarks.map((sub) => {
                  const pass = sub.marks >= PASS_MARK;
                  return (
                    <Paper
                      key={sub.name}
                      sx={{ p: 2, width: 150, textAlign: "center" }}
                    >
                      <Typography>{sub.name}</Typography>
                      <CircularProgress
                        variant="determinate"
                        value={sub.marks}
                        size={60}
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
              <Button variant="contained" onClick={downloadMarksheet}>
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
