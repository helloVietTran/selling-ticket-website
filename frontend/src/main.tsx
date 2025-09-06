import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthModalProvider } from './context/auth-modal-context.tsx';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthModalProvider>
     
      <App />
    </AuthModalProvider>
  </StrictMode>
);
