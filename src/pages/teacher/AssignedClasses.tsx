import Grid from "@mui/material/Grid";
import {
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CrudService } from "../../api/CrudService";
import { Teacher } from "../../models/Teacher";
import { useNavigate } from "react-router-dom";

interface Props {
  teacher: Teacher;
}

export default function AssignedClasses({ teacher }: Props) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    CrudService.get(`/teacherAssignments?teacherId=${teacher.id}`).then(
      setAssignments
    );
  }, [teacher.id]);

  return (
    <Grid container spacing={2}>
      {assignments.map((a) => (
        <Grid size={{ xs: 12, md: 4 }}key={a.id}>
          <Card>
            <CardContent>
              <Typography fontWeight={700}>
                Class ID: {a.classId}
              </Typography>

              <Typography mb={2}>
                Subject: {a.subject}
              </Typography>

              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/teacher/marks/${a.classId}/${a.subject}`, {
                    state: teacher,
                  })
                }
              >
                Enter Marks
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
