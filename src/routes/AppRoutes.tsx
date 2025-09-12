import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import NotFound from '@/pages/NotFound';
import BusinessDashboard from '@/pages/business/Dashboard';
import ConciergeDashboard from '@/pages/concierge/Dashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppHeader } from '@/components/AppHeader';

export default function AppRoutes() {
  return (
    <>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
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
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}