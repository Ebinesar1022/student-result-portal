import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import OTP from "../../components/common/OTP";

interface Props {
  onClose: () => void;
}

const AdminProfile: React.FC<Props> = ({ onClose }) => {
  const [adminEmail, setAdminEmail] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [editing, setEditing] = useState(false);

  // OTP for saving new / edited email
  const [saveOtpOpen, setSaveOtpOpen] = useState(false);

  // OTP for verifying BEFORE edit
  const [editOtpOpen, setEditOtpOpen] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("adminEmail");
    if (savedEmail) {
      setAdminEmail(savedEmail);
      setTempEmail(savedEmail);
    }
  }, []);

  // STEP 1: Save button → OTP
  const handleSaveClick = () => {
    if (!tempEmail) {
      alert("Email required");
      return;
    }
    setSaveOtpOpen(true);
  };

  // STEP 2: OTP success for save
  const handleSaveOtpSuccess = () => {
    localStorage.setItem("adminEmail", tempEmail);
    setAdminEmail(tempEmail);
    setEditing(false);
    setSaveOtpOpen(false);
    alert("Admin email verified & saved");
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Admin Profile
      </Typography>

      <TextField
        label="Admin Email"
        value={editing ? tempEmail : adminEmail}
        onChange={(e) => setTempEmail(e.target.value)}
        disabled={!editing}
        fullWidth
      />

      {/* 🔐 EDIT FLOW */}
      {!editing ? (
        <Button
          sx={{ mt: 2 }}
          onClick={() => {
            if (!adminEmail) {
              setEditing(true); // allow direct add
            } else {
              setEditOtpOpen(true); // OTP only for existing email
            }
          }}
        >
          {adminEmail ? "Edit Email" : "Add Email"}
        </Button>
      ) : (
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleSaveClick}>
          Save & Verify
        </Button>
      )}

      <Button variant="outlined" sx={{ mt: 2 }} onClick={onClose}>
        Close
      </Button>

      {/* OTP → BEFORE EDIT */}
      <OTP
        open={editOtpOpen}
        email={adminEmail} // verify existing email
        onClose={() => setEditOtpOpen(false)}
        onSuccess={() => {
          setEditOtpOpen(false);
          setEditing(true); // ✅ allow edit ONLY after OTP
        }}
      />

      {/* OTP → SAVE / VERIFY */}
      <OTP
        open={saveOtpOpen}
        email={tempEmail}
        onClose={() => setSaveOtpOpen(false)}
        onSuccess={handleSaveOtpSuccess}
      />
    </Box>
  );
};

export default AdminProfile;
