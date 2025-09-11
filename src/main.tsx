import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { queryClient } from '@/lib/react-query';
import { RootErrorBoundary } from '@/components/RootErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </RootErrorBoundary>
);