CREATE UNIQUE INDEX IF NOT EXISTS trades_user_import_row_hash_key
  ON public.trades (user_id, import_row_hash)
  WHERE import_row_hash IS NOT NULL;