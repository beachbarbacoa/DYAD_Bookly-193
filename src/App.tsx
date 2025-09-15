import { RouterProvider, createBrowserRouter } from 'react-router-dom';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    errorElement: <NotFound />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  {
    path: '/business/dashboard',
    element: (
      <ProtectedRoute requiredRole="admin">
        <BusinessDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/concierge/dashboard',
    element: (
      <ProtectedRoute requiredRole="concierge">
        <ConciergeDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/reserve/:businessId',
    element: <ReservationPage />
  }
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Add this default export
export default App;