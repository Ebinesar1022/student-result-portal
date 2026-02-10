import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ClassModel } from "../../models/Class";
import { CrudService } from "../../api/CrudService";
import { auditLog } from "../../utils/auditlog";
import { getCurrentUser } from "../../utils/currentUser";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedClass: ClassModel | null;
  refresh: () => void;
  setSnackbar: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      message: string;
      severity: "success" | "error" | "warning" | "info";
    }>
  >;
}

const EditClassDialog = ({
  open,
  onClose,
  selectedClass,
  refresh,
  setSnackbar,
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

  // 🔁 merge subjects with student subjects
  const mergeSubjects = (
    classSubjects: string[],
    studentSubjects: { name: string; marks: number }[],
  ) => {
    return classSubjects.map((sub) => {
      const existing = studentSubjects.find((s) => s.name === sub);
      return existing ? existing : { name: sub, marks: 0 };
    });
  };

  const updateClass = async () => {
    if (!selectedClass) return;

    const user = getCurrentUser();

    // 🔒 OLD STATE
    const oldClassName = selectedClass.className;
    const oldSubjects = [...selectedClass.subjects];

    // 🔓 NEW STATE
    const newClassName = className.trim();
    const newSubjects = subjects;

    // 🧾 UPDATE CLASS
    await CrudService.updateClass(selectedClass.id, {
      ...selectedClass,
      className: newClassName,
      subjects: newSubjects,
    });

    // ✏️ AUDIT: CLASS NAME UPDATE
    if (oldClassName !== newClassName) {
      await auditLog({
        actorType: "ADMIN",
        actorId: user.id,
        actorName: user.name,
        actorCode: user.code,

        action: "UPDATE",
        entityType: "CLASS",
        entityId: selectedClass.id,

        description: `Updated class name from ${oldClassName} to ${newClassName}`,

        changes: [
          {
            field: "className",
            oldValue: oldClassName,
            newValue: newClassName,
          },
        ],
      });
    }

    // ➕ AUDIT: SUBJECTS ADDED
    const addedSubjects = newSubjects.filter((s) => !oldSubjects.includes(s));

    if (addedSubjects.length > 0) {
      await auditLog({
        actorType: "ADMIN",
        actorId: user.id,
        actorName: user.name,
        actorCode: user.code,

        action: "UPDATE",
        entityType: "CLASS",
        entityId: selectedClass.id,

        description: `Added subject(s): ${addedSubjects.join(", ")}`,

        changes: [
          {
            field: "subjects",
            oldValue: oldSubjects,
            newValue: newSubjects,
          },
        ],
      });
    }

    // ❌ AUDIT: SUBJECTS REMOVED
    const removedSubjects = oldSubjects.filter((s) => !newSubjects.includes(s));

    if (removedSubjects.length > 0) {
      await auditLog({
        actorType: "ADMIN",
        actorId: user.id,
        actorName: user.name,
        actorCode: user.code,

        action: "UPDATE",
        entityType: "CLASS",
        entityId: selectedClass.id,

        description: `Removed subject(s): ${removedSubjects.join(", ")}`,

        changes: [
          {
            field: "subjects",
            oldValue: oldSubjects,
            newValue: newSubjects,
          },
        ],
      });
    }

    // 🔁 UPDATE STUDENT SUBJECT STRUCTURE
    const students = await CrudService.getStudentsByClass(selectedClass.id);

    await Promise.all(
      students.map((student: any) =>
        CrudService.put(`/students/${student.id}`, {
          ...student,
          subjects: mergeSubjects(newSubjects, student.subjects || []),
        }),
      ),
    );

    refresh();
    onClose();

    setSnackbar({
      open: true,
      message: "Class updated successfully",
      severity: "success",
    });
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

        <Stack direction="row" spacing={1} mt={2}>
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
          {subjects.map((s) => (
            <Chip
              key={s}
              label={s}
              onDelete={() => setSubjects(subjects.filter((sub) => sub !== s))}
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
