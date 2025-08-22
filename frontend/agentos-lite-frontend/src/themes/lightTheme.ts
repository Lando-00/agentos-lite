import type { Theme } from './types';

const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#0078d4',
    secondary: '#2b88d8',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: {
      primary: '#323130',
      secondary: '#605e5c',
    },
    message: {
      user: {
        background: '#f3f2f1',
        text: '#323130',
      },
      assistant: {
        background: '#eef6ff',
        text: '#323130',
      },
    },
    input: {
      background: '#ffffff',
      text: '#323130',
      border: '#e1e1e1',
    },
  },
  typography: {
    fontFamily: 'system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontSize: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem',
    },
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
  },
  shadows: {
    small: '0 1px 2px rgba(0, 0, 0, 0.1)',
    medium: '0 2px 4px rgba(0, 0, 0, 0.1)',
    large: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

export default lightTheme;
