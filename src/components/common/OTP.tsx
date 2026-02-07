import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

interface CommonOtpProps {
  open: boolean;
  email: string;
  onSuccess: () => void;
  onClose: () => void;
}

const SERVICE_ID = "service_ztneamq";
const TEMPLATE_ID = "template_p4w6q6x";
const PUBLIC_KEY = "Pyxm82GHyCbvyivqZ";

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const OTP = ({ open, email, onSuccess, onClose }: CommonOtpProps) => {
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [expiry, setExpiry] = useState(0);

  const sendOtp = async () => {
    const otp = generateOtp();
    setGeneratedOtp(otp);
    setExpiry(Date.now() + 5 * 60 * 1000);

    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        otp,
        to_email: email,
      },
      PUBLIC_KEY,
    );
  };
  useEffect(() => {
    if (open) {
      sendOtp();
    }
  }, [open]);

  const verifyOtp = () => {
    if (Date.now() > expiry) {
      alert("OTP expired");
      return;
    }

    if (enteredOtp === generatedOtp) {
      onSuccess();
      setEnteredOtp("");
      setGeneratedOtp("");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>OTP Verification</DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          OTP has been sent to <strong>{email}</strong>
        </Typography>
        <TextField
          label="Enter OTP"
          value={enteredOtp}
          onChange={(e) => setEnteredOtp(e.target.value)}
          fullWidth
          inputProps={{ maxLength: 6 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={verifyOtp}>
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OTP;
