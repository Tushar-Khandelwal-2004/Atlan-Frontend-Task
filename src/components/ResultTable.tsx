import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  HeaderGroup,
  type Row as TableRow,
  type Cell,
  SortingState,
  ColumnResizeMode,
  ColumnFiltersState,
  getPaginationRowModel,
  ColumnOrderState,
} from '@tanstack/react-table';
import { FixedSizeList as List } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useInView } from 'react-intersection-observer';
import MultiFormatExporter from './MultiFormatExporter';

// Styled components for table
const TableContainer = styled.div`
  overflow-x: auto;
  max-height: 500px;
  width: 100%;
`;

const Table = styled.table<{ columnResizeMode: ColumnResizeMode }>`
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  position: relative;

  th, td {
    padding: 8px 12px;
    border: 1px solid #ddd;
    position: relative;
    background-clip: padding-box;
  }

  th {
    background-color: #f2f2f2;
    position: sticky;
    top: 0;
    user-select: none;
    z-index: 10;
    
    &:hover {
      background-color: #e5e5e5;
    }

    .resizer {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: rgba(0, 0, 0, 0.1);
      cursor: col-resize;
      user-select: none;
      touch-action: none;
      
      &:hover {
        background: rgba(0, 0, 0, 0.2);
      }

      &.isResizing {
        background: rgba(0, 0, 0, 0.3);
      }
    }

    .sort-indicator {
      margin-left: 4px;
    }

    .filter-input {
      margin-top: 4px;
      padding: 4px;
      width: calc(100% - 8px);
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PageButton = styled.button`
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #e0e0e0;
  }
`;

const PageInfo = styled.div`
  font-size: 14px;
`;

const PageSizeSelector = styled.select`
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const DisplayModeToggle = styled.div`
  display: flex;
  gap: 10px;
  margin-left: 20px;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 5px 10px;
  background-color: ${props => props.active ? '#2196F3' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : 'black'};
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.active ? '#0b7dda' : '#e0e0e0'};
  }
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 10px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
`;

const FilterControl = styled.div`
  position: relative;
  margin-top: 6px;
`;

const FilterInput = styled.input`
  padding: 6px;
  width: calc(100% - 12px);
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 4px;

  &:focus {
    border-color: #2196F3;
    outline: none;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }
`;

const FilterClearButton = styled.button`
  position: absolute;
  right: 4px;
  top: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #999;
  padding: 2px 4px;

  &:hover {
    color: #666;
  }
`;

const ColumnHeaderContent = styled.div`
  display: flex;
  align-items: center;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  
  .sort-indicator {
    opacity: 0.7;
  }
`;

// Define table data type
type TableData = Record<string, any>;

interface ResultTableProps {
  data: TableData[];
}

// Display modes
type DisplayMode = 'pagination' | 'virtualScroll' | 'infiniteScroll';

// Custom type for dragged column
interface DraggedColumnType {
  id: string;
  x: number;
  y: number;
}

// Row component for virtualized list
const VirtualRow = ({ index, style, data }: ListChildComponentProps<{
  rows: TableRow<TableData>[];
  rowRenderer: (row: TableRow<TableData>) => React.ReactNode[];
}>) => {
  const row = data.rows[index];
  const rowData = data.rowRenderer(row);
  return (
    <tr key={row.id} style={style}>
      {rowData}
    </tr>
  );
};

