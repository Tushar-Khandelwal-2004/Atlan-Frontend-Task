import React from 'react';
import Editor from '@monaco-editor/react';
import styled from 'styled-components';

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const EditorContainer = styled.div`
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  overflow: hidden;
  height: 60px;
  background: ${props => props.theme.inputBackground};
  position: relative;

  .cm-editor {
    height: 100%;
    font-size: 14px;
    line-height: 1.5;
  }

  .cm-editor .cm-scroller {
    font-family: 'Fira Code', monospace;
    padding: 8px;
  }

  .cm-editor .cm-content {
    padding: 0;
  }

  .cm-editor .cm-line {
    padding: 0;
  }

  .cm-editor .cm-activeLine {
    background: ${props => props.theme.hover};
  }

  .cm-editor .cm-cursor {
    border-left: 2px solid ${props => props.theme.primary};
  }

  .cm-editor .cm-selectionBackground {
    background: ${props => props.theme.primary}40;
  }

  .cm-editor .cm-gutters {
    background: ${props => props.theme.cardBackground};
    border-right: 1px solid ${props => props.theme.border};
  }

  .cm-editor .cm-lineNumbers {
    color: ${props => props.theme.textSecondary};
  }

  .cm-editor .cm-keyword {
    color: #ff79c6;
  }

  .cm-editor .cm-operator {
    color: #ff79c6;
  }

  .cm-editor .cm-string {
    color: #f1fa8c;
  }

  .cm-editor .cm-number {
    color: #bd93f9;
  }

  .cm-editor .cm-comment {
    color: #6272a4;
  }

  .cm-editor .cm-function {
    color: #50fa7b;
  }

  .cm-editor .cm-variable {
    color: ${props => props.theme.text};
  }

  .cm-editor .cm-table {
    color: #ffb86c;
  }

  .cm-editor .cm-column {
    color: #8be9fd;
  }
`;

const QueryEditor: React.FC<QueryEditorProps> = ({ value, onChange }) => {
  return (
    <EditorContainer>
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
    </EditorContainer>
  );
};

export default QueryEditor;
