import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

interface NavbarProps {
  title: string;
  showLogout?: boolean;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  title,
  showLogout = true,
  darkMode,
  setDarkMode,
}) => {
  const navigate = useNavigate();
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6">{title}</Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box display="flex" alignItems="center" gap={1} mr={2}>
          {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </Box>
 
        {showLogout && (
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => setLogoutConfirmOpen(true)}
            startIcon={<LogoutIcon />}
          >
            LOGOUT
          </Button>
        )}
        <ConfirmDialog
          open={logoutConfirmOpen}
          title="Logout"
          message="Are you sure you want to logout?"
          confirmText="Logout"
          confirmColor="error"
          onCancel={() => setLogoutConfirmOpen(false)}
          onConfirm={() => {
            setLogoutConfirmOpen(false);
            handleLogout();
          }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
