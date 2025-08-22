import React, { createContext, useState, useEffect, useContext } from 'react';
import type { Theme } from './types';
import lightTheme from './lightTheme';
import darkTheme from './darkTheme';
import blueTheme from './blueTheme';
import highContrastTheme from './highContrastTheme';
import { createThemeFromCustomOptions } from './customThemeUtils';
import type { CustomThemeOptions } from './customThemeUtils';

// Available themes map
export const themes: Record<string, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
  'high-contrast': highContrastTheme
};

// Theme names for display
export const themeNames: Record<string, string> = {
  light: 'Light',
  dark: 'Dark',
  blue: 'Blue',
  'high-contrast': 'High Contrast'
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  availableThemes: Theme[];
  setThemeByName: (name: string) => void;
  setCustomTheme: (customTheme: Theme) => void;
  removeCustomTheme: (themeName: string) => void;
  currentTheme: Theme;
  applyTheme: (name: string) => void;
}

// Create the context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  setTheme: () => {},
  toggleTheme: () => {},
  availableThemes: Object.values(themes),
  setThemeByName: () => {},
  setCustomTheme: () => {},
  removeCustomTheme: () => {},
  currentTheme: lightTheme,
  applyTheme: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);
  const [customThemes, setCustomThemes] = useState<Record<string, Theme>>({});
  const currentTheme = theme; // Alias for better readability
  
  // Combine built-in themes with custom themes
  const allThemes = { ...themes, ...customThemes };
  const availableThemes = Object.values(allThemes);

  // Function to set theme by name, including custom themes
  const setThemeByName = (name: string) => {
    const selectedTheme = allThemes[name];
    if (selectedTheme) {
      setTheme(selectedTheme);
    }
  };
  
  // Alias for setThemeByName for clarity
  const applyTheme = setThemeByName;

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(currentTheme => 
      currentTheme.name === 'light' ? darkTheme : lightTheme
    );
  };
  
  // Function to add or update a custom theme
  const setCustomTheme = (customTheme: Theme) => {
    setCustomThemes(prev => ({
      ...prev,
      [customTheme.name]: customTheme
    }));
  };
  
  // Function to remove a custom theme by name - useful for theme deletion
  const removeCustomTheme = (themeName: string) => {
    setCustomThemes(prev => {
      const updated = { ...prev };
      delete updated[themeName];
      return updated;
    });
    
    // If the currently active theme is being deleted, switch to light theme
    if (currentTheme.name === themeName) {
      setTheme(lightTheme);
      localStorage.setItem('theme', 'light');
    }
  };

  // Load saved theme and custom themes on initial render
  useEffect(() => {
    // Load custom themes from localStorage
    try {
      const savedCustomThemes = localStorage.getItem('customThemes');
      if (savedCustomThemes) {
        const parsedThemes = JSON.parse(savedCustomThemes);
        // Convert from CustomThemeOptions to Theme objects
        const themeEntries = Object.entries(parsedThemes).map(([name, options]) => {
          return [name, createThemeFromCustomOptions(options as any)];
        });
        setCustomThemes(Object.fromEntries(themeEntries));
      }
    } catch (error) {
      console.error('Failed to load custom themes:', error);
    }
    
    // Load active theme
    const savedThemeName = localStorage.getItem('theme');
    if (savedThemeName) {
      // Wait for custom themes to load before setting the theme
      setTimeout(() => {
        if (savedThemeName in allThemes) {
          setTheme(allThemes[savedThemeName]);
        } else {
          // If theme not found, fallback to system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setTheme(prefersDark ? darkTheme : lightTheme);
        }
      }, 0);
    } else {
      // Check system preference if no saved theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? darkTheme : lightTheme);
    }
  }, []);

  // Save theme preference whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme.name);
    
    // Apply theme to document body
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.text.primary;
    
    // Set a data attribute on the html element for CSS selectors
    document.documentElement.setAttribute('data-theme', theme.name);
    
    // If it's a custom theme, apply CSS variables directly
    if (theme.name.startsWith('custom')) {
      // Apply CSS variables directly to the document root
      document.documentElement.style.setProperty('--color-primary', theme.colors.primary);
      document.documentElement.style.setProperty('--color-secondary', theme.colors.secondary);
      document.documentElement.style.setProperty('--color-background', theme.colors.background);
      document.documentElement.style.setProperty('--color-surface', theme.colors.surface);
      document.documentElement.style.setProperty('--color-text-primary', theme.colors.text.primary);
      document.documentElement.style.setProperty('--color-text-secondary', theme.colors.text.secondary);
      document.documentElement.style.setProperty('--color-message-user-bg', theme.colors.message.user.background);
      document.documentElement.style.setProperty('--color-message-user-text', theme.colors.message.user.text);
      document.documentElement.style.setProperty('--color-message-assistant-bg', theme.colors.message.assistant.background);
      document.documentElement.style.setProperty('--color-message-assistant-text', theme.colors.message.assistant.text);
      document.documentElement.style.setProperty('--color-input-bg', theme.colors.input.background);
      document.documentElement.style.setProperty('--color-input-text', theme.colors.input.text);
      document.documentElement.style.setProperty('--color-input-border', theme.colors.input.border);
      
      // Apply typography variables
      document.documentElement.style.fontFamily = theme.typography.fontFamily;
      document.documentElement.style.setProperty('--font-size-small', theme.typography.fontSize.small);
      document.documentElement.style.setProperty('--font-size-medium', theme.typography.fontSize.medium);
      document.documentElement.style.setProperty('--font-size-large', theme.typography.fontSize.large);
      document.documentElement.style.setProperty('--font-size-xlarge', theme.typography.fontSize.xlarge);
      
      // Apply spacing variables
      document.documentElement.style.setProperty('--spacing-small', theme.spacing.small);
      document.documentElement.style.setProperty('--spacing-medium', theme.spacing.medium);
      document.documentElement.style.setProperty('--spacing-large', theme.spacing.large);
      
      // Apply border radius variables
      document.documentElement.style.setProperty('--border-radius-small', theme.borderRadius.small);
      document.documentElement.style.setProperty('--border-radius-medium', theme.borderRadius.medium);
      document.documentElement.style.setProperty('--border-radius-large', theme.borderRadius.large);
    } else {
      // Reset any custom CSS variables if switching away from a custom theme
      const cssProps = [
        '--color-primary', '--color-secondary', '--color-background', '--color-surface',
        '--color-text-primary', '--color-text-secondary', 
        '--color-message-user-bg', '--color-message-user-text',
        '--color-message-assistant-bg', '--color-message-assistant-text',
        '--color-input-bg', '--color-input-text', '--color-input-border',
        '--font-size-small', '--font-size-medium', '--font-size-large', '--font-size-xlarge',
        '--spacing-small', '--spacing-medium', '--spacing-large',
        '--border-radius-small', '--border-radius-medium', '--border-radius-large'
      ];
      
      cssProps.forEach(prop => {
        document.documentElement.style.removeProperty(prop);
      });
      
      document.documentElement.style.removeProperty('font-family');
    }
    
    // Add the transition animation class
    document.body.classList.add('theme-transition');
    
    // Remove the animation class after animation completes
    const timer = setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 500);
    
    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme, 
      availableThemes, 
      setThemeByName,
      setCustomTheme,
      removeCustomTheme,
      currentTheme,
      applyTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
