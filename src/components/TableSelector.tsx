import React from 'react';
import styled from 'styled-components';

const SelectorContainer = styled.div`
  margin-bottom: 15px;
`;

const StyledSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 16px;
  min-width: 200px;
`;

interface TableSelectorProps {
  tables: string[];
  selectedTable: string;
  onTableChange: (table: string) => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({ 
  tables, 
  selectedTable, 
  onTableChange 
}) => {
  return (
    <SelectorContainer>
      <label htmlFor="table-select">Select Table: </label>
      <StyledSelect
        id="table-select"
        value={selectedTable}
        onChange={(e) => onTableChange(e.target.value)}
      >
        {tables.map((table) => (
          <option key={table} value={table}>
            {table}
          </option>
        ))}
      </StyledSelect>
    </SelectorContainer>
  );
};

export default TableSelector;
