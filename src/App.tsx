import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import QueryEditor from './components/QueryEditor';
import ResultTable from './components/ResultTable';
import TableSelector from './components/TableSelector';
import QuerySelector from './components/QuerySelector';
import CsvDownloader from './components/CsvDownloader';
import TableInfo from './components/TableInfo';
import { tablesData } from './data/tablesData';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  margin-bottom: 20px;
  h1 {
    color: #333;
  }
`;

const ControlsSection = styled.section`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const QuerySection = styled.section`
  margin-bottom: 20px;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const RunButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: #45a049;
  }
`;

const ResultSection = styled.section`
  margin-top: 20px;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const App: React.FC = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [queries, setQueries] = useState<any[]>([]);
  const [selectedQueryId, setSelectedQueryId] = useState<string>('');
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [rowCount, setRowCount] = useState<number>(0);

  useEffect(() => {
    const tableNames = Object.keys(tablesData);
    setTables(tableNames);
    if (tableNames.length > 0) {
      setSelectedTable(tableNames[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedTable) {
      const tableQueries = tablesData[selectedTable].queries;
      setQueries(tableQueries);
      if (tableQueries.length > 0) {
        setSelectedQueryId(tableQueries[0].id);
        setCurrentQuery(tableQueries[0].query);
      }
      setColumns(tablesData[selectedTable].columns);
    }
  }, [selectedTable]);

  useEffect(() => {
    if (selectedQueryId && queries.length > 0) {
      const selectedQuery = queries.find(q => q.id === selectedQueryId);
      if (selectedQuery) {
        setCurrentQuery(selectedQuery.query);
      }
    }
  }, [selectedQueryId, queries]);

  useEffect(() => {
    setRowCount(results.length);
  }, [results]);

  const handleTableChange = (table: string) => {
    setSelectedTable(table);
    setResults([]);
  };

  const handleQueryChange = (queryId: string) => {
    setSelectedQueryId(queryId);
  };

  const handleQueryEditorChange = (value: string) => {
    setCurrentQuery(value);
  };

  const executeQuery = () => {
    setIsLoading(true);
    
    const isPredefinedQuery = queries.some(q => q.query.trim() === currentQuery.trim());
    
    if (!isPredefinedQuery) {
      alert("This query is not predefined in the system. Only predefined queries can be executed in this demo.");
      setIsLoading(false);
      return;
    }
    
    const startTime = performance.now();
    
    setTimeout(() => {
      const selectedQuery = queries.find(q => q.id === selectedQueryId);
      if (selectedQuery) {
        setResults(selectedQuery.results);
      }
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setIsLoading(false);
    }, 500);
  };
  

  return (
    <AppContainer>
      <Header>
        <h1>SQL Query Runner</h1>
      </Header>
      
      <ControlsSection>
        <TableSelector 
          tables={tables} 
          selectedTable={selectedTable} 
          onTableChange={handleTableChange} 
        />
        <QuerySelector 
          queries={queries} 
          selectedQueryId={selectedQueryId} 
          onQueryChange={handleQueryChange} 
        />
      </ControlsSection>
      
      {columns.length > 0 && (
        <TableInfo tableName={selectedTable} columns={columns} />
      )}
      
      <QuerySection>
        <QueryEditor value={currentQuery} onChange={handleQueryEditorChange} />
        
        <ActionBar>
          <RunButton onClick={executeQuery} disabled={isLoading}>
            {isLoading ? 'Running...' : 'Run Query'}
          </RunButton>
          <CsvDownloader 
            data={results} 
            filename={`${selectedTable}_query_results.csv`} 
          />
        </ActionBar>
      </QuerySection>
      
      <ResultSection>
        <StatusBar>
          <span>{rowCount} rows returned</span>
          <span>Execution time: {executionTime.toFixed(2)} ms</span>
        </StatusBar>
        
        <ResultTable data={results} />
      </ResultSection>
    </AppContainer>
  );
};

export default App;
