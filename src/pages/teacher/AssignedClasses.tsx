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

interface Assignment {
  id: string;
  classId: string;
  subject: string;
}

interface Class {
  id: string;
  className: string;
}

const AssignedClasses = ({ teacher }: Props) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classMap, setClassMap] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const ass = await CrudService.get<Assignment[]>(
        `/teacherAssignments?teacherId=${teacher.id}`
      );

      const classes = await CrudService.get<Class[]>(`/classes`);

      const map: Record<string, string> = {};
      classes.forEach((c) => {
        map[c.id] = c.className;
      });

      setAssignments(ass);
      setClassMap(map);
    };

    load();
  }, [teacher.id]);

  return (
    <Grid container spacing={2}>
      {assignments.map((a) => (
        <Grid  size={{ xs: 12, md: 4 }} key={a.id}>
          <Card>
            <CardContent>
              <Typography fontWeight={700}>
                Class: {classMap[a.classId] ?? a.classId}
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
};

export default AssignedClasses;
