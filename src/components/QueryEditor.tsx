import React from 'react';
import Editor from '@monaco-editor/react';

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QueryEditor: React.FC<QueryEditorProps> = ({ value, onChange }) => {
  return (
    <Editor
      height="200px"
      language="sql"
      value={value}
      onChange={(value) => onChange(value || '')}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
      }}
    />
  );
};

export default QueryEditor;
