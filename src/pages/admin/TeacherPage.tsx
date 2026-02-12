import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { CrudService } from "../../api/CrudService";
import { Teacher } from "../../models/Teacher";
import TeacherTable from "../../components/admin/TeacherTable";
import AddTeacherDialog from "../../components/admin/AddTeacherDialog";


const TeacherPage = () => {
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
  <Box
    sx={{
      minHeight: "100vh",
      width: "100%",
      background: "linear-gradient(135deg, #356f60, #99f2c8)",
      py: 6,
    }}
  >
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: 3,
      }}
    >
      {/* 🔹 HEADER ROW */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >

        <Button
          variant="contained"
          size="large"
          onClick={() => setOpenAdd(true)}
        >
          + Add Teacher
        </Button>
      </Box>

      <TeacherTable teachers={teachers} refresh={loadTeachers} />

      <AddTeacherDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        refresh={loadTeachers}
      />
    </Box>
  </Box>
);

};

export default TeacherPage;
