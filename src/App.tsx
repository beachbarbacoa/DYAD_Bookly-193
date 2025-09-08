import { ErrorBoundary } from '@/components/ErrorBoundary';
// ... other imports

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
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
  );
}