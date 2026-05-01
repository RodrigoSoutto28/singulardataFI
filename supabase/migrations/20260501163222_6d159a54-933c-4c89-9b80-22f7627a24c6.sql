-- =========================================================
-- 1) Create app_role enum + user_roles table (separate from profiles)
-- =========================================================
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Migrate existing admins from profiles.role into user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM public.profiles
WHERE role = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;

-- =========================================================
-- 2) has_role() SECURITY DEFINER (no recursion)
-- =========================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- =========================================================
-- 3) Replace is_admin() to use user_roles (keeps existing policies working)
-- =========================================================
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'admin'::public.app_role
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

-- =========================================================
-- 4) RLS policies on user_roles
-- =========================================================
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 5) Tighten profiles UPDATE policy (prevent self role / subscription escalation)
-- =========================================================
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile (safe columns)"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  -- Block self-elevation: role and subscription_plan cannot be changed by the user
  AND role IS NOT DISTINCT FROM (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
  AND subscription_plan IS NOT DISTINCT FROM (SELECT p.subscription_plan FROM public.profiles p WHERE p.id = auth.uid())
  AND subscription_expires_at IS NOT DISTINCT FROM (SELECT p.subscription_expires_at FROM public.profiles p WHERE p.id = auth.uid())
);

-- Admins can still update any profile (e.g. to change roles / plans)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 6) study_content: require authentication (no anonymous free-tier reads)
-- =========================================================
DROP POLICY IF EXISTS "Anyone with right plan can view study content" ON public.study_content;

CREATE POLICY "Authenticated users with right plan can view study content"
ON public.study_content FOR SELECT TO authenticated
USING (
  is_pro = false
  OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.subscription_plan IN ('pro'::subscription_plan, 'power'::subscription_plan)
  )
  OR public.has_role(auth.uid(), 'admin')
);

-- =========================================================
-- 7) study-pdfs storage bucket: make private + plan-gated SELECT
-- =========================================================
UPDATE storage.buckets SET public = false WHERE id = 'study-pdfs';

DROP POLICY IF EXISTS "PDFs are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read study PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Pro users can read study PDFs" ON storage.objects;

CREATE POLICY "Pro users can read study PDFs"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'study-pdfs'
  AND (
    public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.subscription_plan IN ('pro'::subscription_plan, 'power'::subscription_plan)
    )
  )
);

-- Admin write policies for study-pdfs (preserve admin uploads)
DROP POLICY IF EXISTS "Admins can upload study PDFs" ON storage.objects;
CREATE POLICY "Admins can upload study PDFs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'study-pdfs' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update study PDFs" ON storage.objects;
CREATE POLICY "Admins can update study PDFs"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'study-pdfs' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete study PDFs" ON storage.objects;
CREATE POLICY "Admins can delete study PDFs"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'study-pdfs' AND public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- 8) Lock down other SECURITY DEFINER helpers
-- =========================================================
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;