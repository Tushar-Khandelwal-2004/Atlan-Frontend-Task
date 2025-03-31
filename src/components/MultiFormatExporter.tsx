import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { createPortal } from 'react-dom';

const ExportContainer = styled.div`
  position: relative;
  display: inline-block;
`;

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

const DropdownMenu = styled.div<{ isOpen: boolean; position: { top: number; left: number } }>`
  position: fixed;
  top: ${props => props.position.top}px;
  left: ${props => props.position.left}px;
  background: ${props => props.theme.cardBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 150px;
  margin-top: 4px;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const ExportOption = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 15px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.theme.text};
  
  &:hover {
    background-color: ${props => props.theme.hover};
    color: ${props => props.theme.primary};
  }

  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  &:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

interface MultiFormatExporterProps {
  data: any[];
  filename?: string;
}

const MultiFormatExporter: React.FC<MultiFormatExporterProps> = ({ 
  data, 
  filename = 'data' 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    if (!isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 150
      });
    }
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as HTMLElement).closest('.export-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleExportCSV = () => {
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
      saveAs(blob, `${filename}.csv`);
    } catch (error) {
      console.error('Error generating CSV:', error);
      alert('Error generating CSV file. Please try again.');
    }
    
    setIsMenuOpen(false);
  };

  const handleExportJSON = () => {
    if (data.length === 0) return;
    
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      saveAs(blob, `${filename}.json`);
    } catch (error) {
      console.error('Error generating JSON:', error);
      alert('Error generating JSON file. Please try again.');
    }
    
    setIsMenuOpen(false);
  };

  const handleExportExcel = () => {
    if (data.length === 0) return;
    
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      
      // Convert to binary string
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Create Blob and save
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${filename}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Error generating Excel file. Please try again.');
    }
    
    setIsMenuOpen(false);
  };

  const handleExportPDF = () => {
    if (data.length === 0) return;
    
    try {
      const doc = new jsPDF();
      
      // Get the headers from the first object
      const headers = Object.keys(data[0]);
      
      // Format data for autoTable
      const tableData = data.map(row => headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        return String(value);
      }));
      
      // Add title
      doc.text(`${filename.charAt(0).toUpperCase() + filename.slice(1)}`, 14, 15);
      
      // Use autoTable with proper types
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 20,
        margin: { top: 20 },
        styles: { overflow: 'linebreak' },
        headStyles: { fillColor: [33, 150, 243] },
        columnStyles: { 0: { cellWidth: 'auto' } },
      });
      
      doc.save(`${filename}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF file. Please try again.');
    }
    
    setIsMenuOpen(false);
  };

  return (
    <ExportContainer className="export-container">
      <DownloadButton ref={buttonRef} onClick={toggleMenu} disabled={data.length === 0}>
        <span>Export Data</span>
        <span className="count">{data.length} rows</span>
      </DownloadButton>
      
      {createPortal(
        <DropdownMenu isOpen={isMenuOpen} position={menuPosition}>
          <ExportOption onClick={handleExportCSV}>
            CSV
          </ExportOption>
          <ExportOption onClick={handleExportJSON}>
            JSON
          </ExportOption>
          <ExportOption onClick={handleExportExcel}>
            Excel
          </ExportOption>
          <ExportOption onClick={handleExportPDF}>
            PDF
          </ExportOption>
        </DropdownMenu>,
        document.body
      )}
    </ExportContainer>
  );
};

export default MultiFormatExporter;
