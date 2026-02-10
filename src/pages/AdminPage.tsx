import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";
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

const AdminPage = ({ darkMode, setDarkMode, setSnackbar }: Props) => {
  return (
    <>
      <Navbar
        title="Admin Dashboard"
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <Outlet />
    </>
  );
};

export default AdminPage;
