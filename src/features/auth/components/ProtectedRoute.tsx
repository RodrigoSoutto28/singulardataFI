import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/AuthContext";
import { PageLoader } from "@/shared/components/ui/page-loader";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <PageLoader />;
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}
