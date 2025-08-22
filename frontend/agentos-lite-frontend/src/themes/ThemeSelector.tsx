import React, { useRef } from 'react';
import { useTheme } from '../themes/ThemeContext';
import { Dropdown, Stack, Text } from '@fluentui/react';
import type { IDropdownOption } from '@fluentui/react';
import { themeNames } from '../themes/ThemeContext';

interface ThemeSelectorProps {
  label?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ label = 'Theme:' }) => {
  const { theme, availableThemes, setThemeByName } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Convert available themes to dropdown options
  const options: IDropdownOption[] = availableThemes.map(t => ({
    key: t.name,
    text: themeNames[t.name] || t.name,
    data: t
  }));

  const handleChange = (_: any, option?: IDropdownOption) => {
    if (option) {
      setThemeByName(option.key as string);
    }
  };

  return (
    <Stack 
      horizontal 
      verticalAlign="center"
      tokens={{ childrenGap: 8 }}
      styles={{
        root: {
          marginLeft: '12px',
        }
      }}
    >
      {label && (
        <Text
          styles={{
            root: {
              color: '#ffffff',
              fontWeight: 500,
              marginRight: '8px',
            }
          }}
        >
          {label}
        </Text>
      )}
      <div ref={dropdownRef}>
        <Dropdown
          selectedKey={theme.name}
          onChange={handleChange}
          options={options}
          styles={{
            root: {
              width: 120,
            },
            dropdown: {
              color: '#ffffff',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              ':hover': {
                border: '1px solid #ffffff',
              },
              ':focus': {
                border: '1px solid #ffffff',
              },
            },
            title: {
              color: '#ffffff',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'transparent',
              padding: '4px 8px',
              ':hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            },
            caretDownWrapper: {
              color: '#ffffff',
            },
            caretDown: {
              color: '#ffffff',
            },
          }}
        />
      </div>
    </Stack>
  );
};

export default ThemeSelector;
