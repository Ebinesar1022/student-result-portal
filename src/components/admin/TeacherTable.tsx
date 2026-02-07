import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Teacher } from "../../models/Teacher";
import { CrudService } from "../../api/CrudService";
import EditTeacherDialog from "./EditTeacherDialog";
import AssignClassSubjectDialog from "./AssignClassSubjectDialog";
import { useState } from "react";

interface Props {
  teachers: Teacher[];
  refresh: () => void;
}

const TeacherTable = ({ teachers, refresh }: Props) => {
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [assignTeacher, setAssignTeacher] = useState<Teacher | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this teacher?")) return;
    await CrudService.delete(`/teachers/${id}`);
    refresh();
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Teacher No</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {teachers.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.name}</TableCell>
              <TableCell>{t.teacherNo}</TableCell>
              <TableCell>
                <IconButton onClick={() => setAssignTeacher(t)}>
                  <AssignmentIcon />
                </IconButton>
                <IconButton onClick={() => setEditTeacher(t)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(t.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editTeacher && (
        <EditTeacherDialog
          teacher={editTeacher}
          onClose={() => setEditTeacher(null)}
          refresh={refresh}
        />
      )}

      {assignTeacher && (
        <AssignClassSubjectDialog
          teacher={assignTeacher}
          onClose={() => setAssignTeacher(null)}
        />
      )}
    </>
  );
};

export default TeacherTable;
