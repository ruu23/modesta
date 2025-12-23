import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/theme";
import { AccessibilityProvider } from "@/components/accessibility";
import { LazyCloset, LazyOutfitBuilder, LazyChat, LazyCalendar, LazySettings } from "@/lib/lazyComponents";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import NotFound from "./pages/NotFound";
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import VerifyEmail from "./pages/VerifyEmail";
import CheckEmail from './pages/CheckEmail';
import { useAuth } from './contexts/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <AuthProvider navigate={navigate}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Onboarding />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/closet"
            element={
              <ProtectedRoute>
                <LazyCloset />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outfit-builder"
            element={
              <ProtectedRoute>
                <LazyOutfitBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <LazyChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <LazyCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <LazySettings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Toaster />
      <Sonner />
    </AuthProvider>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AccessibilityProvider>
          <TooltipProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;