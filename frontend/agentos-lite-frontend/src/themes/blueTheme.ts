import type { Theme } from './types';

const blueTheme: Theme = {
  name: 'blue',
  colors: {
    primary: '#0062cc',
    secondary: '#4096ff',
    background: '#f0f5ff',
    surface: '#e6f0ff',
    text: {
      primary: '#003366',
      secondary: '#004b8c',
    },
    message: {
      user: {
        background: '#cce4ff',
        text: '#003366',
      },
      assistant: {
        background: '#0062cc',
        text: '#ffffff',
      },
    },
    input: {
      background: '#ffffff',
      text: '#003366',
      border: '#b3d1ff',
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

export default blueTheme;
