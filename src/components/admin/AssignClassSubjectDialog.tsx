import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import { ClassModel } from "../../models/Class";
import { useEffect, useState } from "react";
import { CrudService } from "../../api/CrudService";
import { Teacher } from "../../models/Teacher";

interface Props {
  teacher: Teacher;
  onClose: () => void;
}

export default function AssignClassSubjectDialog({ teacher, onClose }: Props) {
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassModel | null>(null);
  const [subject, setSubject] = useState<string>("");

  useEffect(() => {
    CrudService.get("/classes").then(setClasses);
  }, []);

  const handleAssign = async () => {
     if (!selectedClass || !subject) return;
    await CrudService.post("/teacherAssignments", {
      id: crypto.randomUUID(),
      teacherId: teacher.id,
      classId: selectedClass.id,
      subject,
    });
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth>
      <DialogTitle>Assign Class & Subject</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={classes}
          getOptionLabel={(o) => o.className}
          onChange={(_, v) => setSelectedClass(v)}
          renderInput={(params) => <TextField {...params} label="Class" />}
        />

        {selectedClass && (
          <Autocomplete<string>
            options={selectedClass.subjects}
            onChange={(_, v) => setSubject(v?? "")}
            renderInput={(params) => <TextField {...params} label="Subject" />}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAssign}  disabled={!selectedClass || !subject}>
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
}
