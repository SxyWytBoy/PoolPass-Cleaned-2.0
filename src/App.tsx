import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pools from "./pages/Pools";
import PoolDetail from "./pages/PoolDetail";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import HostDashboard from "./pages/HostDashboard";
import HostLogin from "./pages/HostLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import CrmSettings from "./pages/CrmSettings";
import HowItWorksPage from "./pages/HowItWorksPage";
import HostPage from "./pages/HostPage";
import SafetyPage from "./pages/SafetyPage";
import Waitlist from "./pages/Waitlist";
import HostApply from "./pages/HostApply";
import Watermark from "./components/Watermark";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Watermark />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pools" element={<Pools />} />
            <Route path="/pools/:id" element={<PoolDetail />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/host" element={<HostPage />} />
            <Route path="/host-apply" element={<HostApply />} />
            <Route path="/host-login" element={<HostLogin />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host-dashboard"
              element={
                <HostDashboard />
              }
            />
            <Route
              path="/crm-settings"
              element={
                <ProtectedRoute userType="host">
                  <CrmSettings />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
