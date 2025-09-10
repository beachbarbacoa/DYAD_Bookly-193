import { AuthProvider } from '@/context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { SignUp } from '@/pages/SignUp';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import BusinessDashboard from '@/pages/business/Dashboard';
import ConciergeDashboard from '@/pages/concierge/Dashboard';
import ReservationPage from '@/pages/reserve/[businessId]';
import { Toaster } from '@/components/ui/sonner';
import { QueryClientProvider } from '@/lib/react-query';
import { queryClient } from '@/lib/react-query';
import { AppHeader } from '@/components/AppHeader';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

function AuthWrapper() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="container py-8">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/business/dashboard" element={<BusinessDashboard />} />
          <Route path="/concierge/dashboard" element={<ConciergeDashboard />} />
          <Route path="/reserve/:businessId" element={<ReservationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster position="top-center" />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AuthWrapper />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;