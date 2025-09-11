import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { Index } from '@/pages/Index';
import { Login } from '@/pages/Login';
import { SignUp } from '@/pages/SignUp';
import { NotFound } from '@/pages/NotFound';
import { BusinessDashboard } from '@/pages/business/Dashboard';
import { ConciergeDashboard } from '@/pages/concierge/Dashboard';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppHeader } from '@/components/AppHeader';
import { Toaster } from '@/components/ui/sonner';

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
  }
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppHeader />
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}