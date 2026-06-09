import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { AlertTriangle, CheckCircle2, History, Loader2, RefreshCw, Undo2, XCircle } from 'lucide-react';
import { Progress } from '@/shared/components/ui/progress';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { listImportBatches, undoImportBatch } from '@/features/journal/hooks/useImportBatches';
import { toast } from 'sonner';
import { useTrades } from '@/features/journal/hooks/useTrades';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';

interface BatchRow {
  id: string;
  file_name: string;
  file_hash: string;
  imported_count: number;
  skipped_duplicates: number;
  is_undone: boolean;
  created_at: string;
  undone_at: string | null;
}

export function ImportHistorySection() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { refetch } = useTrades();
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [undoingId, setUndoingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await listImportBatches(user.id);
      setBatches(data as BatchRow[]);
    } catch (e) {
      toast.error(t.extra?.loadHistoryError ?? 'Could not load import history');
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUndo = async (batchId: string) => {
    if (!user) return;
    if (!confirm(t.extra?.undoConfirm ?? 'Undo this import?')) return;
    setUndoingId(batchId);
    try {
      const removed = await undoImportBatch(user.id, batchId);
      toast.success((t.extra?.removedTrades ?? 'Removed {n} trades').replace('{n}', String(removed)));
      await Promise.all([load(), refetch()]);
    } catch (e) {
      toast.error(t.extra?.undoError ?? 'Could not undo the import');
    } finally {
      setUndoingId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4 text-primary" />
          {t.extra?.importHistoryTitle ?? 'Import history'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading} className="gap-1.5">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          {t.extra?.refresh ?? 'Refresh'}
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {batches.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {t.extra?.noImportsYet ?? 'No imports yet.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.extra?.colDate ?? 'Date'}</TableHead>
                  <TableHead>{t.extra?.colFile ?? 'File'}</TableHead>
                  <TableHead className="font-mono text-xs">{t.extra?.colHash ?? 'Hash'}</TableHead>
                  <TableHead className="text-right">{t.extra?.colImported ?? 'Imported'}</TableHead>
                  <TableHead className="text-right">{t.extra?.colSkipped ?? 'Skipped'}</TableHead>
                  <TableHead>{t.extra?.colStatus ?? 'Status'}</TableHead>
                  <TableHead className="text-right">{t.extra?.colActions ?? 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="whitespace-nowrap text-xs font-mono-numbers">
                      {new Date(b.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate" title={b.file_name}>
                      {b.file_name}
                    </TableCell>
                    <TableCell
                      className="font-mono text-[10px] text-muted-foreground"
                      title={b.file_hash}
                    >
                      {b.file_hash.slice(0, 10)}…
                    </TableCell>
                    <TableCell className="text-right font-mono-numbers">
                      {b.imported_count}
                    </TableCell>
                    <TableCell className="text-right font-mono-numbers text-muted-foreground">
                      {b.skipped_duplicates}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const total = b.imported_count + b.skipped_duplicates;
                        const ratio = total > 0 ? (b.imported_count / total) * 100 : 0;
                        const hasIssues = b.skipped_duplicates > 0;
                        const allSkipped = total > 0 && b.imported_count === 0;
                        return (
                          <div className="flex flex-col gap-1.5 min-w-[140px]">
                            <div className="flex items-center gap-1.5">
                              {b.is_undone ? (
                                <Badge variant="outline" className="gap-1 text-muted-foreground">
                                  <XCircle className="h-3 w-3" />
                                  {t.extra?.statusUndone ?? 'Undone'}
                                </Badge>
                              ) : allSkipped ? (
                                <Badge variant="outline" className="gap-1 border-destructive/40 text-destructive">
                                  <XCircle className="h-3 w-3" />
                                  {t.extra?.statusNotImported ?? 'Not imported'}
                                </Badge>
                              ) : hasIssues ? (
                                <Badge variant="outline" className="gap-1 border-warn/40 text-warn">
                                  <AlertTriangle className="h-3 w-3" />
                                  {t.extra?.statusWithSkips ?? 'With skips'}
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  {t.extra?.statusActive ?? 'Active'}
                                </Badge>
                              )}
                            </div>
                            {!b.is_undone && total > 0 && (
                              <div className="flex items-center gap-2">
                                <Progress value={ratio} className="h-1.5 flex-1" />
                                <span className="text-[10px] font-mono-numbers text-muted-foreground tabular-nums">
                                  {Math.round(ratio)}%
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-right">
                      {!b.is_undone && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-1.5 h-7"
                          onClick={() => handleUndo(b.id)}
                          disabled={undoingId === b.id}
                        >
                          {undoingId === b.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Undo2 className="h-3.5 w-3.5" />
                          )}
                          {t.extra?.undo ?? 'Undo'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
