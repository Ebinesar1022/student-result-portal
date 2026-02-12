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
import { validateField, regex } from "../../utils/validators";

interface Props {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
}

const AddTeacherDialog = ({ open, onClose, refresh }: Props) => {
  const [name, setName] = useState("");
  const [teacherNo, setTeacherNo] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    teacherNo: "",
    password: "",
  });

  const handleSave = async () => {
    let valid = true;
    const newErrors = { name: "", teacherNo: "", password: "" };

    if (!validateField(name.trim(), regex.name)) {
      newErrors.name = "Enter valid name (min 3 letters)";
      valid = false;
    }

    if (!validateField(teacherNo.trim(), regex.teacherNo)) {
      newErrors.teacherNo = "Format must be STAFF123";
      valid = false;
    }

    if (!validateField(password.trim(), regex.password)) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    await CrudService.post("/teachers", {
      id: crypto.randomUUID(),
      name: name.trim(),
      teacherNo: teacherNo.trim(),
      password: password.trim(),
    });

    refresh();
    onClose();

    setName("");
    setTeacherNo("");
    setPassword("");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Teacher</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          value={name}
          error={!!errors.name}
          helperText={errors.name}
          margin="dense"
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: "" });
          }}
        />

        <TextField
          fullWidth
          label="Teacher No"
          value={teacherNo}
          error={!!errors.teacherNo}
          helperText={errors.teacherNo}
          margin="dense"
          onChange={(e) => {
            setTeacherNo(e.target.value.toUpperCase());
            if (errors.teacherNo) setErrors({ ...errors, teacherNo: "" });
          }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          error={!!errors.password}
          helperText={errors.password}
          margin="dense"
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: "" });
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTeacherDialog;
