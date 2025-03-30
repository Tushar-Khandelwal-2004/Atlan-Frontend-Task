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

interface Query {
  id: string;
  name: string;
  query: string;
}

interface QuerySelectorProps {
  queries: Query[];
  selectedQueryId: string;
  onQueryChange: (queryId: string) => void;
}

const QuerySelector: React.FC<QuerySelectorProps> = ({ 
  queries, 
  selectedQueryId, 
  onQueryChange 
}) => {
  return (
    <SelectorContainer>
      <label htmlFor="query-select">Select Query: </label>
      <StyledSelect
        id="query-select"
        value={selectedQueryId}
        onChange={(e) => onQueryChange(e.target.value)}
      >
        {queries.map((query) => (
          <option key={query.id} value={query.id}>
            {query.name}
          </option>
        ))}
      </StyledSelect>
    </SelectorContainer>
  );
};

export default QuerySelector;
