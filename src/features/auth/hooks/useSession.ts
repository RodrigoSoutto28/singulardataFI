import { useAuth } from './AuthContext';

/** Returns only Supabase session/user/loading. Use when full profile isn't needed. */
export function useSession() {
  const { session, user, loading } = useAuth();
  return { session, user, loading, isAuthenticated: !!session };
}
