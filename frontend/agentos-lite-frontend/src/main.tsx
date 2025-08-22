import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fluent v8: initialize MDL2 icons (some components rely on these)
import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
