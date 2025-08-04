import { useState } from 'react';
import { TextField, PrimaryButton, Stack } from '@fluentui/react';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/agent/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setResponse(data.reply);
  };

  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 32, maxWidth: 600 } }}>
      <h1>AgentOS Lite</h1>
      <TextField
        label="Ask something"
        value={input}
        onChange={(_, val) => setInput(val || '')}
      />
      <PrimaryButton text="Send" onClick={handleSubmit} />
      {response && (
        <div>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </Stack>
  );
}

export default App;