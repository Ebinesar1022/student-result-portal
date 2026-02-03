import { Skeleton, Table, TableBody, TableCell, TableRow } from "@mui/material";

interface Props {
  rows?: number;
  columns?: number;
}

const TableSkeleton: React.FC<Props> = ({
  rows = 5,
  columns = 3,
}) => {
  return (
    <Table>
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton height={30} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableSkeleton;
