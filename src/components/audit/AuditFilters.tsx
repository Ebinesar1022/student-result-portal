import { Box, TextField, MenuItem, Button } from "@mui/material";
import { useState } from "react";

const AuditFilters = ({ onChange }: any) => {
  const [local, setLocal] = useState<any>({});

  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      <TextField
        select
        label="Action"
        sx={{ width: 150 }}
        onChange={(e) =>
          setLocal({ ...local, action: e.target.value })
        }
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="LOGIN">Login</MenuItem>
        <MenuItem value="LOGOUT">Logout</MenuItem>
        <MenuItem value="CREATE">Create</MenuItem>
        <MenuItem value="UPDATE">Update</MenuItem>
        <MenuItem value="DELETE">Delete</MenuItem>
        <MenuItem value="DOWNLOAD">Download</MenuItem>
      </TextField>

      <TextField
        label="User Code"
        onChange={(e) =>
          setLocal({ ...local, actorCode: e.target.value })
        }
      />

      <Button variant="contained" onClick={() => onChange(local)}>
        Apply
      </Button>
    </Box>
  );
};

export default AuditFilters;
