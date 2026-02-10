import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Chip,
  Stack,
  Box,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CrudService } from "../../api/CrudService";
import "../../styles/StudentDialog.css";
import OTP from "../common/OTP";
import { getCurrentUser } from "../../utils/currentUser";
import { auditLog } from "../../utils/auditlog";

interface Props {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  setSnackbar: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      message: string;
      severity: "success" | "error" | "warning" | "info";
    }>
  >;
}

const AddClassDialog = ({ open, onClose, refresh, setSnackbar }: Props) => {
  const [className, setClassName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [subject, setSubject] = useState("");
  const [examName, setExamName] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [otpOpen, setOtpOpen] = useState(false);
  const EXAM_OPTIONS = [
    "Unit Test 1",
    "Unit Test 2",
    "Mid Term",
    "Quarterly Exam",
    "Half Yearly",
    "Annual Exam",
  ];

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

    if (!examName) {
      alert("Please select exam name");
      return;
    }

    // 🔑 CURRENT USER (ADMIN)
    const user = getCurrentUser();

    // 🔑 CREATE CLASS OBJECT
    const newClass = {
      id: crypto.randomUUID(),
      className: className.trim(),
      classCode,
      subjects,
      examName,
    };

    // ✅ SAVE CLASS
    await CrudService.addClass(newClass);

    // 🧾 AUDIT → CLASS CREATE
    await auditLog({
      actorType: "ADMIN",
      actorId: user.id,
      actorName: user.name,
      actorCode: user.code,

      action: "CREATE",
      entityType: "CLASS",
      entityId: newClass.id,

      description: `Created class ${newClass.className} (${newClass.classCode}) with subjects: ${subjects.join(", ")} for ${examName}`,
    });

    refresh();

    setSnackbar({
      open: true,
      message: "Class added successfully",
      severity: "success",
    });

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
        <Autocomplete
          options={EXAM_OPTIONS}
          value={examName}
          onChange={(e, newValue) => setExamName(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Exam Name" margin="normal" required />
          )}
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
            onClick={() => {
              const adminEmail = localStorage.getItem("adminEmail");
              if (!adminEmail) {
                alert("Admin email not verified. Go to Admin Profile.");
                return;
              }
              setOtpOpen(true); // 🔥 trigger OTP
            }}
            fullWidth
          >
            Save
          </Button>
        </Box>
      </DialogContent>
      <OTP
        open={otpOpen}
        email={localStorage.getItem("adminEmail")!}
        onClose={() => setOtpOpen(false)}
        onSuccess={async () => {
          await addClass();
          setOtpOpen(false);
        }}
      />
    </Dialog>
  );
};
export default AddClassDialog;
