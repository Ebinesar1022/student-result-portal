import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useState } from "react";
import AdminPage from "./pages/AdminPage";
import StudentPage from "./pages/StudentPage";
import ClassStudentsPage from "./pages/ClassStudentsPage";
import LandingPage from "./pages/LandingPage";
import ClassMarksPage from "./pages/ClassMarksPage";
import { lightTheme, darkTheme } from "./theme";
import WelcomePage from "./pages/WelcomPage";
import CommonSnackbar from "./components/common/CommonSnackbar";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import EnterMarksPage from "./pages/teacher/EnterMarksPage";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      {/* <CssBaseline /> */}

      <BrowserRouter>
        <CommonSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        />
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LandingPage />} />
          <Route
            path="/admin"
            element={
              <AdminPage
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                setSnackbar={setSnackbar}
              />
            }
          />
          <Route
            path="/class/:id/marks"
            element={
              <ClassMarksPage
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                setSnackbar={setSnackbar}
              />
            }
          />
          <Route path="/teacher/dashboard" element={<TeacherDashboard darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route
            path="/teacher/marks/:classId/:subject"
             element={<EnterMarksPage darkMode={darkMode} setDarkMode={setDarkMode} />}
          />

          <Route
            path="/class/:id/students"
            element={<ClassStudentsPage setSnackbar={setSnackbar} />}
          />
          <Route
            path="/student/:rollNo"
            element={
              <StudentPage
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                setSnackbar={setSnackbar}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};
export default App;
