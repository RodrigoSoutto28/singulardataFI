-- Add role to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create content type enum
CREATE TYPE public.study_content_type AS ENUM ('summary', 'paper_pdf');

-- Create study_content table
CREATE TABLE public.study_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type public.study_content_type NOT NULL,
    categories TEXT[],
    read_time_minutes INTEGER,
    content_md TEXT,
    pdf_url TEXT,
    week_number INTEGER CHECK (week_number >= 1 AND week_number <= 52),
    published_at TIMESTAMP WITH TIME ZONE,
    is_pro BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create study_progress table
CREATE TABLE public.study_progress (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES public.study_content(id) ON DELETE CASCADE,
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    completed BOOLEAN DEFAULT false,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, content_id)
);

-- Triggers for updated_at
CREATE TRIGGER update_study_content_updated_at BEFORE UPDATE ON public.study_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.study_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;

-- RLS for study_content
CREATE POLICY "Anyone with right plan can view study content"
ON public.study_content FOR SELECT
USING (
    is_pro = false OR 
    (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND subscription_plan IN ('pro', 'power'))) OR
    (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

CREATE POLICY "Admins can insert study content"
ON public.study_content FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update study content"
ON public.study_content FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete study content"
ON public.study_content FOR DELETE
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS for study_progress
CREATE POLICY "Users can view their own progress"
ON public.study_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.study_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.study_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Storage for study-pdfs
INSERT INTO storage.buckets (id, name, public) VALUES ('study-pdfs', 'study-pdfs', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "PDFs are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'study-pdfs');

CREATE POLICY "Admins can upload PDFs" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'study-pdfs' AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update PDFs" ON storage.objects FOR UPDATE USING (
    bucket_id = 'study-pdfs' AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete PDFs" ON storage.objects FOR DELETE USING (
    bucket_id = 'study-pdfs' AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
