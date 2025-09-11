// ... existing imports
import { AffiliateLink } from "@/pages/concierge/AffiliateLink";

function AuthWrapper() {
  return (
    <>
      <AppHeader />
      <main className="container py-8">
        <Routes>
          {/* ... existing routes */}
          <Route 
            path="/concierge/business/:businessId" 
            element={
              <ProtectedRoute requiredRole="concierge">
                <AffiliateLink />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Toaster position="top-center" />
    </>
  );
}