CREATE TABLE public.pre_market_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  allowed_setups TEXT[] NOT NULL DEFAULT '{}',
  max_risk_per_trade NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  max_daily_trades INTEGER NOT NULL DEFAULT 3,
  emotional_state TEXT NOT NULL,
  goals_today TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, checkin_date)
);

ALTER TABLE public.pre_market_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pre-market checkins"
ON public.pre_market_checkins FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pre-market checkins"
ON public.pre_market_checkins FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pre-market checkins"
ON public.pre_market_checkins FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pre-market checkins"
ON public.pre_market_checkins FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_pre_market_checkins_user_date ON public.pre_market_checkins(user_id, checkin_date DESC);