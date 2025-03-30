import React from 'react';
import { FixedSizeList as List } from 'react-window';

const Row = ({ index, style, data }) => (
  <div style={style}>
    {JSON.stringify(data[index])}
  </div>
);

const CsvDownloader: React.FC<CsvDownloaderProps> = ({ 
  data, 
  filename = 'data.csv' 
}) => {
  // ... existing downloadCSV function ...

  return (
    <>
      <DownloadButton onClick={downloadCSV} disabled={data.length === 0}>
        <span>Download CSV</span>
        <span className="count">{data.length} rows</span>
      </DownloadButton>
      <List
        height={400}
        itemCount={data.length}
        itemSize={35}
        width={300}
        itemData={data}
      >
        {Row}
      </List>
    </>
  );
}; 