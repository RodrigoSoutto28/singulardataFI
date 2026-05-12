import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { AdminRoute } from "@/features/auth/components/AdminRoute";
import { AppLayout } from "@/shared/components/layout/AppLayout";
import { OnboardingWizard } from "@/features/auth/components/onboarding/OnboardingWizard";
import { useLanguageDetection } from "@/shared/hooks/useLanguageDetection";

// Lazy-loaded pages
const Auth = lazy(() => import("@/features/auth/Auth"));
const ResetPassword = lazy(() => import("@/features/auth/ResetPassword"));
const Terms = lazy(() => import("@/app/Terms"));
const Privacy = lazy(() => import("@/app/Privacy"));
const Dashboard = lazy(() => import("@/features/dashboard/Dashboard"));
const Journal = lazy(() => import("@/features/journal/Journal"));
const Psychology = lazy(() => import("@/features/behavioral/Psychology"));
const AnalyticsHub = lazy(() => import("@/features/analytics/AnalyticsHub"));
const Settings = lazy(() => import("@/features/settings/Settings"));
const Profile = lazy(() => import("@/features/settings/Profile"));
const NotFound = lazy(() => import("@/app/NotFound"));
const StudyAdmin = lazy(() => import("@/features/study/StudyAdmin"));

export const AppRoutes = () => {
  useLanguageDetection();

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/terminos" element={<Terms />} />
      <Route path="/privacidad" element={<Privacy />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <>
              <AppLayout />
              <OnboardingWizard />
            </>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="journal" element={<Journal />} />
        <Route path="psychology" element={<Psychology />} />
        <Route path="analytics" element={<AnalyticsHub />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
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
  );
};
