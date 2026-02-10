import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { AuditLog } from "../../models/AuditLog";

export default function LoginAuditTable({ logs }: { logs: AuditLog[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>User</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Action</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Time</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{log.actorName} ({log.actorCode})</TableCell>
            <TableCell>{log.actorType}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.description}</TableCell>
            <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
