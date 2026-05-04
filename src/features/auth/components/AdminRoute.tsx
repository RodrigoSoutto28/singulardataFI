import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/AuthContext";
import { supabase } from "@/config/supabase";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  // Verify admin role server-side via user_roles RLS — never trust profiles.role on the client
  const { data: isAdmin, isLoading: roleLoading } = useQuery({
    queryKey: ["is_admin", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error) return false;
      return !!data;
    },
  });

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Cargando...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

