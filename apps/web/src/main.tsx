import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/base.css';
import './styles/controls.css';
import './styles/table.css';
import './styles/shell.css';
import './styles/home.css';
import './styles/pos.css';
import './styles/nota.css';
import './styles/payment.css';
import './styles/stamp.css';
import './styles/print.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
