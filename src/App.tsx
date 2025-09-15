import { AuthProvider } from '@/context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { SignUp } from '@/pages/SignUp';
import AuthCallback from '@/pages/AuthCallback';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import BusinessDashboard from '@/pages/business/Dashboard';
import ConciergeDashboard from '@/pages/concierge/Dashboard';
import ReservationPage from '@/pages/reserve/[businessId]';
import { Toaster } from '@/components/ui/sonner';
import { QueryClientProvider } from '@/lib/react-query';
import { queryClient } from '@/lib/react-query';
import { AppHeader } from '@/components/AppHeader';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function AuthWrapper() {
  return (
    <>
      <AppHeader />
      <main className="container py-8">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
          
          <Route path="/business/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <BusinessDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/concierge/dashboard" element={
            <ProtectedRoute requiredRole="concierge">
              <ConciergeDashboard />
            </ProtectedRoute>
          } />
          
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

export default App; // This is the crucial fix - ensuring default export