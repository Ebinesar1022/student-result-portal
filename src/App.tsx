import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useState } from "react";
import AdminPage from "./pages/AdminPage";
import StudentPage from "./pages/StudentPage";
import ClassStudentsPage from "./pages/ClassStudentsPage";
import LandingPage from "./pages/LandingPage";
import ClassMarksPage from "./pages/ClassMarksPage";
import { lightTheme, darkTheme } from "./theme";
import WelcomePage from "./pages/WelcomPage";

const App=()=> {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LandingPage/>}/>
          <Route
            path="/admin"
            element={
              <AdminPage darkMode={darkMode} setDarkMode={setDarkMode} />
            }
          />
          <Route
            path="/class/:id/marks"
            element={
              <ClassMarksPage darkMode={darkMode} setDarkMode={setDarkMode} />
            }
          />

          <Route path="/class/:id/students" element={<ClassStudentsPage />} />
          <Route
            path="/student/:rollNo"
            element={
              <StudentPage darkMode={darkMode} setDarkMode={setDarkMode} />
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;