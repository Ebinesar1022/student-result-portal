import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import { AuditLog } from "../../models/AuditLog";
import { formatAuditValue } from "../../utils/auditFormatter";

const DeleteAuditTable = ({ logs }: { logs: AuditLog[] }) => (
  <TableContainer component={Paper} sx={{ mb: 3 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>User</TableCell>
          <TableCell>Entity</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Deleted Value</TableCell>
          <TableCell>Time</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>
              {log.actorName} ({log.actorCode})
            </TableCell>
            <TableCell>{log.entityType}</TableCell>
            <TableCell>{log.description}</TableCell>
            <TableCell>
              {log.changes?.map((c, i) => (
                <div key={i}>{formatAuditValue(c.oldValue)}</div>
              )) || "-"}
            </TableCell>
            <TableCell>
              {new Date(log.createdAt).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default DeleteAuditTable;