const ResultTable: React.FC<ResultTableProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('pagination');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [visibleRowCount, setVisibleRowCount] = useState(pageSize);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [draggedColumn, setDraggedColumn] = useState<DraggedColumnType | null>(null);

  // For infinite scroll
  const [infiniteLoadRef, infiniteLoadInView] = useInView({
    threshold: 0.5,
  });

  // Load more rows for infinite scroll
  React.useEffect(() => {
    if (infiniteLoadInView && displayMode === 'infiniteScroll' && visibleRowCount < table.getFilteredRowModel().rows.length) {
      const newCount = Math.min(visibleRowCount + 10, table.getFilteredRowModel().rows.length);
      setVisibleRowCount(newCount);
    }
  }, [infiniteLoadInView, displayMode, visibleRowCount]);

  // Reset visible row count when display mode changes
  React.useEffect(() => {
    if (displayMode === 'infiniteScroll') {
      setVisibleRowCount(Math.min(20, table.getFilteredRowModel().rows.length));
    }
  }, [displayMode]);

  // Initialize column order
  React.useEffect(() => {
    if (data.length > 0 && columnOrder.length === 0) {
      setColumnOrder(Object.keys(data[0]));
    }
  }, [data, columnOrder.length]);

  // Define columns dynamically based on data keys
  const columns = useMemo<ColumnDef<TableData, unknown>[]>(
    () =>
      data.length > 0
        ? Object.keys(data[0]).map((key) => ({
            id: key,
            accessorKey: key,
            header: ({ column }) => (
              <ColumnHeaderContent 
                draggable
                onDragStart={(e) => {
                  setDraggedColumn({
                    id: column.id,
                    x: e.clientX,
                    y: e.clientY,
                  });
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedColumn) {
                    const newColumnOrder = [...columnOrder];
                    const fromIndex = newColumnOrder.indexOf(draggedColumn.id);
                    const toIndex = newColumnOrder.indexOf(column.id);
                    
                    if (fromIndex !== -1 && toIndex !== -1) {
                      newColumnOrder.splice(fromIndex, 1);
                      newColumnOrder.splice(toIndex, 0, draggedColumn.id);
                      setColumnOrder(newColumnOrder);
                    }
                    
                    setDraggedColumn(null);
                  }
                }}
              >
                <HeaderTitle
                  onClick={() => column.toggleSorting()}
                  style={{ cursor: 'pointer' }}
                >
                  {key}
                  <span className="sort-indicator">
                    {column.getIsSorted() === 'asc' ? ' ↑' : column.getIsSorted() === 'desc' ? ' ↓' : ''}
                  </span>
                </HeaderTitle>
                <FilterControl>
                  <FilterInput
                    value={(column.getFilterValue() as string) ?? ''}
                    onChange={e => column.setFilterValue(e.target.value)}
                    placeholder={`Filter ${key}...`}
                    onClick={e => e.stopPropagation()}
                  />
                  {(() => {
                    const hasFilter = Boolean(column.getFilterValue());
                    return hasFilter ? (
                      <FilterClearButton
                        onClick={(e) => {
                          e.stopPropagation();
                          column.setFilterValue(undefined);
                        }}
                      >
                        ✕
                      </FilterClearButton>
                    ) : null;
                  })()}
                </FilterControl>
              </ColumnHeaderContent>
            ),
            enableSorting: true,
            enableColumnFilter: true,
            // Customize filter functions based on column data type
            filterFn: (row, columnId, filterValue) => {
              const value = row.getValue(columnId);
              if (value == null) return false;
              
              // For number fields
              if (typeof value === 'number') {
                try {
                  // Support for range values like ">100" or "<50" or "100-200"
                  if (filterValue.startsWith('>')) {
                    return value > parseFloat(filterValue.substring(1));
                  } else if (filterValue.startsWith('<')) {
                    return value < parseFloat(filterValue.substring(1));
                  } else if (filterValue.includes('-')) {
                    const [min, max] = filterValue.split('-').map((v: string) => parseFloat(v.trim()));
                    return value >= min && value <= max;
                  } else {
                    return value.toString().toLowerCase().includes(filterValue.toLowerCase());
                  }
                } catch (error) {
                  return value.toString().toLowerCase().includes(filterValue.toLowerCase());
                }
              }
              
              // For date fields (detect based on format)
              if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
                try {
                  if (filterValue.startsWith('>')) {
                    return new Date(value) > new Date(filterValue.substring(1));
                  } else if (filterValue.startsWith('<')) {
                    return new Date(value) < new Date(filterValue.substring(1));
                  } else {
                    return value.includes(filterValue);
                  }
                } catch (error) {
                  return value.toLowerCase().includes(filterValue.toLowerCase());
                }
              }
              
              // Default string filtering
              return typeof value === 'string' 
                ? value.toLowerCase().includes(filterValue.toLowerCase())
                : value.toString().toLowerCase().includes(filterValue.toLowerCase());
            },
          }))
        : [],
    [data, draggedColumn, columnOrder]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
      columnOrder,
    },
    enableColumnResizing: true,
    columnResizeMode,
    onColumnOrderChange: setColumnOrder,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: state => {
      if (typeof state === 'function') {
        const newState = state({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        setPageIndex(state.pageIndex);
        setPageSize(state.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Get complete filtered data for export (regardless of pagination)
  const exportData = useMemo(() => {
    return table.getFilteredRowModel().rows.map(row => row.original);
  }, [table.getFilteredRowModel().rows]);

  // Get visible rows based on display mode
  const visibleRows = useMemo(() => {
    if (displayMode === 'pagination') {
      return table.getRowModel().rows;
    } else if (displayMode === 'infiniteScroll') {
      return table.getFilteredRowModel().rows.slice(0, visibleRowCount);
    }
    return table.getFilteredRowModel().rows;
  }, [displayMode, table, visibleRowCount]);

  // Pagination controls
  const totalPages = table.getPageCount();
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  // Check if we're at the end of the infinite scroll
  const isAtEndOfInfiniteScroll = displayMode === 'infiniteScroll' && 
                                visibleRowCount >= table.getFilteredRowModel().rows.length;

  // Row renderer function for virtual list
  const renderRow = (row: TableRow<TableData>) => (
    row.getVisibleCells().map((cell: Cell<TableData, unknown>) => (
      <td 
        key={cell.id}
        style={{
          width: cell.column.getSize(),
        }}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    ))
  );

  // Total filtered rows count
  const filteredRowsCount = table.getFilteredRowModel().rows.length;

  return (
    <>
      <ActionBar>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {displayMode === 'pagination' && (
            <PaginationContainer>
              <PageButton
                onClick={() => table.setPageIndex(0)}
                disabled={!canPreviousPage}
              >
                {'<<'}
              </PageButton>
              <PageButton
                onClick={() => table.previousPage()}
                disabled={!canPreviousPage}
              >
                {'<'}
              </PageButton>
              <PageInfo>
                Page {pageIndex + 1} of {totalPages || 1} ({filteredRowsCount} records)
              </PageInfo>
              <PageButton
                onClick={() => table.nextPage()}
                disabled={!canNextPage}
              >
                {'>'}
              </PageButton>
              <PageButton
                onClick={() => table.setPageIndex(totalPages - 1)}
                disabled={!canNextPage}
              >
                {'>>'}
              </PageButton>
              <PageSizeSelector
                value={pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
              >
                {[10, 25, 50, 100].map(size => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </PageSizeSelector>
            </PaginationContainer>
          )}
          <DisplayModeToggle>
            <ToggleButton 
              active={displayMode === 'pagination'}
              onClick={() => setDisplayMode('pagination')}
            >
              Pagination
            </ToggleButton>
            <ToggleButton 
              active={displayMode === 'virtualScroll'}
              onClick={() => setDisplayMode('virtualScroll')}
            >
              Virtual Scroll
            </ToggleButton>
            <ToggleButton 
              active={displayMode === 'infiniteScroll'}
              onClick={() => setDisplayMode('infiniteScroll')}
            >
              Infinite Scroll
            </ToggleButton>
          </DisplayModeToggle>
        </div>
        <MultiFormatExporter 
          data={exportData}
          filename="query_results"
        />
      </ActionBar>
      <TableContainer>
        <Table columnResizeMode={columnResizeMode} style={{ width: table.getCenterTotalSize() }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<TableData>) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th 
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      position: 'relative',
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    <div
                      {...{
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                      }}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {displayMode === 'pagination' && (
            <tbody>
              {table.getRowModel().rows.map((row: TableRow<TableData>) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell: Cell<TableData, unknown>) => (
                    <td 
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </Table>

        {displayMode === 'virtualScroll' && (
          <div style={{ height: '400px', width: '100%' }}>
            <AutoSizer>
              {(size: { height: number; width: number }) => {
                const height = size.height || 400;
                const width = size.width || 1000;
                return (
                  <List
                    height={height}
                    itemCount={table.getFilteredRowModel().rows.length}
                    itemSize={48} // Adjust row height as needed
                    width={width}
                    itemData={{
                      rows: table.getFilteredRowModel().rows,
                      rowRenderer: renderRow
                    }}
                  >
                    {VirtualRow}
                  </List>
                );
              }}
            </AutoSizer>
          </div>
        )}

        {displayMode === 'infiniteScroll' && (
          <tbody>
            {visibleRows.map((row: TableRow<TableData>) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell: Cell<TableData, unknown>) => (
                  <td 
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {!isAtEndOfInfiniteScroll && (
              <tr ref={infiniteLoadRef}>
                <td colSpan={columns.length}>
                  <LoadingIndicator>Loading more rows...</LoadingIndicator>
                </td>
              </tr>
            )}
          </tbody>
        )}
      </TableContainer>
    </>
  );
};

export default ResultTable;
