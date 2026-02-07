import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { CrudService } from "../../api/CrudService";
import { Teacher } from "../../models/Teacher";

interface Props {
  students: any[];
  marks: any[];
  teacher: Teacher;
  classId: string;
  subject: string;
  refresh: () => void;
}

export default function MarkEntryTable({
  students,
  marks,
  teacher,
  classId,
  subject,
  refresh,
}: Props) {
  const getMark = (studentId: string) =>
    marks.find((m) => m.studentId === studentId);

  const saveMark = async (studentId: string, value: number) => {
    const existing = getMark(studentId);

    if (existing) {
      await CrudService.put(`/marks/${existing.id}`, {
        ...existing,
        marks: value,
      });
    } else {
      await CrudService.post("/marks", {
        id: crypto.randomUUID(),
        studentId,
        classId,
        subject,
        marks: value,
        teacherId: teacher.id,
      });
    }
    refresh();
  };

  const deleteMark = async (studentId: string) => {
    const existing = getMark(studentId);
    if (!existing) return;

    if (!window.confirm("Delete this mark?")) return;
    await CrudService.delete(`/marks/${existing.id}`);
    refresh();
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Student Name</TableCell>
          <TableCell align="center">Marks</TableCell>
          <TableCell align="center">Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {students.map((s) => {
          const mark = getMark(s.id);

          return (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>

              <TableCell align="center">
                <TextField
                  type="number"
                  size="small"
                  defaultValue={mark?.marks ?? ""}
                  inputProps={{ min: 0, max: 100 }}
                  onBlur={(e) =>
                    saveMark(s.id, Number(e.target.value))
                  }
                />
              </TableCell>

              <TableCell align="center">
                <IconButton onClick={() => deleteMark(s.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
