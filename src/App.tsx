import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, MemoryRouter, Routes, Route } from "react-router-dom";
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
import InfoPage from "./pages/InfoPage";
import VenuePage from "./pages/VenuePage";
import ScrollToTop from "./components/ScrollToTop";

const INFO_PAGES = [
  "about", "careers", "press", "blog", "gift-cards", "help", "contact",
  "terms", "privacy", "host-resources", "host-forum", "responsible-hosting",
];

// "browser" (default) gives clean URLs and needs the host to serve index.html for
// unknown paths. "hash" and "memory" suit static hosts and embedded previews.
const routerMode = import.meta.env.VITE_ROUTER_MODE;
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

const Router = ({ children }: { children: React.ReactNode }) => {
  if (routerMode === "hash") return <HashRouter>{children}</HashRouter>;
  if (routerMode === "memory") return <MemoryRouter>{children}</MemoryRouter>;
  return <BrowserRouter basename={basename === "." ? undefined : basename}>{children}</BrowserRouter>;
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Watermark />
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pools" element={<Pools />} />
            <Route path="/pools/:id" element={<PoolDetail />} />
            <Route path="/venues/:slug" element={<VenuePage />} />
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
                <ProtectedRoute userType="host">
                  <HostDashboard />
                </ProtectedRoute>
              }
            />
            {INFO_PAGES.map((slug) => (
              <Route key={slug} path={`/${slug}`} element={<InfoPage />} />
            ))}
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
        </Router>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
