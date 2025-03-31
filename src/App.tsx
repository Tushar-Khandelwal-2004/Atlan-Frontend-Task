import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './styles/theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QueryHistory from './components/QueryHistory';
import QueryEditor from './components/QueryEditor';
import ResultTable from './components/ResultTable';
import TableSelector from './components/TableSelector';
import QuerySelector from './components/QuerySelector';
import MultiFormatExporter from './components/MultiFormatExporter';
import TableInfo from './components/TableInfo';
import { tablesData } from './data/tablesData';
import { GlobalStyles } from './styles/GlobalStyles';

// Define theme type for styled-components
declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    cardBackground: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryDark: string;
    border: string;
    hover: string;
    inputBackground: string;
    tableHeader: string;
    tableRow: string;
    tableRowAlt: string;
    tableBorder: string;
  }
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${props => props.theme.background};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  overflow: hidden;
  min-width: 0;
  position: relative;
`;

const DashboardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  width: 100%;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1rem;
`;

const Header = styled.header`
  margin-bottom: 20px;
  h1 {
    color: ${props => props.theme.text};
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
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
`;

const RunButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: ${props => props.theme.primaryDark};
  }
`;

const ResultSection = styled.section`
  margin-top: 20px;
  scroll-margin-top: 20px;
  position: relative;
  overflow: auto;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 8px;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 4px;
  color: ${props => props.theme.text};
`;

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

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
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const queryHistoryRef = useRef<{ addToRecent: (query: string) => void }>(null);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

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

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

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
        // Update recent queries in QueryHistory
        if (queryHistoryRef.current) {
          queryHistoryRef.current.addToRecent(currentQuery);
        }
      }
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setIsLoading(false);
      
      // Ensure results are visible by scrolling with a slight delay to allow for state updates
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }, 500);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <AppContainer>
        <Navbar onThemeToggle={handleThemeToggle} isDarkMode={isDarkMode} />
        <MainContent>
          <QueryHistory 
            ref={queryHistoryRef}
            onLoadQuery={setCurrentQuery} 
            currentQuery={currentQuery} 
          />
          <DashboardContent>
            <ContentWrapper>
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
                </ActionBar>
              </QuerySection>
              
              <ResultSection ref={resultSectionRef}>
                <StatusBar>
                  <span>{rowCount} rows returned</span>
                  <span>Execution time: {executionTime.toFixed(2)} ms</span>
                </StatusBar>
                
                <ResultTable data={results} />
              </ResultSection>
            </ContentWrapper>
          </DashboardContent>
        </MainContent>
        <Footer />
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
