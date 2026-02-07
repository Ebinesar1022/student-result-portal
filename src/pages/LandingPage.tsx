import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import "../styles/landing.css";
import LoginPage from "./LoginPage";

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <React.Fragment>
    <Box className="landing-wrapper">
      <Typography className="landing-title">
         Welcome
      </Typography>

      <Typography className="landing-subtitle">
       Student Result Portal
      </Typography>

      {showLogin && (
        <Box className="login-animate">
          <LoginPage />
        </Box>
      )}
    </Box>
    </React.Fragment>
  );
};

export default LandingPage;
