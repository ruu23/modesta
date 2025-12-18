import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/theme";
import { AccessibilityProvider } from "@/components/accessibility";
import { LazyPage } from "@/components/ui/LazyLoad";
import { 
  LazyCloset, 
  LazyOutfitBuilder, 
  LazyChat, 
  LazyCalendar, 
  LazySettings 
} from "@/lib/lazyComponents";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

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

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Onboarding />} />
        <Route path="/home" element={<Index />} />
        <Route 
          path="/closet" 
          element={
            <LazyPage>
              <LazyCloset />
            </LazyPage>
          } 
        />
        <Route 
          path="/outfit-builder" 
          element={
            <LazyPage>
              <LazyOutfitBuilder />
            </LazyPage>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <LazyPage>
              <LazyChat />
            </LazyPage>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <LazyPage>
              <LazyCalendar />
            </LazyPage>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <LazyPage>
              <LazySettings />
            </LazyPage>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <AccessibilityProvider>
    <ThemeProvider defaultTheme="system" storageKey="modesta-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </AccessibilityProvider>
);

export default App;
