import { Stack, Text, PrimaryButton, TextField } from '@fluentui/react';
import { useState, useRef } from 'react';
import { postAgentQuery } from './lib/api';

type Message = { id: string; role: 'user' | 'assistant'; content: string };

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const send = async () => {
    const content = input.trim();
    if (!content || busy) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setBusy(true);

    try {
      const { reply } = await postAgentQuery(content);
      const aiMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: reply };
      setMessages((prev) => [...prev, aiMsg]);
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
      });
    } catch (err: any) {
      const aiErr: Message = {
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
    <Stack tokens={{ childrenGap: 12, padding: 20 }} styles={{ root: { maxWidth: 900, margin: '0 auto' } }}>
      <Text variant="xLarge">AgentOS Lite — Chat (Fluent UI v8)</Text>

      <div
        ref={listRef}
        style={{
          border: '1px solid #e1e1e1',
          borderRadius: 6,
          padding: 12,
          height: '55vh',
          overflowY: 'auto',
          background: '#fff',
        }}
      >
        <Stack tokens={{ childrenGap: 8 }}>
          {messages.length === 0 ? (
            <Text styles={{ root: { color: '#666' } }}>
              Type a message below to test the mock AI provider.
            </Text>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? '#f3f2f1' : '#eef6ff',
                  borderRadius: 8,
                  padding: '8px 12px',
                  maxWidth: '75%',
                }}
              >
                <Text>
                  <b>{m.role === 'user' ? 'You' : 'Assistant'}:</b> {m.content}
                </Text>
              </div>
            ))
          )}
        </Stack>
      </div>

      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <TextField
          styles={{ root: { flexGrow: 1 } }}
          placeholder="Type a message… (Enter to send)"
          value={input}
          onChange={(_, v) => setInput(v || '')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          disabled={busy}
        />
        <PrimaryButton text={busy ? 'Sending…' : 'Send'} onClick={send} disabled={busy || !input.trim()} />
      </Stack>
    </Stack>
  );
}
