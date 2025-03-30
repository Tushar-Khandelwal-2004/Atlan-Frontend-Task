import React from 'react';
import styled from 'styled-components';

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

interface ResultTableProps {
  data: any[];
}

const ResultTable: React.FC<ResultTableProps> = ({ data }) => {
  const columns = React.useMemo(
    () => {
      if (data.length === 0) return [];
      return Object.keys(data[0]).map(key => ({
        Header: key,
        accessor: key,
      }));
    },
    [data]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <TableContainer>
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default ResultTable;
