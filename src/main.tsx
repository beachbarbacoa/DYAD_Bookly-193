import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Named import
import { queryClient } from "@/lib/react-query";
import { AuthErrorBoundary } from "@/components/AuthErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthErrorBoundary>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AuthErrorBoundary>
    </QueryClientProvider>
  </BrowserRouter>
);