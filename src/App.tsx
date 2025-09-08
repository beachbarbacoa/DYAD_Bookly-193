import { AuthProvider } from '@/context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { SignUp } from '@/pages/SignUp';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import BusinessDashboard from '@/pages/business/Dashboard';
import ConciergeDashboard from '@/pages/concierge/Dashboard';
import ReservationPage from '@/pages/reserve/[businessId]';
import TestAuth from '@/pages/TestAuth';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/business/dashboard" element={<BusinessDashboard />} />
          <Route path="/concierge/dashboard" element={<ConciergeDashboard />} />
          <Route path="/reserve/:businessId" element={<ReservationPage />} />
          <Route path="/test-auth" element={<TestAuth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;