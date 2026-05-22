import { supabase } from '@/config/supabase';

/**
 * SHA-256 hash of file contents (hex). Used to detect double uploads
 * of the exact same file before parsing.
 */
export async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Stable per-row hash. Includes user id so the unique index never
 * collides across users. Hashing happens on the client.
 */
export async function hashRow(userId: string, key: string): Promise<string> {
  const data = new TextEncoder().encode(`${userId}::${key}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function findActiveBatchByFileHash(userId: string, fileHash: string) {
  const { data, error } = await supabase
    .from('import_batches')
    .select('id, file_name, created_at, imported_count')
    .eq('user_id', userId)
    .eq('file_hash', fileHash)
    .eq('is_undone', false)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Returns the set of cTrader Position IDs already present in the user's
 * trade history (extracted from the `notes` field where we persist them
 * as `cTrader Position #<id>`). Used to flag per-row duplicates in the
 * preview even when the file hash differs (e.g. re-export with a new name).
 */
export async function findExistingPositionIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('trades')
    .select('notes')
    .eq('user_id', userId)
    .ilike('notes', 'cTrader Position #%');
  if (error) throw error;
  const ids = new Set<string>();
  for (const row of data ?? []) {
    const m = String(row.notes ?? '').match(/cTrader Position #(\d+)/);
    if (m) ids.add(m[1]);
  }
  return ids;
}

export async function createImportBatch(params: {
  userId: string;
  fileName: string;
  fileHash: string;
  importedCount: number;
  skippedDuplicates: number;
}) {
  const { data, error } = await supabase
    .from('import_batches')
    .insert({
      user_id: params.userId,
      file_name: params.fileName,
      file_hash: params.fileHash,
      imported_count: params.importedCount,
      skipped_duplicates: params.skippedDuplicates,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function listImportBatches(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from('import_batches')
    .select('id, file_name, file_hash, imported_count, skipped_duplicates, is_undone, created_at, undone_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getLastActiveBatch(userId: string) {
  const { data, error } = await supabase
    .from('import_batches')
    .select('id, file_name, imported_count, created_at')
    .eq('user_id', userId)
    .eq('is_undone', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function undoImportBatch(userId: string, batchId: string) {
  // Delete all trades that belong to this batch (RLS scoped to user)
  const { error: delError, count } = await supabase
    .from('trades')
    .delete({ count: 'exact' })
    .eq('user_id', userId)
    .eq('import_batch_id', batchId);
  if (delError) throw delError;

  const { error: updError } = await supabase
    .from('import_batches')
    .update({ is_undone: true, undone_at: new Date().toISOString() })
    .eq('id', batchId)
    .eq('user_id', userId);
  if (updError) throw updError;

  return count ?? 0;
}
