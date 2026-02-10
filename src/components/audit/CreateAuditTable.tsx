import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import { AuditLog } from "../../models/AuditLog";

export default function CreateAuditTable({ logs }: { logs: AuditLog[] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Entity</TableCell>
            <TableCell>Description</TableCell>
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
                {new Date(log.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
