import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { Teacher } from "../../models/Teacher";
import { useState } from "react";
import { CrudService } from "../../api/CrudService";

interface Props {
  open: boolean;
  teacher: Teacher;
  onClose: () => void;
  onUpdated: () => void;
}

const TeacherProfileDrawer = ({
  open,
  teacher,
  onClose,
  onUpdated,
}: Props) => {
  const [form, setForm] = useState<Teacher>({ ...teacher });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    await CrudService.put(`/teachers/${teacher.id}`, {
      ...teacher,
      phone: form.phone,
      email: form.email,
      gender: form.gender,
      maritalStatus: form.maritalStatus,
    });

    setLoading(false);
    onUpdated();
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box width={360} p={3} display="flex" flexDirection="column" height="100%">
        <Typography variant="h6" mb={2}>
          My Profile
        </Typography>

        {/* ❌ NOT EDITABLE */}
        <TextField
          label="Teacher Name"
          value={form.name}
          fullWidth
          margin="dense"
          disabled
        />

        <TextField
          label="Teacher No"
          value={form.teacherNo}
          fullWidth
          margin="dense"
          disabled
        />

        <TextField
          label="Password"
          type="password"
          value={form.password}
          fullWidth
          margin="dense"
          disabled
        />

        {/* ✅ EDITABLE */}
        <TextField
          label="Phone"
          value={form.phone || ""}
          fullWidth
          margin="dense"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <TextField
          label="Email"
          value={form.email || ""}
          fullWidth
          margin="dense"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <TextField
          select
          label="Gender"
          value={form.gender || ""}
          fullWidth
          margin="dense"
          onChange={(e) =>
            setForm({ ...form, gender: e.target.value as any })
          }
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </TextField>

        <TextField
          select
          label="Marital Status"
          value={form.maritalStatus || ""}
          fullWidth
          margin="dense"
          onChange={(e) =>
            setForm({ ...form, maritalStatus: e.target.value as any })
          }
        >
          <MenuItem value="Single">Single</MenuItem>
          <MenuItem value="Married">Married</MenuItem>
        </TextField>

        {/* FOOTER BUTTONS */}
        <Box mt="auto" display="flex" gap={2}>
          <Button fullWidth variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={handleUpdate}
            disabled={loading}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
export default TeacherProfileDrawer;
