import { Stack } from '@fluentui/react';
import { useState } from 'react';
import { postAgentQuery } from './lib/api';
import { ThemeProvider, useTheme } from './themes/ThemeContext';
import { usePage } from './components/page/PageContext';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import ChatInput from './components/ChatInput';
import type { MessageProps } from './components/ChatMessage';
import MenuProvider from './components/menu/MenuContext';
import Menu from './components/menu/Menu';
import MenuItemsRegistration from './components/MenuItemsRegistration';
import PageProvider from './components/page/PageContext';
import AppLayout from './components/AppLayout';

// The main app component that will be wrapped with ThemeProvider
function AppContent() {
  const { theme } = useTheme();
  const { activePage } = usePage();
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [busy, setBusy] = useState(false);

  const handleSend = async (content: string) => {
    if (!content || busy) return;

    const userMsg: MessageProps = { 
      id: crypto.randomUUID(), 
      role: 'user', 
      content 
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setBusy(true);

    try {
      const { reply } = await postAgentQuery(content);
      const aiMsg: MessageProps = { 
        id: crypto.randomUUID(), 
        role: 'assistant', 
        content: reply 
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const aiErr: MessageProps = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${err?.message ?? 'Something went wrong'}`,
      };
      setMessages((prev) => [...prev, aiErr]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack
      verticalFill
      tokens={{ childrenGap: 12 }}
      styles={{ 
        root: { 
          height: '100%', 
          maxWidth: '100%', 
          backgroundColor: theme.colors.background,
          transition: 'background-color 0.3s ease',
          padding: 0,
          display: activePage === 'chat' ? 'flex' : 'none', // Hide on menu pages
        } 
      }}
    >
      {/* Header with title and theme toggle */}
      <Header title="AgentOS Lite — Chat" />
      
      {/* Chat container with messages */}
      <ChatContainer messages={messages} />
      
      {/* Input area */}
      <ChatInput onSend={handleSend} isBusy={busy} />
    </Stack>
  );
}

// Wrap the app content with providers
export default function App() {
  return (
    <ThemeProvider>
      <MenuProvider>
        <PageProvider>
          <AppLayout>
            <AppContent />
          </AppLayout>
          <Menu />
          <MenuItemsRegistration />
        </PageProvider>
      </MenuProvider>
    </ThemeProvider>
  );
}
