import React, { useState } from 'react';
import { Stack, TextField, PrimaryButton } from '@fluentui/react';
import { useTheme } from '../themes/ThemeContext';

interface ChatInputProps {
  onSend: (message: string) => void;
  isBusy: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isBusy }) => {
  const { theme } = useTheme();
  const [input, setInput] = useState('');
  
  const handleSend = () => {
    const message = input.trim();
    if (message && !isBusy) {
      onSend(message);
      setInput('');
    }
  };

  return (
    <Stack 
      horizontal 
      tokens={{ childrenGap: 8 }} 
      styles={{ 
        root: { 
          marginTop: theme.spacing.medium,
          padding: theme.spacing.small,
          borderRadius: theme.borderRadius.medium,
          background: theme.colors.surface,
          boxShadow: theme.shadows.small,
        } 
      }}
    >
      <TextField
        styles={{
          root: { flexGrow: 1 },
          fieldGroup: {
            borderColor: theme.colors.input.border,
            backgroundColor: theme.colors.input.background,
            ':hover': { borderColor: theme.colors.primary },
          },
          field: { color: theme.colors.input.text }
        }}
        placeholder="Type a message… (Enter to send)"
        value={input}
        onChange={(_, v) => setInput(v || '')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        disabled={isBusy}
        autoFocus
      />
      <PrimaryButton
        text={isBusy ? 'Sending…' : 'Send'}
        onClick={handleSend}
        disabled={isBusy || !input.trim()}
        styles={{
          root: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
          },
          rootHovered: {
            backgroundColor: theme.colors.secondary,
            borderColor: theme.colors.secondary,
          },
          rootDisabled: {
            opacity: 0.7,
          }
        }}
      />
    </Stack>
  );
};

export default ChatInput;
