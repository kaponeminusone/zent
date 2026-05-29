import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PhoneProvider } from './context/PhoneContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PhoneProvider>
        <App />
      </PhoneProvider>
    </BrowserRouter>
  </StrictMode>,
);
