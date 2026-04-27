
-- Helper function to check admin role safely (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = 'admin'
  )
$$;

-- ============ study_content admin policies ============
DROP POLICY IF EXISTS "Admins can insert study content" ON public.study_content;
CREATE POLICY "Admins can insert study content"
  ON public.study_content FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update study content" ON public.study_content;
CREATE POLICY "Admins can update study content"
  ON public.study_content FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete study content" ON public.study_content;
CREATE POLICY "Admins can delete study content"
  ON public.study_content FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============ study_progress RLS ============
ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own progress" ON public.study_progress;
CREATE POLICY "Users can view their own progress"
  ON public.study_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own progress" ON public.study_progress;
CREATE POLICY "Users can insert their own progress"
  ON public.study_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON public.study_progress;
CREATE POLICY "Users can update their own progress"
  ON public.study_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all progress" ON public.study_progress;
CREATE POLICY "Admins can view all progress"
  ON public.study_progress FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============ Storage bucket: study-pdfs (private) ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('study-pdfs', 'study-pdfs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: any authenticated user can read PDFs (RLS on study_content controls actual visibility through pdf_url use)
DROP POLICY IF EXISTS "Authenticated can read study pdfs" ON storage.objects;
CREATE POLICY "Authenticated can read study pdfs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'study-pdfs');

DROP POLICY IF EXISTS "Admins can upload study pdfs" ON storage.objects;
CREATE POLICY "Admins can upload study pdfs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'study-pdfs' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update study pdfs" ON storage.objects;
CREATE POLICY "Admins can update study pdfs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'study-pdfs' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete study pdfs" ON storage.objects;
CREATE POLICY "Admins can delete study pdfs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'study-pdfs' AND public.is_admin(auth.uid()));
