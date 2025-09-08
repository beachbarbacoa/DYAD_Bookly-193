import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ReservationPage } from "./pages/reserve/[businessId]";
import { BusinessDashboard } from "./pages/business/Dashboard";
import { AuthProvider } from "@/context/AuthContext";
import { ConciergeDashboard } from "./pages/concierge/Dashboard";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reserve/:businessId" element={<ReservationPage />} />
            <Route path="/business/dashboard" element={<BusinessDashboard />} />
            <Route path="/concierge/dashboard" element={<ConciergeDashboard />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;