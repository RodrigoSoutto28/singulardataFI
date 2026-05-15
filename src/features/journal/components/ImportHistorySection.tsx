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
import { History, Loader2, RefreshCw, Undo2 } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { listImportBatches, undoImportBatch } from '@/features/journal/hooks/useImportBatches';
import { toast } from 'sonner';
import { useTrades } from '@/features/journal/hooks/useTrades';

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
      toast.error('No se pudo cargar el historial de importaciones');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUndo = async (batchId: string) => {
    if (!user) return;
    if (!confirm('¿Deshacer esta importación? Se eliminarán las operaciones cargadas.')) return;
    setUndoingId(batchId);
    try {
      const removed = await undoImportBatch(user.id, batchId);
      toast.success(`Se eliminaron ${removed} operaciones`);
      await Promise.all([load(), refetch()]);
    } catch (e) {
      toast.error('No se pudo deshacer la importación');
    } finally {
      setUndoingId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4 text-primary" />
          Historial de importaciones
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading} className="gap-1.5">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Actualizar
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {batches.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Aún no has importado archivos.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Archivo</TableHead>
                  <TableHead className="font-mono text-xs">Hash</TableHead>
                  <TableHead className="text-right">Importadas</TableHead>
                  <TableHead className="text-right">Omitidas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
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
                      {b.is_undone ? (
                        <Badge variant="outline" className="text-muted-foreground">
                          Deshecho
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Activo</Badge>
                      )}
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
                          Deshacer
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
