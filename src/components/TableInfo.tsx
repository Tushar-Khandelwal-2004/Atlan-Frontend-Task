import React from 'react';
import styled from 'styled-components';

const TableInfoContainer = styled.div`
  margin: 15px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #4CAF50;
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
`;

const ColumnList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ColumnItem = styled.div`
  background-color: #e7f3ff;
  padding: 6px 12px;
  border-radius: 4px;
  font-family: monospace;
  font-weight: bold;
`;

interface TableInfoProps {
  tableName: string;
  columns: string[];
}

const TableInfo: React.FC<TableInfoProps> = ({ tableName, columns }) => {
  return (
    <TableInfoContainer>
      <Title>Table Structure: {tableName}</Title>
      <ColumnList>
        {columns.map((column) => (
          <ColumnItem key={column}>{column}</ColumnItem>
        ))}
      </ColumnList>
    </TableInfoContainer>
  );
};

export default TableInfo;
