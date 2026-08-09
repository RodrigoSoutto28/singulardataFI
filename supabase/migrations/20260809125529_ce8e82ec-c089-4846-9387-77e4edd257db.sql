CREATE TABLE public.brain_samples (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  session TEXT NOT NULL,
  symbol TEXT NOT NULL,
  timeframe TEXT,
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  structure_tags TEXT[] NOT NULL DEFAULT '{}',
  outcome TEXT NOT NULL,
  r_multiple NUMERIC,
  setup_type TEXT,
  notes TEXT,
  ai_status TEXT NOT NULL DEFAULT 'pending',
  ai_summary TEXT,
  ai_patterns TEXT[] NOT NULL DEFAULT '{}',
  ai_quality_score INTEGER,
  ai_raw JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.brain_samples TO authenticated;
GRANT ALL ON public.brain_samples TO service_role;

ALTER TABLE public.brain_samples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own brain samples" ON public.brain_samples FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own brain samples" ON public.brain_samples FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own brain samples" ON public.brain_samples FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own brain samples" ON public.brain_samples FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX brain_samples_user_created_idx ON public.brain_samples (user_id, created_at DESC);

CREATE TRIGGER update_brain_samples_updated_at
BEFORE UPDATE ON public.brain_samples
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();