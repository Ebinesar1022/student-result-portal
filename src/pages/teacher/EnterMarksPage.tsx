import { Box, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import { CrudService } from "../../api/CrudService";
import MarkEntryTable from "../../components/teacher/MarkEntryTable";
import { Teacher } from "../../models/Teacher";

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function EnterMarksPage({ darkMode, setDarkMode }: Props) {
  const { classId, subject } = useParams();
  const location = useLocation();
  const teacher = location.state as Teacher;

  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<any[]>([]);

  const loadData = async () => {
    const studs = await CrudService.get(`/students?classId=${classId}`);
    const mks = await CrudService.get(
      `/marks?classId=${classId}&subject=${subject}`
    );

    setStudents(studs);
    setMarks(mks);
  };

  useEffect(() => {
    loadData();
  }, [classId, subject]);

  return (
    <>
      <Navbar title={`Marks Entry – ${subject}`} darkMode={darkMode} setDarkMode={setDarkMode} />
      <Box p={3}>
        <Typography variant="h6" mb={2}>
          Class: {classId} | Subject: {subject}
        </Typography>

        <MarkEntryTable
          students={students}
          marks={marks}
          teacher={teacher}
          classId={classId!}
          subject={subject!}
          refresh={loadData}
        />
      </Box>
    </>
  );
}
