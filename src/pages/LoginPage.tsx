import { Button, TextField, Box, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { CrudService } from "../api/CrudService";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { regex, validateField } from "../utils/validators";

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

    if (!validateField(u, regex.rollNo) && !validateField(u, regex.name)) {
      setUserError("Enter valid Username or Roll No(eg.STU05001)");
      valid = false;
    }

    if (!validateField(p, regex.password)) {
      setPassError("Password must be at least 6 characters");
      valid = false;
    }

    if (!valid) return;

    try {
      const user = await CrudService.login(u, p);

      if (!user) {
        setPassError("Invalid username or password");
        return;
      }

      if (user.role === "admin") nav("/admin");
      else nav(`/student/${user.rollNo}`);
    } catch {
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
          onChange={(e) => {setUsername(e.target.value);
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
          onChange={(e) =>{ setPassword(e.target.value);
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
