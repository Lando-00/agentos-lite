import type { Theme } from './types';

const highContrastTheme: Theme = {
  name: 'high-contrast',
  colors: {
    primary: '#ffffff',
    secondary: '#ffff00',
    background: '#000000',
    surface: '#121212',
    text: {
      primary: '#ffffff',
      secondary: '#ffff00',
    },
    message: {
      user: {
        background: '#000080', // Navy blue
        text: '#ffffff',
      },
      assistant: {
        background: '#006400', // Dark green
        text: '#ffffff',
      },
    },
    input: {
      background: '#000000',
      text: '#ffffff',
      border: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontSize: {
      small: '1rem', // Larger for better readability
      medium: '1.2rem',
      large: '1.5rem',
      xlarge: '1.8rem',
    },
  },
  spacing: {
    small: '10px', // Slightly larger spacing for clarity
    medium: '20px',
    large: '30px',
  },
  borderRadius: {
    small: '2px', // Reduced radius for clearer boundaries
    medium: '4px',
    large: '8px',
  },
  shadows: {
    small: '0 1px 3px rgba(255, 255, 255, 0.3)',  // White shadows for contrast
    medium: '0 2px 6px rgba(255, 255, 255, 0.3)',
    large: '0 4px 12px rgba(255, 255, 255, 0.3)',
  },
};

export default highContrastTheme;
