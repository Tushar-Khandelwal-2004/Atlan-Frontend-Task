import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHistory, FaStar, FaTrash, FaCopy, FaChevronLeft, FaChevronRight, FaBars } from 'react-icons/fa';

interface SavedQuery {
  id: string;
  name: string;
  query: string;
  timestamp: string;
  isFavorite: boolean;
}

interface QueryHistoryProps {
  onLoadQuery: (query: string) => void;
  currentQuery: string;
}

const SidebarContainer = styled.div`
  position: relative;
  width: 300px;
  height: 100vh;
  background: ${props => props.theme.background};
  border-right: 1px solid ${props => props.theme.border};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileOverlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.isVisible ? 'block' : 'none'};
  transition: opacity 0.3s ease;
  opacity: ${props => props.isVisible ? 1 : 0};
`;

const MobileToggleButton = styled.button`
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  @media (max-width: 768px) {
    display: flex;
  }

  &:hover {
    background: ${props => props.theme.primaryDark};
    transform: scale(1.05);
  }
`;

const SidebarContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
  white-space: nowrap;
  
  h2 {
    margin: 0;
    font-size: 1.2rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: ${props => props.active ? props.theme.primary : props.theme.background};
  color: ${props => props.active ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? props.theme.primaryDark : props.theme.hover};
  }
`;

const QueryList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  margin-right: 4px;

  &::-webkit-scrollbar {
    width: 8px;
    margin-left: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.cardBackground};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.hover};
    }
  }
`;

const QueryItem = styled.div`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background: ${props => props.theme.cardBackground};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const QueryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const QueryName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.text};
`;

const QueryActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${props => props.theme.hover};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: ${props => props.theme.primary};
    opacity: 0.2;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease;
  }

  &:active::after {
    width: 100%;
    height: 100%;
  }
`;

const QueryPreview = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.5rem;
  background: ${props => props.theme.background};
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const SaveButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
  width: 100%;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${props => props.theme.primaryDark};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease;
  }

  &:active::after {
    width: 100%;
    height: 100%;
  }
`;

const QueryHistory: React.FC<QueryHistoryProps> = ({ onLoadQuery, currentQuery }) => {
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites'>('recent');
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);

  useEffect(() => {
    const queries = localStorage.getItem('savedQueries');
    if (queries) {
      setSavedQueries(JSON.parse(queries));
    }
  }, []);

  const saveCurrentQuery = () => {
    if (!currentQuery.trim()) return;

    const newQuery: SavedQuery = {
      id: Date.now().toString(),
      name: `Query ${savedQueries.length + 1}`,
      query: currentQuery,
      timestamp: new Date().toISOString(),
      isFavorite: false,
    };

    const updatedQueries = [...savedQueries, newQuery];
    setSavedQueries(updatedQueries);
    localStorage.setItem('savedQueries', JSON.stringify(updatedQueries));
  };

  const toggleFavorite = (id: string) => {
    const updatedQueries = savedQueries.map(query =>
      query.id === id ? { ...query, isFavorite: !query.isFavorite } : query
    );
    setSavedQueries(updatedQueries);
    localStorage.setItem('savedQueries', JSON.stringify(updatedQueries));
  };

  const deleteQuery = (id: string) => {
    const updatedQueries = savedQueries.filter(query => query.id !== id);
    setSavedQueries(updatedQueries);
    localStorage.setItem('savedQueries', JSON.stringify(updatedQueries));
  };

  const copyQuery = (query: string, queryId: string) => {
    navigator.clipboard.writeText(query);
    // Add a visual feedback for copy action
    const button = document.querySelector(`[data-query-id="${queryId}"]`);
    if (button) {
      button.classList.add('copied');
      setTimeout(() => {
        button.classList.remove('copied');
      }, 1000);
    }
  };

  const filteredQueries = savedQueries.filter(query =>
    activeTab === 'favorites' ? query.isFavorite : true
  );

  return (
    <SidebarContainer>
      <SidebarContent>
        <Header>
          <FaHistory />
          <h2>Query History</h2>
        </Header>

        <SaveButton onClick={saveCurrentQuery}>
          Save Current Query
        </SaveButton>

        <Tabs>
          <Tab
            active={activeTab === 'recent'}
            onClick={() => setActiveTab('recent')}
          >
            Recent
          </Tab>
          <Tab
            active={activeTab === 'favorites'}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </Tab>
        </Tabs>

        <QueryList>
          {filteredQueries.map(query => (
            <QueryItem key={query.id}>
              <QueryHeader>
                <QueryName>{query.name}</QueryName>
                <QueryActions>
                  <ActionButton 
                    onClick={() => copyQuery(query.query, query.id)}
                    data-query-id={query.id}
                  >
                    <FaCopy />
                  </ActionButton>
                  <ActionButton onClick={() => toggleFavorite(query.id)}>
                    <FaStar style={{ 
                      color: query.isFavorite ? '#ffd700' : 'inherit',
                      transition: 'transform 0.2s ease',
                      transform: query.isFavorite ? 'scale(1.2)' : 'scale(1)'
                    }} />
                  </ActionButton>
                  <ActionButton onClick={() => deleteQuery(query.id)}>
                    <FaTrash />
                  </ActionButton>
                </QueryActions>
              </QueryHeader>
              <QueryPreview>{query.query}</QueryPreview>
            </QueryItem>
          ))}
        </QueryList>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default QueryHistory; 