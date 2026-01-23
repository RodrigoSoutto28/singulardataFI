-- Create enums for the application
CREATE TYPE public.subscription_plan AS ENUM ('free', 'pro', 'power');
CREATE TYPE public.trade_direction AS ENUM ('long', 'short');
CREATE TYPE public.trade_status AS ENUM ('open', 'closed', 'cancelled');
CREATE TYPE public.asset_class AS ENUM ('forex', 'stocks', 'crypto', 'futures', 'options', 'commodities');
CREATE TYPE public.emotion_type AS ENUM ('confident', 'fearful', 'greedy', 'calm', 'anxious', 'frustrated', 'excited', 'neutral');

-- Profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    subscription_plan subscription_plan DEFAULT 'free',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    timezone TEXT DEFAULT 'UTC',
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trading accounts
CREATE TABLE public.trading_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    broker TEXT,
    account_type TEXT,
    initial_balance DECIMAL(15, 2) DEFAULT 0,
    current_balance DECIMAL(15, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trades table
CREATE TABLE public.trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.trading_accounts(id) ON DELETE SET NULL,
    symbol TEXT NOT NULL,
    asset_class asset_class DEFAULT 'forex',
    direction trade_direction NOT NULL,
    status trade_status DEFAULT 'open',
    entry_price DECIMAL(20, 8) NOT NULL,
    exit_price DECIMAL(20, 8),
    quantity DECIMAL(20, 8) NOT NULL,
    stop_loss DECIMAL(20, 8),
    take_profit DECIMAL(20, 8),
    entry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    exit_date TIMESTAMP WITH TIME ZONE,
    pnl DECIMAL(15, 2),
    pnl_percentage DECIMAL(10, 4),
    commission DECIMAL(15, 2) DEFAULT 0,
    swap DECIMAL(15, 2) DEFAULT 0,
    timeframe TEXT,
    strategy TEXT,
    setup_type TEXT,
    notes TEXT,
    tags TEXT[],
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trade screenshots
CREATE TABLE public.trade_screenshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_id UUID NOT NULL REFERENCES public.trades(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    screenshot_type TEXT DEFAULT 'entry',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Psychology tracking
CREATE TABLE public.psychology_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    trade_id UUID REFERENCES public.trades(id) ON DELETE SET NULL,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    pre_trade_emotion emotion_type,
    post_trade_emotion emotion_type,
    discipline_score INTEGER CHECK (discipline_score >= 1 AND discipline_score <= 10),
    followed_rules BOOLEAN DEFAULT true,
    broken_rules TEXT[],
    market_conditions TEXT,
    mental_state_notes TEXT,
    lessons_learned TEXT,
    goals_for_tomorrow TEXT,
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics snapshots (for tracking progress over time)
CREATE TABLE public.analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.trading_accounts(id) ON DELETE SET NULL,
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_trades INTEGER DEFAULT 0,
    winning_trades INTEGER DEFAULT 0,
    losing_trades INTEGER DEFAULT 0,
    win_rate DECIMAL(5, 2),
    profit_factor DECIMAL(10, 2),
    average_win DECIMAL(15, 2),
    average_loss DECIMAL(15, 2),
    largest_win DECIMAL(15, 2),
    largest_loss DECIMAL(15, 2),
    total_pnl DECIMAL(15, 2),
    max_drawdown DECIMAL(10, 2),
    sharpe_ratio DECIMAL(10, 4),
    equity_value DECIMAL(15, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI insights cache
CREATE TABLE public.ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    severity TEXT DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    is_actionable BOOLEAN DEFAULT false,
    action_taken BOOLEAN DEFAULT false,
    metadata JSONB,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trading rules (user-defined)
CREATE TABLE public.trading_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rule_name TEXT NOT NULL,
    rule_description TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature flags for plans
CREATE TABLE public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_key TEXT NOT NULL UNIQUE,
    feature_name TEXT NOT NULL,
    description TEXT,
    free_plan BOOLEAN DEFAULT false,
    pro_plan BOOLEAN DEFAULT true,
    power_plan BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default feature flags
INSERT INTO public.feature_flags (feature_key, feature_name, description, free_plan, pro_plan, power_plan) VALUES
('basic_journal', 'Basic Trade Journal', 'Log and track trades', true, true, true),
('unlimited_trades', 'Unlimited Trades', 'No limit on number of trades', false, true, true),
('ai_insights', 'AI Insights', 'AI-powered trade analysis', false, true, true),
('advanced_analytics', 'Advanced Analytics', 'Deep statistical analysis', false, true, true),
('backtesting', 'Backtesting Module', 'Test strategies on historical data', false, false, true),
('psychology_tracking', 'Psychology Tracking', 'Track emotions and mental state', true, true, true),
('screenshot_uploads', 'Screenshot Uploads', 'Upload trade screenshots', true, true, true),
('export_reports', 'Export Reports', 'Export data to CSV/PDF', false, true, true),
('multiple_accounts', 'Multiple Accounts', 'Track multiple trading accounts', false, true, true),
('custom_rules', 'Custom Trading Rules', 'Define and track trading rules', false, true, true),
('api_access', 'API Access', 'Access via REST API', false, false, true);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychology_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for trading_accounts
CREATE POLICY "Users can view their own accounts" ON public.trading_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own accounts" ON public.trading_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own accounts" ON public.trading_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own accounts" ON public.trading_accounts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for trades
CREATE POLICY "Users can view their own trades" ON public.trades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own trades" ON public.trades FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trades" ON public.trades FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own trades" ON public.trades FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for trade_screenshots
CREATE POLICY "Users can view their own screenshots" ON public.trade_screenshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own screenshots" ON public.trade_screenshots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own screenshots" ON public.trade_screenshots FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for psychology_entries
CREATE POLICY "Users can view their own psychology entries" ON public.psychology_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own psychology entries" ON public.psychology_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own psychology entries" ON public.psychology_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own psychology entries" ON public.psychology_entries FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for analytics_snapshots
CREATE POLICY "Users can view their own analytics" ON public.analytics_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own analytics" ON public.analytics_snapshots FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for ai_insights
CREATE POLICY "Users can view their own insights" ON public.ai_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own insights" ON public.ai_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own insights" ON public.ai_insights FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for trading_rules
CREATE POLICY "Users can view their own rules" ON public.trading_rules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own rules" ON public.trading_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rules" ON public.trading_rules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rules" ON public.trading_rules FOR DELETE USING (auth.uid() = user_id);

-- Feature flags are readable by all authenticated users
CREATE POLICY "Feature flags are readable by all" ON public.feature_flags FOR SELECT TO authenticated USING (true);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trading_accounts_updated_at BEFORE UPDATE ON public.trading_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_trades_updated_at BEFORE UPDATE ON public.trades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_psychology_entries_updated_at BEFORE UPDATE ON public.psychology_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();