CREATE POLICY "Restrict role visibility to self or admin"
ON public.user_roles
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR has_role(auth.uid(), 'admin'::app_role)
);