/// <reference types="vite/client" />
declare module 'react-virtualized-auto-sizer' {
  interface Size {
    height: number;
    width: number;
  }
  
  interface AutoSizerProps {
    children: (size: Size) => React.ReactNode;
    className?: string;
    defaultHeight?: number;
    defaultWidth?: number;
    disableHeight?: boolean;
    disableWidth?: boolean;
    onResize?: (size: Size) => void;
    style?: React.CSSProperties;
  }
  
  export default function AutoSizer(props: AutoSizerProps): JSX.Element;
}
declare module 'react-intersection-observer';
