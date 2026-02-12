import { Box, Typography, Paper, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { AuditService } from "../../services/AuditService";
import { AuditLog } from "../../models/AuditLog";

import AuditFilters from "../../components/audit/AuditFilters";
import LoginAuditTable from "../../components/audit/LoginAuditTable";
import UpdateAuditTable from "../../components/audit/UpdateAuditTable";
import CreateAuditTable from "../../components/audit/CreateAuditTable";
import DeleteAuditTable from "../../components/audit/DeleteAuditTable";
import DownloadAuditTable from "../../components/audit/DownloadAuditTable";

const AuditPage = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [activeRole, setActiveRole] = useState<"ADMIN" | "TEACHER" | "STUDENT">(
    "ADMIN",
  );

  const loadAudit = async () => {
    const data = await AuditService.get(filters);
    setLogs(data);
  };

  useEffect(() => {
    loadAudit();
  }, [filters]);

  // ✅ FILTER BY ROLE
  const roleLogs = logs.filter((log) => log.actorType === activeRole);

  // ✅ GROUP BY ACTION
  const groupedLogs = {
    LOGIN_LOGOUT: roleLogs.filter(
      (l) => l.action === "LOGIN" || l.action === "LOGOUT",
    ),
    CREATE: roleLogs.filter((l) => l.action === "CREATE"),
    UPDATE: roleLogs.filter((l) => l.action === "UPDATE"),
    DELETE: roleLogs.filter((l) => l.action === "DELETE"),
    DOWNLOAD: roleLogs.filter((l) => l.action === "DOWNLOAD"),
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          background: "linear-gradient(135deg, #f3f177, #99f2c8)",
          py: 6,
        }}
      >
         <Box display="flex" justifyContent="center" gap={2} mb={3}>
        <Typography  variant="h5" mb={2}>
          Audit History
        </Typography>
        </Box>

        <Box display="flex" justifyContent="center" gap={2} mb={3}>
          <Button
            variant={activeRole === "ADMIN" ? "contained" : "outlined"}
            onClick={() => setActiveRole("ADMIN")}
          >
            Admin
          </Button>
          <Button
            variant={activeRole === "TEACHER" ? "contained" : "outlined"}
            onClick={() => setActiveRole("TEACHER")}
          >
            Teacher
          </Button>
          <Button
            variant={activeRole === "STUDENT" ? "contained" : "outlined"}
            onClick={() => setActiveRole("STUDENT")}
          >
            Student
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <Paper
            sx={{
              p: 3,
              width: "100%",
              maxWidth: 500,
              borderRadius: 3,
              boxShadow: 4,
            }}
          >
            <AuditFilters onChange={setFilters} />
          </Paper>
        </Box>

        {activeRole === "ADMIN" && (
          <>
            <Typography variant="h6">🔐 Login / Logout</Typography>
            <LoginAuditTable logs={groupedLogs.LOGIN_LOGOUT} />

            <Typography variant="h6" mt={4}>
              📝 Creates
            </Typography>
            <CreateAuditTable
              logs={groupedLogs.CREATE.filter((l) =>
                ["CLASS", "SUBJECT", "STUDENT"].includes(l.entityType),
              )}
            />

            <Typography variant="h6" mt={4}>
              ✏️ Updates
            </Typography>
            <UpdateAuditTable logs={groupedLogs.UPDATE} />

            <Typography variant="h6" mt={4}>
              ❌ Deletes
            </Typography>
            <DeleteAuditTable logs={groupedLogs.DELETE} />

            <Typography variant="h6" mt={4}>
              ⬇️ Downloads
            </Typography>
            <DownloadAuditTable logs={groupedLogs.DOWNLOAD} />
          </>
        )}

        {/* ================= TEACHER ================= */}
        {activeRole === "TEACHER" && (
          <>
            <Typography variant="h6">🔐 Login / Logout</Typography>
            <LoginAuditTable logs={groupedLogs.LOGIN_LOGOUT} />

            <Typography variant="h6" mt={4}>
              📝 Mark Creates
            </Typography>
            <CreateAuditTable
              logs={groupedLogs.CREATE.filter((l) => l.entityType === "MARK")}
            />

            <Typography variant="h6" mt={4}>
              ✏️ Mark Updates
            </Typography>
            <UpdateAuditTable
              logs={groupedLogs.UPDATE.filter((l) => l.entityType === "MARK")}
            />

            <Typography variant="h6" mt={4}>
              ❌ Mark Deletes
            </Typography>
            <DeleteAuditTable
              logs={groupedLogs.DELETE.filter((l) => l.entityType === "MARK")}
            />
          </>
        )}

        {/* ================= STUDENT ================= */}
        {activeRole === "STUDENT" && (
          <>
            <Typography variant="h6">🔐 Login / Logout</Typography>
            <LoginAuditTable logs={groupedLogs.LOGIN_LOGOUT} />

            <Typography variant="h6" mt={4}>
              ⬇️ Downloads
            </Typography>
            <DownloadAuditTable logs={groupedLogs.DOWNLOAD} />
          </>
        )}
      </Box>
    </React.Fragment>
  );
};

export default AuditPage;
