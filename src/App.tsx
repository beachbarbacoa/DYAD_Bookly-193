import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AuthProvider } from '@/context/AuthContext'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { BrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import { Loader } from '@/components/ui/loader' // Make sure this exists or create it

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
                  {/* Your routes */}
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}