import React from 'react';
import { Stack, Icon, Text } from '@fluentui/react';

// A list of common Fluent UI icons to test
const iconNames = [
  'Sunny', 'Moon', 'Light', 'DarkMode',
  'Sun', 'ClearNight', 'Weather',
  'FavoriteStarFill', 'CheckMark',
  'Brightness', 'Contrast',
  'DarkTheme', 'LightTheme'
];

const IconTest: React.FC = () => {
  return (
    <Stack tokens={{ childrenGap: 20, padding: 20 }}>
      <Text variant="xLarge">Icon Availability Test</Text>
      <Stack horizontal wrap tokens={{ childrenGap: 10 }}>
        {iconNames.map((iconName) => (
          <Stack key={iconName} tokens={{ childrenGap: 5 }} styles={{ root: { padding: 10, border: '1px solid #ccc', width: 120, alignItems: 'center' } }}>
            <Icon iconName={iconName} style={{ fontSize: 24 }} />
            <Text>{iconName}</Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default IconTest;
