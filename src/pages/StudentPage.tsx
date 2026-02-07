import { useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import StudentDashboard from "../components/student/StudentDashboard";
interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  setSnackbar: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      message: string;
      severity: "success" | "error" | "warning" | "info";
    }>
  >;
}
const StudentPage:React.FC<Props>=({darkMode,setDarkMode,setSnackbar})=> {
  const { rollNo } = useParams<{ rollNo: string }>();

  if (!rollNo) return null;

  return (
    <>
      <Navbar title="Student Result Portal" darkMode={darkMode}
        setDarkMode={setDarkMode} />
      <StudentDashboard rollNo={rollNo} setSnackbar={setSnackbar} />
    </>
  );
}
export default StudentPage;
