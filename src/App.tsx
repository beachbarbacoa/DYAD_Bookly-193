import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

// Lazy load pages for better performance
const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/Login"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const ReservationPage = lazy(() => import("@/pages/reserve/[businessId]"));
const BusinessDashboard = lazy(() => import("@/pages/business/Dashboard"));
const ConciergeDashboard = lazy(() => import("@/pages/concierge/Dashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={
              <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            }>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/reserve/:businessId" element={<ReservationPage />} />
                <Route path="/business/dashboard" element={<BusinessDashboard />} />
                <Route path="/concierge/dashboard" element={<ConciergeDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}