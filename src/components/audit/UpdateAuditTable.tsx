import {
  Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";
import { AuditLog } from "../../models/AuditLog";

export default function UpdateAuditTable({ logs }: { logs: AuditLog[] }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>User</TableCell>
          <TableCell>Entity</TableCell>
          <TableCell>Field</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Old Value</TableCell>
          <TableCell>New Value</TableCell>
          <TableCell>Time</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {logs.map((log) =>
          log.changes?.map((c, idx) => (
            <TableRow key={`${log.id}-${idx}`}>
              <TableCell>
                {log.actorName} ({log.actorCode})
              </TableCell>
              <TableCell>{log.entityType}</TableCell>
              <TableCell>{c.field}</TableCell>
                <TableCell>{log.description}</TableCell>
              <TableCell sx={{ color: "red" }}>
                {String(c.oldValue)}
              </TableCell>
              <TableCell sx={{ color: "green" }}>
                {String(c.newValue)}
              </TableCell>
              <TableCell>
                {new Date(log.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
