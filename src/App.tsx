// ... (previous imports)
import { ProtectedRoute } from '@/components/ProtectedRoute'

function AuthWrapper() {
  return (
    <>
      <AppHeader />
      <main className="container py-8">
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
          
          <Route path="/reserve/:businessId" element={<ReservationPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster position="top-center" />
    </>
  )
}
// ... (rest of the file)