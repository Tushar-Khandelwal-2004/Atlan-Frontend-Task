import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  background: '#ffffff',
  cardBackground: '#f5f5f5',
  text: '#333333',
  textSecondary: '#666666',
  primary: '#1a73e8',
  primaryDark: '#1557b0',
  border: '#e0e0e0',
  hover: '#f0f0f0',
  inputBackground: '#ffffff',
  tableHeader: '#f5f5f5',
  tableRow: '#ffffff',
  tableRowAlt: '#f9f9f9',
  tableBorder: '#e0e0e0'
};

export const darkTheme: DefaultTheme = {
  background: '#1a1b26',
  cardBackground: '#24283b',
  text: '#a9b1d6',
  textSecondary: '#7982a9',
  primary: '#7aa2f7',
  primaryDark: '#5a6db6',
  border: '#414868',
  hover: '#414868',
  inputBackground: '#24283b',
  tableHeader: '#1f2335',
  tableRow: '#24283b',
  tableRowAlt: '#292e42',
  tableBorder: '#414868'
};

export type Theme = typeof lightTheme; 