import React from 'react';
import styled from 'styled-components';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  HeaderGroup,
  Row,
  Cell,
} from '@tanstack/react-table';

// Styled components for table
const TableContainer = styled.div`
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;

  th, td {
    padding: 8px 12px;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
    position: sticky;
    top: 0;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

// Define table data type
type TableData = Record<string, any>;

interface ResultTableProps {
  data: TableData[];
}

const ResultTable: React.FC<ResultTableProps> = ({ data }) => {
  // Define columns dynamically based on data keys
  const columns = React.useMemo<ColumnDef<TableData, unknown>[]>(
    () =>
      data.length > 0
        ? Object.keys(data[0]).map((key) => ({
            accessorKey: key,
            header: key,
          }))
        : [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer>
      <Table>
        <thead>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<TableData>) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row: Row<TableData>) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell: Cell<TableData, unknown>) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default ResultTable;
