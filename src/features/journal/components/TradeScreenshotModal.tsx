import { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Loader2, Upload, Trash2, Image, X, ZoomIn } from 'lucide-react';
import { useTradeScreenshots, type TradeScreenshot } from '@/features/journal/hooks/useTradeScreenshots';
import { cn } from '@/shared/lib/utils';
import { Trade } from '@/features/journal/hooks/useTrades';

interface TradeScreenshotModalProps {
  open: boolean;
  onClose: () => void;
  trade: Trade;
}

export function TradeScreenshotModal({ open, onClose, trade }: TradeScreenshotModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState('');
  const [screenshots, setScreenshots] = useState<TradeScreenshot[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [zoomedUrl, setZoomedUrl] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { uploading, uploadScreenshot, fetchScreenshots, deleteScreenshot } = useTradeScreenshots();

  // Load screenshots when modal opens
  useEffect(() => {
    if (!open) return;
    setLoadingList(true);
    fetchScreenshots(trade.id)
      .then(setScreenshots)
      .finally(() => setLoadingList(false));
  }, [open, trade.id]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadScreenshot(trade.id, file, caption || undefined);
    if (result) {
      setScreenshots((prev) => [result, ...prev]);
      setCaption('');
    }

    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (screenshot: TradeScreenshot) => {
    setDeletingId(screenshot.id);
    const ok = await deleteScreenshot(screenshot.id, screenshot.image_url);
    if (ok) {
      setScreenshots((prev) => prev.filter((s) => s.id !== screenshot.id));
    }
    setDeletingId(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-5 pt-5 pb-3 border-b border-border shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Image className="h-4 w-4 text-primary" />
              Capturas de operación
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {trade.symbol} · {trade.direction === 'long' ? '▲ Long' : '▼ Short'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Upload section */}
            <div className="space-y-3">
              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Agregar nueva captura
              </Label>
              <Input
                placeholder="Descripción opcional (ej: entrada, setup)"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="bg-muted/30 text-sm"
                disabled={uploading}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 border-dashed hover:border-primary/50"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? 'Subiendo...' : 'Seleccionar imagen'}
              </Button>
              <p className="text-[10px] text-muted-foreground text-center">
                PNG, JPG, WEBP o GIF · máx. 5 MB
              </p>
            </div>

            {/* Existing screenshots */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Capturas guardadas
              </Label>

              {loadingList ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : screenshots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Image className="h-10 w-10 mb-2 opacity-20" />
                  <p className="text-sm">No hay capturas aún</p>
                  <p className="text-xs opacity-60">Subí una imagen para documentar esta operación</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {screenshots.map((sc) => (
                    <div
                      key={sc.id}
                      className="relative group rounded-md overflow-hidden border border-border bg-muted/20"
                    >
                      <img
                        src={sc.image_url}
                        alt={sc.caption ?? 'Captura de operación'}
                        className="w-full h-32 object-cover cursor-zoom-in"
                        onClick={() => setZoomedUrl(sc.image_url)}
                        loading="lazy"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setZoomedUrl(sc.image_url)}
                          className="p-1.5 rounded-md bg-muted hover:bg-muted/80 transition-colors"
                          title="Ver a pantalla completa"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(sc)}
                          disabled={deletingId === sc.id}
                          className={cn(
                            'p-1.5 rounded-md bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors',
                            deletingId === sc.id && 'opacity-50 cursor-wait'
                          )}
                          title="Eliminar captura"
                        >
                          {deletingId === sc.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {sc.caption && (
                        <p className="text-[10px] text-muted-foreground px-2 py-1 truncate border-t border-border bg-background/50">
                          {sc.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 px-5 py-3 border-t border-border flex justify-end">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox / zoom view */}
      {zoomedUrl && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90 backdrop-blur-sm"
          onClick={() => setZoomedUrl(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            onClick={() => setZoomedUrl(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={zoomedUrl}
            alt="Captura ampliada"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
