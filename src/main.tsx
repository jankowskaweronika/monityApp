import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { SupabaseProvider } from './context/SupabaseProvider';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SupabaseProvider>
      <App />
    </SupabaseProvider>
  </React.StrictMode>,
);
