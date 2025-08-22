import React from 'react';
import { Stack, Text } from '@fluentui/react';
import { useTheme } from '../themes/ThemeContext';
import ThemeToggle from '../themes/ThemeToggle';
import ThemeSelector from '../themes/ThemeSelector';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { theme } = useTheme();
  
  return (
    <Stack 
      horizontal 
      horizontalAlign="space-between" 
      verticalAlign="center"
      className="slideIn"
      styles={{
        root: {
          padding: `${theme.spacing.small} ${theme.spacing.medium}`,
          borderRadius: theme.borderRadius.medium,
          background: theme.colors.primary,
          color: '#ffffff',  // Always white text on the primary color background
          marginBottom: theme.spacing.medium,
          boxShadow: theme.shadows.medium,
        }
      }}
    >
      <Text 
        variant="xLarge" 
        styles={{ 
          root: { 
            color: '#ffffff',
            fontWeight: 600,
            padding: theme.spacing.small,
          } 
        }}
      >
        {title}
      </Text>
      <Stack horizontal verticalAlign="center">
        <ThemeSelector label="" />
        <ThemeToggle />
      </Stack>
    </Stack>
  );
};

export default Header;
