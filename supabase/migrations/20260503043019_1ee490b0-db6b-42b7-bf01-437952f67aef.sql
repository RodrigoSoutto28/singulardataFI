ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'es'
    CHECK (language IN ('es','en','pt','fr'));

CREATE INDEX IF NOT EXISTS idx_profiles_language ON public.profiles(language);