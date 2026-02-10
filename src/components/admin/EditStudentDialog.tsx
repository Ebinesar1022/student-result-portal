import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Radio,
  RadioGroup,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from "@mui/material";
import ConfirmDialog from "../common/ConfirmDialog";
import { regex, validateField } from "../../utils/validators";
import { useState, useEffect } from "react";
import { CrudService } from "../../api/CrudService";

const EditStudentDialog = ({ open, onClose, data, refresh }: any) => {
  const [student, setStudent] = useState(data);
  const [marks, setMarks] = useState(data.subjects || []);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    rollNo: "",
    phone: "",
    email: "",
    password: "",
  });

  const state = ["Tamil Nadu", "kerala"];
  const tamilNaduStates = [
    "Chennai",
    "Tiruvannamalai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tirunelveli",
    "Thoothukudi",
    "Erode",
    "Vellore",
    "Dindigul",
    "Thanjavur",
    "Cuddalore",
    "Kanchipuram",
    "Tiruppur",
    "Karur",
    "Namakkal",
    "Krishnagiri",
    "Dharmapuri",
    "Villupuram",
    "Kallakurichi",
    "Perambalur",
    "Ariyalur",
    "Nagapattinam",
    "Mayiladuthurai",
    "Tiruvarur",
    "Ramanathapuram",
    "Sivagangai",
    "Pudukkottai",
    "Theni",
    "Virudhunagar",
    "Tenkasi",
    "Nilgiris",
    "Chengalpattu",
    "Ranipet",
    "Tirupattur",
  ];
  const SECTIONS = ["A", "B", "C"];

  useEffect(() => {
    if (!data?.id || !data?.classId) return;

    const loadMarks = async () => {
      const marksRes = await CrudService.get<any[]>(
        `/marks?studentId=${data.id}&classId=${data.classId}`,
      );

      // If marks exist → use them
      if (marksRes.length) {
        setMarks(
          marksRes.map((m) => ({
            name: m.subject,
            marks: m.marks,
          })),
        );
      } else {
        // fallback to subjects structure
        setMarks(data.subjects || []);
      }
    };

    loadMarks();
  }, [data]);

  const update = async () => {
    for (const m of marks) {
      const existing = await CrudService.get<any[]>(
        `/marks?studentId=${student.id}&subject=${m.name}&classId=${student.classId}`,
      );

      if (existing.length) {
        await CrudService.put(`/marks/${existing[0].id}`, {
          ...existing[0],
          marks: m.marks,
        });
      } else {
        await CrudService.post(`/marks`, {
          studentId: student.id,
          classId: student.classId,
          subject: m.name,
          marks: m.marks,
        });
      }
    }

    refresh();
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setStudent({ ...student, [name]: value });

    let error = "";

    if (name === "name" && !validateField(value, regex.name)) {
      error = "Name must contain only letters";
    }

    if (name === "rollNo" && !validateField(value, regex.rollNo)) {
      error = "Roll No must be like STU001";
    }

    if (name === "phone" && !validateField(value, regex.phone)) {
      error = "Enter valid 10-digit phone number";
    }

    if (name === "email" && !validateField(value, regex.email)) {
      error = "Invalid email address";
    }

    if (name === "password" && !validateField(value, regex.password)) {
      error = "Password must be at least 6 characters";
    }

    setErrors({ ...errors, [name]: error });
  };
  const isFormValid = () => {
    return (
      validateField(student.name, regex.name) &&
      validateField(student.rollNo, regex.rollNo) &&
      validateField(student.phone, regex.phone) &&
      validateField(student.email, regex.email) &&
      validateField(student.password, regex.password)
    );
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    if (file.size > 1024 * 1024) {
      alert("Image must be less than 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setStudent({
        ...student,
        photo: reader.result as string,
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Student</DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="subtitle1">Student Photo</Typography>

          {student.photo && (
            <Box sx={{ mt: 1 }}>
              <img
                src={student.photo}
                alt="Student"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #1976d2",
                }}
              />
            </Box>
          )}

          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Upload / Change Photo
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
        </Box>

        <TextField
          fullWidth
          sx={{ mt: 2 }}
          label="Name"
          name="name"
          value={student.name || ""}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />

        <TextField
          fullWidth
          sx={{ mt: 2 }}
          label="Roll No"
          name="rollNo"
          value={student.rollNo || ""}
          onChange={handleChange}
          error={!!errors.rollNo}
          helperText={errors.rollNo}
        />

        <TextField
          fullWidth
          sx={{ mt: 2 }}
          label="Password"
          name="password"
          value={student.password || ""}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />

        <TextField
          fullWidth
          sx={{ mt: 2 }}
          label="Phone"
          name="phone"
          value={student.phone || ""}
          onChange={handleChange}
          error={!!errors.phone}
          helperText={errors.phone}
        />

        <TextField
          fullWidth
          sx={{ mt: 2 }}
          label="Email"
          name="email"
          value={student.email || ""}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />

        <Typography>Section</Typography>

        {SECTIONS.map((sec) => (
          <FormControlLabel
            key={sec}
            label={`Section ${sec}`}
            sx={{ mt: 2 }}
            control={
              <Checkbox
                checked={student.section?.includes(sec)}
                onChange={(e) => {
                  const checked = e.target.checked;

                  setStudent({
                    ...student,
                    section: checked
                      ? [...(student.section || []), sec]
                      : (student.section || []).filter(
                          (s: string) => s !== sec,
                        ),
                  });
                }}
              />
            }
          />
        ))}

        <Autocomplete
          sx={{ mt: 2 }}
          options={state}
          onChange={(e, v) => setStudent({ ...student, state: v })}
          renderInput={(params) => <TextField {...params} label="State" />}
        />
        <Autocomplete
          sx={{ mt: 2 }}
          options={tamilNaduStates}
          onChange={(e, v) => setStudent({ ...student, district: v })}
          renderInput={(params) => <TextField {...params} label="District" />}
        />
        <Typography>Gender</Typography>
        <RadioGroup
          row
          value={student.gender}
          onChange={(e) => setStudent({ ...student, gender: e.target.value })}
        >
          <FormControlLabel value="Male" control={<Radio />} label="Male" />
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
        </RadioGroup>
        {marks.map((m: any, i: number) => (
          <TextField
            sx={{ mt: 2 }}
            key={i}
            label={`${m.name} Marks`}
            type="number"
            value={m.marks}
            inputProps={{ min: 0, max: 100 }}
            error={m.marks < 0 || m.marks > 100}
            helperText={
              m.marks < 0 || m.marks > 100
                ? "Marks must be between 0 and 100"
                : ""
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = Number(e.target.value);
              if (isNaN(value)) return;
              if (value < 0 || value > 100) return;
              const updated = [...marks];
              updated[i] = { ...updated[i], marks: value };
              setMarks(updated);
            }}
            fullWidth
            margin="dense"
          />
        ))}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button variant="contained" color="error" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={!isFormValid()}
            onClick={() => setConfirmOpen(true)}
          >
            Update Student
          </Button>
        </Box>
      </DialogContent>
      <ConfirmDialog
        open={confirmOpen}
        title="Update Student"
        message="Are you sure you want to update this student's details?"
        confirmText="Update"
        confirmColor="primary"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={update}
      />
    </Dialog>
  );
};
export default EditStudentDialog;
