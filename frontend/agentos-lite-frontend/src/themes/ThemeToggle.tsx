import React from 'react';
import { useTheme } from './ThemeContext';
import { IconButton } from '@fluentui/react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  // Get appropriate emoji for the current theme
  const getThemeIcon = () => {
    switch(theme.name) {
      case 'dark':
        return '☀️'; // Sun for switching to light
      case 'blue':
        return '🌓'; // Half moon for switching to next theme
      case 'high-contrast':
        return '🔆'; // Brightness for switching to next theme
      case 'light':
      default:
        return '🌙'; // Moon for switching to dark
    }
  };
  
  // Get tooltip text
  const getTooltipText = () => {
    switch(theme.name) {
      case 'light':
        return 'Switch to dark theme';
      case 'dark':
        return 'Switch to light theme';
      default:
        return 'Toggle theme';
    }
  };
  
  return (
    <IconButton
      onClick={toggleTheme}
      title={getTooltipText()}
      ariaLabel={getTooltipText()}
      onRenderIcon={() => (
        <div style={{ fontSize: '20px', paddingTop: '2px' }}>{getThemeIcon()}</div>
      )}
      styles={{
        root: {
          color: '#ffffff',
          marginLeft: theme.spacing.medium,
          padding: '8px',
          borderRadius: theme.borderRadius.small,
          minWidth: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        rootHovered: {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        rootPressed: {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        }
      }}
    />
  );
};

export default ThemeToggle;
