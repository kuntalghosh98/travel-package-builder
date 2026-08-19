import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { AppProviders } from './app/providers.jsx';
import { AppRouter } from './app/router.jsx';

createRoot(document.getElementById('root')).render(
  <AppProviders>
    <AppRouter />
  </AppProviders>
);
