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

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .count {
    background-color: rgba(255, 255, 255, 0.2);
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 12px;
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
    
    try {
      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(',')];
      
      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header];
          // Handle null, undefined, and format numbers/dates if needed
          if (value == null) return '""';
          if (typeof value === 'string') {
            // Escape quotes and handle special characters
            return `"${value.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
          }
          if (value instanceof Date) {
            return `"${value.toISOString()}"`;
          }
          return `"${String(value)}"`;
        });
        csvRows.push(values.join(','));
      }
      
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating CSV:', error);
      alert('Error generating CSV file. Please try again.');
    }
  };

  return (
    <DownloadButton onClick={downloadCSV} disabled={data.length === 0}>
      <span>Download CSV</span>
      <span className="count">{data.length} rows</span>
    </DownloadButton>
  );
};

export default CsvDownloader;
