import type { Theme } from './types';

// Define which theme properties users can customize
export interface CustomThemeOptions {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  messageUserBackground: string;
  messageUserText: string;
  messageAssistantBackground: string;
  messageAssistantText: string;
  inputBackground: string;
  inputText: string;
  inputBorder: string;
  fontFamily: string;
  borderRadius: number; // Base value in px
  spacing: number; // Base value in px
}

// Default values for the custom theme
export const defaultCustomThemeOptions: CustomThemeOptions = {
  name: 'custom',
  primaryColor: '#6200ee',
  secondaryColor: '#03dac6',
  backgroundColor: '#f5f5f5',
  surfaceColor: '#ffffff',
  textPrimaryColor: '#333333',
  textSecondaryColor: '#666666',
  messageUserBackground: '#e2d8f7',
  messageUserText: '#333333',
  messageAssistantBackground: '#6200ee',
  messageAssistantText: '#ffffff',
  inputBackground: '#ffffff',
  inputText: '#333333',
  inputBorder: '#cccccc',
  fontFamily: 'system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  borderRadius: 8,
  spacing: 8,
};

// Function to convert custom theme options to a Theme object
export function createThemeFromCustomOptions(options: CustomThemeOptions): Theme {
  return {
    name: options.name,
    colors: {
      primary: options.primaryColor,
      secondary: options.secondaryColor,
      background: options.backgroundColor,
      surface: options.surfaceColor,
      text: {
        primary: options.textPrimaryColor,
        secondary: options.textSecondaryColor,
      },
      message: {
        user: {
          background: options.messageUserBackground,
          text: options.messageUserText,
        },
        assistant: {
          background: options.messageAssistantBackground,
          text: options.messageAssistantText,
        },
      },
      input: {
        background: options.inputBackground,
        text: options.inputText,
        border: options.inputBorder,
      },
    },
    typography: {
      fontFamily: options.fontFamily,
      fontSize: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem',
        xlarge: '1.5rem',
      },
    },
    spacing: {
      small: `${options.spacing}px`,
      medium: `${options.spacing * 2}px`,
      large: `${options.spacing * 3}px`,
    },
    borderRadius: {
      small: `${options.borderRadius / 2}px`,
      medium: `${options.borderRadius}px`,
      large: `${options.borderRadius * 1.5}px`,
    },
    shadows: {
      small: '0 1px 2px rgba(0, 0, 0, 0.1)',
      medium: '0 2px 4px rgba(0, 0, 0, 0.1)',
      large: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
  };
}
