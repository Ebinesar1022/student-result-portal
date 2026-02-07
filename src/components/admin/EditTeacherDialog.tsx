import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
} from "@mui/material";
import { Teacher } from "../../models/Teacher";
import { useState } from "react";
import { CrudService } from "../../api/CrudService";

interface Props {
  teacher: Teacher;
  onClose: () => void;
  refresh: () => void;
}

export default function EditTeacherDialog({ teacher, onClose, refresh }: Props) {
  const [form, setForm] = useState<Teacher>({ ...teacher });

  const handleSave = async () => {
    await CrudService.put(`/teachers/${teacher.id}`, form);
    refresh();
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle>Edit Teacher</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Name" margin="dense" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <TextField fullWidth label="Teacher No" margin="dense" value={form.teacherNo} />
        <TextField fullWidth label="Password" margin="dense" value={form.password} />
        <TextField fullWidth label="Phone" margin="dense" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <TextField fullWidth label="Email" margin="dense" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <TextField select fullWidth label="Gender" margin="dense" value={form.gender || ""} onChange={(e) => setForm({ ...form, gender: e.target.value as any })}>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </TextField>
        <TextField select fullWidth label="Marital Status" margin="dense" value={form.maritalStatus || ""} onChange={(e) => setForm({ ...form, maritalStatus: e.target.value as any })}>
          <MenuItem value="Single">Single</MenuItem>
          <MenuItem value="Married">Married</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
