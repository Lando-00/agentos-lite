import React, { useRef, useEffect } from 'react';
import { Text } from '@fluentui/react';
import { useTheme } from '../themes/ThemeContext';
import ChatMessage from './ChatMessage';
import type { MessageProps } from './ChatMessage';

interface ChatContainerProps {
  messages: MessageProps[];
  emptyMessage?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, 
  emptyMessage = "What's on the Agenda today my dude?"
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      style={{
        border: `1px solid ${theme.colors.input.border}`,
        borderRadius: theme.borderRadius.medium,
        padding: theme.spacing.medium,
        flexGrow: 1, 
        minHeight: 300,
        overflowY: 'auto',
        background: theme.colors.surface,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.small,
        boxShadow: theme.shadows.small,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      {messages.length === 0 ? (
        <Text styles={{ root: { color: theme.colors.text.secondary, textAlign: 'center', marginTop: theme.spacing.large } }}>
          {emptyMessage}
        </Text>
      ) : (
        messages.map((m) => (
          <ChatMessage key={m.id} {...m} />
        ))
      )}
    </div>
  );
};

export default ChatContainer;
