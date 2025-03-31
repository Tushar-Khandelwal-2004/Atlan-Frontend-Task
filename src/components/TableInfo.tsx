import React from 'react';
import styled from 'styled-components';

const TableInfoContainer = styled.div`
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1rem;
`;

const TableName = styled.h3`
  color: ${props => props.theme.primary};
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "📊";
    font-size: 1.2rem;
  }
`;

const ColumnList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const ColumnItem = styled.li`
  background: ${props => props.theme.background};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 120px;
`;

const ColumnName = styled.span`
  color: ${props => props.theme.primary};
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
`;

const ColumnType = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
  font-weight: 400;
  opacity: 0.8;
`;

interface TableInfoProps {
  tableName: string;
  columns: string[];
}

const TableInfo: React.FC<TableInfoProps> = ({ tableName, columns }) => {
  const getColumnNameAndType = (column: string) => {
    const parts = column.split(' ');
    const type = parts.pop();
    const name = parts.join(' ');
    return { name, type };
  };

  return (
    <TableInfoContainer>
      <TableName>Table Structure: {tableName}</TableName>
      <ColumnList>
        {columns.map((column) => {
          const { name, type } = getColumnNameAndType(column);
          return (
            <ColumnItem key={column}>
              <ColumnName>{name}</ColumnName>
              <ColumnType>{type}</ColumnType>
            </ColumnItem>
          );
        })}
      </ColumnList>
    </TableInfoContainer>
  );
};

export default TableInfo;
