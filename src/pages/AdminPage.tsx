import Navbar from "../components/common/Navbar";
import ClassManager from "../components/admin/ClassManager";
import "../styles/admin.css";

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
const AdminPage: React.FC<Props> = ({ darkMode, setDarkMode, setSnackbar }) => {
  
  return (
    <>
      <Navbar
        title="Admin Panel"
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <ClassManager setSnackbar={setSnackbar} />
    </>
  );
};

export default AdminPage;
