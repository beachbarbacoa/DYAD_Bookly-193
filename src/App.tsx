import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Index from '@/pages/Index'
import Login from '@/pages/Login'
import SignUp from '@/pages/SignUp'
import NotFound from '@/pages/NotFound'
import BusinessDashboard from '@/pages/business/Dashboard'
import ConciergeDashboard from '@/pages/concierge/Dashboard'
import { AppHeader } from '@/components/AppHeader'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/sonner'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/business/dashboard',
    element: <BusinessDashboard />,
  },
  {
    path: '/concierge/dashboard',
    element: <ConciergeDashboard />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}>
          <div className="min-h-screen flex flex-col">
            <AppHeader />
            <main className="flex-1">
              {/* RouterProvider will render the matched route here */}
            </main>
          </div>
        </RouterProvider>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App