import { Snackbar, Alert } from "@mui/material";
export type SnackbarSeverity = "error" | "warning" | "info" | "success";

interface CommonSnackbarProps {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  onClose: () => void;
}
const CommonSnackbar: React.FC<CommonSnackbarProps> = ({
  open,
  message,
  severity,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
export default CommonSnackbar;
