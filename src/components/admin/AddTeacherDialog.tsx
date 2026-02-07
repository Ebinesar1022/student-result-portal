import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import { CrudService } from "../../api/CrudService";

interface Props {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
}

const AddTeacherDialog = ({ open, onClose, refresh }: Props) => {
  const [name, setName] = useState("");
  const [teacherNo, setTeacherNo] = useState("");
  const [password, setPassword] = useState("");

  const handleSave = async () => {
    await CrudService.post("/teachers", {
      id: crypto.randomUUID(),
      name,
      teacherNo,
      password,
    });
    refresh();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Teacher</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Name" onChange={(e) => setName(e.target.value)} />
        <TextField fullWidth label="Teacher No" onChange={(e) => setTeacherNo(e.target.value)} />
        <TextField fullWidth label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTeacherDialog;
