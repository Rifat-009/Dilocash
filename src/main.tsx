import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register standard PWA service worker for high-fidelity offline mode capability
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Dilocash PWA Service Worker active:', reg.scope))
      .catch((err) => console.log('Service Worker registration failed:', err));
  });
} else if ('serviceWorker' in navigator) {
  // In development, handle registration gracefully
  navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('Dilocash SW Registered (Dev):', reg.scope))
    .catch((err) => console.log('SW Registration bypassed:', err));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

