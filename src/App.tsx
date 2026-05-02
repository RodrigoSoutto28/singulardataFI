import { lazy, Suspense } from "react";
import "@/lib/toast"; // Aplica reglas globales de toast (errores persistentes)
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageLoader } from "@/components/ui/page-loader";
import { WelcomeModal } from "@/components/onboarding/WelcomeModal";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { AdminRoute } from "./components/auth/AdminRoute";
import { PreMarketCheckInModal } from "@/components/psychology/PreMarketCheckInModal";
import { usePreMarketCheckIn } from "@/hooks/usePreMarketCheckIn";

// Lazy-loaded pages — code splitting per route
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Journal = lazy(() => import("./pages/Journal"));
const Psychology = lazy(() => import("./pages/Psychology"));
const AnalyticsHub = lazy(() => import("./pages/AnalyticsHub"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const StudyAdmin = lazy(() => import("./pages/admin/StudyAdmin"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <PageLoader />;
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

function PreMarketGate({ children }: { children: React.ReactNode }) {
  const { hasCheckedInToday, isLoading } = usePreMarketCheckIn();
  if (isLoading) {
    return <PageLoader />;
  }
  return (
    <>
      {children}
      <PreMarketCheckInModal open={!hasCheckedInToday} onComplete={() => { /* query invalidates itself */ }} />
    </>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terminos" element={<Terms />} />
        <Route path="/privacidad" element={<Privacy />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PreMarketGate>
                <AppLayout />
                <WelcomeModal />
                <OnboardingTour />
              </PreMarketGate>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="journal" element={<Journal />} />
          <Route path="psychology" element={<Psychology />} />
          <Route path="analytics" element={<AnalyticsHub />} />
          <Route path="insights" element={<Navigate to="/analytics" replace />} />
          <Route path="reports" element={<Navigate to="/analytics" replace />} />
          <Route path="settings" element={<Settings />} />
          <Route
            path="admin/study"
            element={
              <AdminRoute>
                <StudyAdmin />
              </AdminRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <AppRoutes />
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
