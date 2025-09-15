import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import NotFound from '@/pages/NotFound';
import BusinessDashboard from '@/pages/business/Dashboard';
import ConciergeDashboard from '@/pages/concierge/Dashboard';
import ReservationPage from '@/pages/reserve/[businessId]';
import { AuthProvider } from '@/context/AuthContext';
import { QueryClientProvider } from '@/lib/react-query';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { queryClient } from '@/lib/react-query';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/business/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <BusinessDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/concierge/dashboard"
              element={
                <ProtectedRoute requiredRole="concierge">
                  <ConciergeDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/reserve/:businessId" element={<ReservationPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}