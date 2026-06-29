-- Create psychological_errors table and establish RLS policies
CREATE TABLE IF NOT EXISTS public.psychological_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  trade_id uuid REFERENCES public.trades(id) ON DELETE SET NULL,
  error_type text NOT NULL,
  confidence text NOT NULL,
  reason text,
  cost_dollars numeric NOT NULL DEFAULT 0.0,
  was_prevented boolean NOT NULL DEFAULT false,
  metadata jsonb,
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.psychological_errors ENABLE ROW LEVEL SECURITY;

-- Establish isolative RLS policies
CREATE POLICY "Users can view own errors" ON public.psychological_errors FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own errors" ON public.psychological_errors FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own errors" ON public.psychological_errors FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own errors" ON public.psychological_errors FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create optimized index
CREATE INDEX IF NOT EXISTS idx_psychological_errors_user ON public.psychological_errors(user_id, timestamp DESC);
