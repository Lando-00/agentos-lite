import { useState } from 'react';
import { TextField, PrimaryButton, Stack, Spinner } from '@fluentui/react';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setResponse('');
    try {
      const res = await fetch('/api/agent/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      console.error(err);
      setResponse('Oops — request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStream = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/agent/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      if (!res.body) throw new Error('No stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setResponse(prev => prev + chunk);
      }
    } catch (err) {
      console.error(err);
      setResponse('Streaming failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { maxWidth: 680, margin: '40px auto' } }}>
      <TextField
        label="Message"
        multiline
        disabled={isLoading}
        value={input}
        onChange={(_, v) => setInput(v || '')}
      />
      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <PrimaryButton text={isLoading ? 'Sending…' : 'Send'} onClick={handleSubmit} disabled={isLoading} />
        <PrimaryButton text={isLoading ? 'Streaming…' : 'Stream'} onClick={handleStream} disabled={isLoading} />
      </Stack>
      {isLoading && <Spinner label="Thinking…" />}
      {response && (
        <div>
          <strong>Response:</strong>
          <p style={{ whiteSpace: 'pre-wrap' }}>{response}</p>
        </div>
      )}
    </Stack>
  );
}

export default App;