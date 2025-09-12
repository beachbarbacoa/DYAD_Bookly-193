import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { queryClient } from '@/lib/react-query';
import AppRoutes from '@/routes/AppRoutes';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <Toaster position="top-center" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;