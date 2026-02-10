import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { CrudService } from "../../api/CrudService";
import { Teacher } from "../../models/Teacher";
import TeacherTable from "../../components/admin/TeacherTable";
import AddTeacherDialog from "../../components/admin/AddTeacherDialog";

interface Props {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

const TeacherPage = ({ darkMode, setDarkMode }: Props) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [openAdd, setOpenAdd] = useState(false);

  const loadTeachers = async () => {
    const res = await CrudService.get<Teacher[]>("/teachers");
    setTeachers(res);
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  return (
    <>
      <Box p={3}>
        <Button variant="contained" onClick={() => setOpenAdd(true)}>
          Add Teacher
        </Button>

        <TeacherTable
          teachers={teachers}
          refresh={loadTeachers}
        />

        <AddTeacherDialog
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          refresh={loadTeachers}
        />
      </Box>
    </>
  );
};

export default TeacherPage;
