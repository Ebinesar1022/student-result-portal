import { Button, TextField, Box, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { CrudService } from "../api/CrudService";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { regex, validateField } from "../utils/validators";
import { auditLog } from "../utils/auditlog";
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const [userError, setUserError] = useState("");
  const [passError, setPassError] = useState("");

  const login = async () => {
    setUserError("");
    setPassError("");

    const u = username.trim();
    const p = password.trim();

    let valid = true;

    if (
      !validateField(u, regex.rollNo) &&
      !validateField(u, regex.name) &&
      !validateField(u, regex.teacherNo)
    ) {
      setUserError("Enter valid Username / Roll No");
      valid = false;
    }

    if (!valid) return;

    try {
      const user = await CrudService.login(u, p);

      if (!user) {
        setPassError("Invalid username or password");
        return;
      }

      if (user.role === "admin") {
        // 👉 store current user
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            actorType: "ADMIN",
            id: "ADMIN",
            name: "Admin",
            code: "ADMIN",
          }),
        );

        // 👉 audit login
        await auditLog({
          actorType: "ADMIN",
          actorId: "ADMIN",
          actorName: "Admin",
          actorCode: "ADMIN",

          action: "LOGIN",
          entityType: "AUTH",
          entityId: "ADMIN",

          description: "Admin logged in",
        });
        nav("/admin");
      } else if (user.role === "teacher") {
        const teacher = user.teacher;
         localStorage.setItem(
        "currentUser",
        JSON.stringify({
          actorType: "TEACHER",
          id: teacher.id,
          name: teacher.name,
          code: teacher.teacherNo,
        })
      );

      // 👉 audit login
      await auditLog({
        actorType: "TEACHER",
        actorId: teacher.id,
        actorName: teacher.name,
        actorCode: teacher.teacherNo,

        action: "LOGIN",
        entityType: "AUTH",
        entityId: teacher.id,

        description: `Teacher ${teacher.name} logged in`,
      });
        nav("/teacher/dashboard", { state: user.teacher });
      } else {
         // 👉 store current user
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          actorType: "STUDENT",
          id: user.rollNo,
          name: user.rollNo,
          code: user.rollNo,
        })
      );

      // 👉 audit login
      await auditLog({
        actorType: "STUDENT",
        actorId: user.rollNo,
        actorName: user.rollNo,
        actorCode: user.rollNo,

        action: "LOGIN",
        entityType: "AUTH",
        entityId: user.rollNo,

        description: `Student ${user.rollNo} logged in`,
      });
        nav(`/student/${user.rollNo}`);
      }
    } catch (error) {
      alert("Server not running");
    }
  };

  return (
    <Box className="login-page">
      <Paper elevation={10} className="login-card">
        <Typography className="login-title">Login</Typography>
        <TextField
          label="Username / Roll No"
          fullWidth
          autoComplete="off"
          margin="normal"
          value={username}
          error={!!userError}
          helperText={userError}
          onChange={(e) => {
            setUsername(e.target.value);
            if (userError) setUserError("");
          }}
        />

        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          fullWidth
          value={password}
          error={!!passError}
          helperText={passError}
          margin="normal"
          onChange={(e) => {
            setPassword(e.target.value);
            if (passError) setPassError("");
          }}
        />
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={login}>
          Login
        </Button>
      </Paper>
    </Box>
  );
};
export default LoginPage;
