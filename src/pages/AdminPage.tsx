import Navbar from "../components/common/Navbar";
import ClassManager from "../components/admin/ClassManager";
import "../styles/admin.css";

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}
const AdminPage:React.FC<Props> = ({darkMode,setDarkMode}) => {
  return (
    <>
      <Navbar title="Admin Panel" darkMode={darkMode}
  setDarkMode={setDarkMode} />
      <ClassManager />
    </>
  );
};

export default AdminPage;
