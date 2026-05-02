
CREATE TABLE public.process_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  trade_id uuid NOT NULL,
  matched_setup boolean NOT NULL,
  respected_sl boolean NOT NULL,
  correct_position_size boolean NOT NULL,
  waited_confirmation boolean NOT NULL,
  closed_as_planned boolean NOT NULL,
  adherence_score integer NOT NULL CHECK (adherence_score BETWEEN 0 AND 5),
  reflection_note text,
  ai_message_type text,
  ai_message_shown text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, trade_id)
);

ALTER TABLE public.process_validations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own validations" ON public.process_validations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own validations" ON public.process_validations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own validations" ON public.process_validations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own validations" ON public.process_validations FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_process_validations_user ON public.process_validations(user_id, created_at DESC);

CREATE TABLE public.user_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  streak_type text NOT NULL,
  current_count integer NOT NULL DEFAULT 0,
  best_count integer NOT NULL DEFAULT 0,
  start_date date,
  last_activity_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, streak_type)
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks" ON public.user_streaks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streaks" ON public.user_streaks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON public.user_streaks FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own streaks" ON public.user_streaks FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_user_streaks_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
