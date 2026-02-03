import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Chip,
  Stack
} from "@mui/material";
import { useEffect, useState } from "react";
import { ClassModel } from "../../models/Class";
import { CrudService } from "../../api/CrudService";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedClass: ClassModel | null;
  refresh: () => void;
}

const EditClassDialog = ({
  open,
  onClose,
  selectedClass,
  refresh
}: Props) => {
  const [className, setClassName] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (selectedClass) {
      setClassName(selectedClass.className);
      setSubjects(selectedClass.subjects);
    }
  }, [selectedClass]);

  // 🔁 Merge class subjects with student subjects
  const mergeSubjects = (
    classSubjects: string[],
    studentSubjects: { name: string; marks: number }[]
  ) => {
    return classSubjects.map((sub) => {
      const existing = studentSubjects.find((s) => s.name === sub);
      return existing ? existing : { name: sub, marks: 0 };
    });
  };

  const updateClass = async () => {
    if (!selectedClass) return;

  
    await CrudService.updateClass(selectedClass.id, {
      ...selectedClass,
      className,
      subjects
    });

  
    const students = await CrudService.getStudentsByClass(selectedClass.id);

  
    await Promise.all(
      students.map((student: any) =>
        CrudService.updateStudent(student.id, {
          ...student,
          subjects: mergeSubjects(subjects, student.subjects || [])
        })
      )
    );

    refresh();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Class</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          margin="normal"
        />

        <Stack direction="row" spacing={1}>
          <TextField
            label="Add Subject"
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
          />
          <Button
            onClick={() => {
              const value = subjectInput.trim();
              if (!value || subjects.includes(value)) return;
              setSubjects([...subjects, value]);
              setSubjectInput("");
            }}
          >
            Add
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
          {subjects.map((s, index) => (
            <Chip
              key={index}
              label={s}
              onDelete={() =>
                setSubjects(subjects.filter((sub) => sub !== s))
              }
            />
          ))}
        </Stack>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={updateClass}
          disabled={!className.trim() || subjects.length === 0}
        >
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditClassDialog;
