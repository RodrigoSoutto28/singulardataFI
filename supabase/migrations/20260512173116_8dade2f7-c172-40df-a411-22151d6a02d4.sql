-- Import batches table to track each import session
CREATE TABLE public.import_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_hash text NOT NULL,
  imported_count integer NOT NULL DEFAULT 0,
  skipped_duplicates integer NOT NULL DEFAULT 0,
  is_undone boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  undone_at timestamp with time zone
);

ALTER TABLE public.import_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own import batches"
  ON public.import_batches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own import batches"
  ON public.import_batches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own import batches"
  ON public.import_batches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own import batches"
  ON public.import_batches FOR DELETE USING (auth.uid() = user_id);

-- Block re-importing the same file while a previous import is still active
CREATE UNIQUE INDEX import_batches_active_file_unique
  ON public.import_batches(user_id, file_hash)
  WHERE is_undone = false;

-- Trace each trade back to its import batch + dedup hash
ALTER TABLE public.trades
  ADD COLUMN import_batch_id uuid REFERENCES public.import_batches(id) ON DELETE SET NULL,
  ADD COLUMN import_row_hash text;

-- Prevent duplicate imported rows per user (only enforced when hash present)
CREATE UNIQUE INDEX trades_import_row_hash_unique
  ON public.trades(user_id, import_row_hash)
  WHERE import_row_hash IS NOT NULL;

CREATE INDEX trades_import_batch_id_idx ON public.trades(import_batch_id);