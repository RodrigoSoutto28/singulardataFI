import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/AuthContext";
import { PageLoader } from "@/shared/components/ui/page-loader";

// ⚠️ TEMPORARY: Auth bypass for development/preview. Set to false to restore auth.
const BYPASS_AUTH = false;

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (BYPASS_AUTH) {
    return <>{children}</>;
  }
  if (loading) {
    return <PageLoader />;
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}
