-- Fix 1: Remove overly-broad SELECT policy on study-pdfs that bypasses pro restriction
DROP POLICY IF EXISTS "Authenticated can read study pdfs" ON storage.objects;

-- Fix 2: Explicitly block non-admin INSERT/UPDATE/DELETE on user_roles to prevent privilege escalation.
-- The existing "Admins can manage roles" (ALL) policy already permits admins; we add restrictive policies
-- to ensure that even if other permissive policies are added later, non-admins cannot mutate roles.
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));