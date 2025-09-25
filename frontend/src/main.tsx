import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthModalProvider } from './context/auth-modal-context.tsx';
import { AuthProvider } from './context/auth-context.tsx';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AuthModalProvider>
        <App />
      </AuthModalProvider>
    </AuthProvider>
  </StrictMode>
);
