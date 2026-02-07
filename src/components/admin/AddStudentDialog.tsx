import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CrudService } from "../../api/CrudService";
import ConfirmDialog from "../common/ConfirmDialog";
import "../../styles/StudentDialog.css";

const states = ["Tamil Nadu", "Kerala"];
const districts: any = {
  "Tamil Nadu": ["Chennai", "Madurai"],
  Kerala: ["Kochi", "Trivandrum"],
};

interface Props {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  classId: string;
  classCode: string;
  subjects: string[];
}

const AddStudentDialog = ({
  open,
  onClose,
  refresh,
  classId,
  classCode,
  subjects,
}: Props) => {

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [student, setStudent] = useState<any>({
    name: "",
    password: "",
    phone: "",
    email: "",
    gender: "",
    section: [],
    state: "",
    district: "",
  });
  const [studentNumber, setStudentNumber] = useState("");
  const [marks, setMarks] = useState<{ name: string; marks: number }[]>([]);

  useEffect(() => {
    if (open) {
      setMarks(subjects.map((s) => ({ name: s, marks: 0 })));
    }
  }, [open, subjects]);

  const save = async () => {
    if (!studentNumber) {
      alert("Enter student number");
      return;
    }
    const rollNo = `${classCode}${studentNumber.padStart(3, "0")}`;
    await CrudService.addStudent({
      ...student,
      classId,
      rollNo,
      subjects: marks,
    });

    refresh();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Student</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          sx={{ mt: 2 }}
          label="Name"
          onChange={(e) => setStudent({ ...student, name: e.target.value })}
        />

        <Box display="flex" gap={2} mt={2}>
          <TextField
            label="Class Code"
            value={classCode}
            InputProps={{ readOnly: true }}
            sx={{ width: "40%" }}
          />

          <TextField
            label="Student No"
            placeholder="001"
            value={studentNumber}
            onChange={(e) => {
              const value = e.target.value;

              if (/^\d*$/.test(value)) {
                setStudentNumber(value);
                const generatedPassword =
                  `${classCode}${value.padStart(3, "0")}`.toLowerCase();

                setStudent((prev: any) => ({
                  ...prev,
                  password: generatedPassword,
                }));
              }
            }}
            sx={{ width: "60%" }}
          />
        </Box>
        <TextField
          fullWidth
          sx={{ mt: 2 }}
          label="Password"
          value={student.password}
          InputProps={{ readOnly: true }}
          helperText="Password is auto-generated"
        />

        <Box className="dialog-actions">
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => setConfirmOpen(true)}
          >
            Save
          </Button>
          <ConfirmDialog
            open={confirmOpen}
            title="Add Student"
            message="Are you sure you want to save this student?"
            confirmText="Save"
            confirmColor="primary"
            onCancel={() => setConfirmOpen(false)}
            onConfirm={save}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default AddStudentDialog;
