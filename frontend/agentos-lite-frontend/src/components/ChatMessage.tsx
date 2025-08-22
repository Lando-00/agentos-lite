import React from 'react';
import { Text } from '@fluentui/react';
import { useTheme } from '../themes/ThemeContext';

export type MessageProps = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const ChatMessage: React.FC<MessageProps> = ({ role, content }) => {
  const { theme } = useTheme();
  
  const isUser = role === 'user';
  const messageStyles = {
    container: {
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      background: isUser 
        ? theme.colors.message.user.background 
        : theme.colors.message.assistant.background,
      color: isUser 
        ? theme.colors.message.user.text 
        : theme.colors.message.assistant.text,
      borderRadius: theme.borderRadius.medium,
      padding: `${theme.spacing.small} ${theme.spacing.medium}`,
      maxWidth: '75%',
      boxShadow: theme.shadows.small,
      marginBottom: theme.spacing.small,
      // Add animation for messages
      animation: 'fadeIn 0.3s ease-in-out forwards',
      opacity: 0,
    },
  };

  return (
    <div style={messageStyles.container}>
      <Text styles={{ root: { color: 'inherit' } }}>
        <b>{isUser ? 'You' : 'Assistant'}:</b> {content}
      </Text>
    </div>
  );
};

export default ChatMessage;
