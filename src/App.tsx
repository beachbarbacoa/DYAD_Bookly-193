import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import BusinessDashboard from "@/pages/business/Dashboard";
import ConciergeDashboard from "@/pages/concierge/Dashboard";
import NotFound from "@/pages/NotFound";
import { AffiliateLink } from "@/pages/concierge/AffiliateLink";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/business/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/concierge/dashboard"
          element={
            <ProtectedRoute requiredRole="concierge">
              <ConciergeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/concierge/business/:businessId"
          element={
            <ProtectedRoute requiredRole="concierge">
              <AffiliateLink />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;