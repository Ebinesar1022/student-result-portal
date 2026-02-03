import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CrudService } from "../../api/CrudService";
import "../../styles/StudentDialog.css";

interface Props {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
}

const AddClassDialog = ({ open, onClose, refresh }: Props) => {
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setClassName("");
      setSubject("");
      setSubjects([]);
    }
  }, [open]);

  const addSubject = () => {
    if (!subject.trim()) return;

    if (subjects.includes(subject.trim())) {
      alert("Subject already added");
      return;
    }

    setSubjects([...subjects, subject.trim()]);
    setSubject("");
  };

  const addClass = async () => {
    if (!className.trim()) {
      alert("Class name is required");
      return;
    }

    if (subjects.length === 0) {
      alert("Add at least one subject");
      return;
    }
    if (!/^[A-Z]{3}\d{2}$/.test(classCode)) {
  alert("Class Code must be like STU07");
  return;
}


    await CrudService.addClass({
      className: className.trim(),
       classCode,
      subjects,
    });

    refresh();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Class</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Class Code (e.g. STU07)"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value.toUpperCase())}
          margin="normal"
        />

        <Stack direction="row" spacing={1} mt={2}>
          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
          />
          <Button onClick={addSubject}>Add</Button>
        </Stack>

        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
          {subjects.map((s, i) => (
            <Chip
              key={i}
              label={s}
              onDelete={() => setSubjects(subjects.filter((x) => x !== s))}
            />
          ))}
        </Stack>
        <Box className="dialog-actions">
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={addClass}
            fullWidth
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default AddClassDialog;
