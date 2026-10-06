import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SolanaProvider } from './solana/SolanaProvider';
import './index.css';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <SolanaProvider network="devnet">
      <App />
    </SolanaProvider>
  </StrictMode>
);