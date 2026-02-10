import { Box, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import { CrudService } from "../../api/CrudService";
import MarkEntryTable from "../../components/teacher/MarkEntryTable";
import { Teacher } from "../../models/Teacher";
import { Student } from "../../models/Student";
import { Mark } from "../../models/Marks";
import CommonSnackbar from "../../components/common/CommonSnackbar";

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function EnterMarksPage({ darkMode, setDarkMode }: Props) {
  const { classId, subject } = useParams();
  const location = useLocation();
  const teacher = location.state as Teacher;
  const [className, setClassName] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);

  const loadData = async () => {
    const studs = await CrudService.get<Student[]>(
      `/students?classId=${classId}`,
    );

    const mks = await CrudService.get<Mark[]>(
      `/marks?classId=${classId}&subject=${subject}`,
    );

    const classes =
      await CrudService.get<{ id: string; className: string }[]>(`/classes`);

    const cls = classes.find((c) => c.id === classId);

    setStudents(studs);
    setMarks(mks);
    setClassName(cls?.className ?? classId!);
  };

  useEffect(() => {
    loadData();
  }, [classId, subject]);

  return (
    <>
      <Navbar
        title={`Marks Entry – ${subject}`}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <Box p={3}>
        <Typography variant="h6" mb={2}>
          Class: {className} | Subject: {subject}
        </Typography>

        <MarkEntryTable
          students={students}
          marks={marks}
          teacher={teacher}
          classId={classId!}
          subject={subject!}
          refresh={loadData}
          setSnackbar={setSnackbar}
        />
        <CommonSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        />
      </Box>
    </>
  );
}
