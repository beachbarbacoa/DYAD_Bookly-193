import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AuthProvider } from '@/context/AuthContext'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import { Loader } from '@/components/ui/loader'
import Index from '@/pages/Index'
import Login from '@/pages/Login'
import SignUp from '@/pages/SignUp'
import NotFound from '@/pages/NotFound'
import BusinessDashboard from '@/pages/business/Dashboard'
import ConciergeDashboard from '@/pages/concierge/Dashboard'
import ReservationPage from '@/pages/reserve/[businessId]'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <ErrorBoundary fallback={<div>Page Error - Please refresh</div>}>
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/business/dashboard" element={<BusinessDashboard />} />
                  <Route path="/concierge/dashboard" element={<ConciergeDashboard />} />
                  <Route path="/reserve/:businessId" element={<ReservationPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}