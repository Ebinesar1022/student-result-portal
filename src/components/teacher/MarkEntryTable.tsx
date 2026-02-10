import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  Tooltip,
  Box,
  Paper,
  TableContainer,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";
import { CrudService } from "../../api/CrudService";
import { Teacher } from "../../models/Teacher";
import { regex, validateField } from "../../utils/validators";
import { auditLog } from "../../utils/auditlog";

interface Props {
  students: any[];
  marks: any[];
  teacher: Teacher;
  classId: string;
  subject: string;
  refresh: () => void;
  setSnackbar: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      message: string;
      severity: "success" | "error" | "warning" | "info";
    }>
  >;
}

export default function MarkEntryTable({
  students,
  marks,
  teacher,
  classId,
  subject,
  refresh,
  setSnackbar,
}: Props) {
  // local input buffer
  const [inputMarks, setInputMarks] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const getMark = (studentId: string) =>
    marks.find((m) => m.studentId === studentId);

  const saveMark = async (studentId: string, studentName: string) => {
    const value = inputMarks[studentId];
    if (value == null || value < 0 || value > 100) return;

    const existing = getMark(studentId);

    if (existing) {
      // 🔁 UPDATE MARK
      await CrudService.put(`/marks/${existing.id}`, {
        ...existing,
        marks: value,
      });

      // 🧾 AUDIT UPDATE
      await auditLog({
        actorType: "TEACHER",
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorCode: currentUser.code,

        action: "UPDATE",
        entityType: "MARK",
        entityId: existing.id,

        description: `Updated ${subject} mark for student ${studentName}`,

        changes: [
          {
            field: "marks",
            oldValue: existing.marks,
            newValue: value,
          },
        ],
      });
    } else {
      // ➕ CREATE MARK
      const newMark = {
        id: crypto.randomUUID(),
        studentId,
        classId,
        subject,
        marks: value,
        teacherId: teacher.id,
      };

      await CrudService.post("/marks", newMark);

      // 🧾 AUDIT CREATE
      await auditLog({
        actorType: "TEACHER",
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorCode: currentUser.code,

        action: "CREATE",
        entityType: "MARK",
        entityId: newMark.id,

        description: `Entered ${subject} mark for student ${studentName}`,
      });
    }

    refresh();
    setSnackbar({
      open: true,
      message: "Marks saved successfully",
      severity: "success",
    });
  };

  const deleteMark = async (studentId: string, studentName: string) => {
    const existing = getMark(studentId);
    if (!existing) return;

    if (!window.confirm(`Delete mark for student ${studentName}?`)) return;

    await CrudService.delete(`/marks/${existing.id}`);

    // 🧾 AUDIT DELETE
    await auditLog({
      actorType: "TEACHER",
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorCode: currentUser.code,

      action: "DELETE",
      entityType: "MARK",
      entityId: existing.id,

      description: `Deleted ${subject} mark for student ${studentName}`,

      changes: [
        {
          field: "marks",
          oldValue: existing.marks,
          newValue: null,
        },
      ],
    });

    refresh();
  };

  return (
    <React.Fragment>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 400,
          maxWidth: 1000,
          mx: "auto",
          mt: 5,
          borderRadius: 2,
          boxShadow: 10,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#99cce8" }}>
              <TableCell sx={{ fontSize: "17px" }}>
                <strong>Student Name</strong>
              </TableCell>
              <TableCell sx={{ width: "20%", fontSize: "17px" }} align="center">
                {" "}
                <strong>Marks</strong>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: "17px" }}>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {students.map((s) => {
              const existing = getMark(s.id);

              return (
                <TableRow key={s.id}>
                  <TableCell sx={{ fontSize: "16px" }}>{s.name}</TableCell>

                  <TableCell align="center">
                    <TextField
                      type="text"
                      size="small"
                      value={inputMarks[s.id] ?? existing?.marks ?? ""}
                      error={!!errors[s.id]}
                      helperText={errors[s.id]}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === "" || value === null) {
                          setInputMarks({ ...inputMarks, [s.id]: "" as any });
                          setErrors({ ...errors, [s.id]: "Mark Required" });
                          return;
                        }

                        // 🔥 REGEX VALIDATION
                        if (!validateField(value, regex.marks)) {
                          setErrors({
                            ...errors,
                            [s.id]: "Enter 0 to 100",
                          });
                          return;
                        }

                        setErrors({ ...errors, [s.id]: "" });
                        setInputMarks({
                          ...inputMarks,
                          [s.id]: Number(value),
                        });
                      }}
                      sx={{ width: 120 }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={1}>
                      <Tooltip title="Save Marks">
                        <IconButton
                          color="success"
                          disabled={!inputMarks[s.id] || !!errors[s.id]}
                          onClick={() => saveMark(s.id, s.name)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Marks">
                        <IconButton
                          color="error"
                          onClick={() => deleteMark(s.id, s.name)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
