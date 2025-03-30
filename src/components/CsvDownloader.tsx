import React from 'react';
import styled from 'styled-components';

const DownloadButton = styled.button`
  background-color: #2196F3;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #0b7dda;
  }
`;

interface CsvDownloaderProps {
  data: any[];
  filename?: string;
}

const CsvDownloader: React.FC<CsvDownloaderProps> = ({ 
  data, 
  filename = 'data.csv' 
}) => {
  const downloadCSV = () => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    
    const csvRows = [];
    
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DownloadButton onClick={downloadCSV} disabled={data.length === 0}>
      <span>Download CSV</span>
    </DownloadButton>
  );
};

export default CsvDownloader;
