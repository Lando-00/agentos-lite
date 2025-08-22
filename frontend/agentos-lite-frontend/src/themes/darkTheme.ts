import type { Theme } from './types';

const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#3b9cff',
    secondary: '#62b5f6',
    background: '#1a1a1a',
    surface: '#2d2d2d',
    text: {
      primary: '#ffffff',
      secondary: '#c8c8c8',
    },
    message: {
      user: {
        background: '#3a3a3a',
        text: '#ffffff',
      },
      assistant: {
        background: '#104e8b',
        text: '#ffffff',
      },
    },
    input: {
      background: '#2d2d2d',
      text: '#ffffff',
      border: '#444444',
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
    small: '0 1px 2px rgba(0, 0, 0, 0.3)',
    medium: '0 2px 4px rgba(0, 0, 0, 0.3)',
    large: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
};

export default darkTheme;
