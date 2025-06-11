import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import { SupabaseProvider } from './context/SupabaseProvider';
import { store } from './store/store';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <SupabaseProvider>
        <App />
      </SupabaseProvider>
    </Provider>
  </React.StrictMode>,
);
