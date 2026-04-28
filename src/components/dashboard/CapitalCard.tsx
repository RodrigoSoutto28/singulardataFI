import { cn } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

interface CapitalCardProps {
  title: string;
  value: string | number;
  change?: number;
  variant?: 'balance' | 'pnl';
  className?: string;
  onEdit?: () => void;
  showEdit?: boolean;
  /** Enables inline numeric edit with check/cancel controls. */
  editable?: boolean;
  /** Persists the new numeric value. Receives a parsed number. */
  onSaveValue?: (value: number) => void | Promise<void>;
  /** Disables the confirm button while a save is in flight. */
  isSaving?: boolean;
}

export function CapitalCard({
  title,
  value,
  change,
  variant = 'balance',
  className,
  onEdit,
  showEdit = false,
  editable = false,
  onSaveValue,
  isSaving = false,
}: CapitalCardProps) {
  const isPositive = change !== undefined && change >= 0;

  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const numericValue =
    typeof value === 'number'
      ? value
      : parseFloat(String(value).replace(/[^0-9.\-]/g, '')) || 0;

  const displayValue =
    typeof value === 'number'
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
      : value;

  useEffect(() => {
    if (isEditing) {
      setDraft(String(numericValue ?? ''));
      // Defer focus until input mounts
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isEditing]); // eslint-disable-line react-hooks/exhaustive-deps

  // Only digits + single decimal point, no negatives
  const handleDraftChange = (raw: string) => {
    if (raw === '' || /^\d*\.?\d*$/.test(raw)) {
      setDraft(raw);
    }
  };

  const isValid = draft.trim() !== '' && !isNaN(parseFloat(draft)) && parseFloat(draft) >= 0;

  const handleConfirm = async () => {
    if (!isValid || !onSaveValue) return;
    await onSaveValue(parseFloat(draft));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div className={cn('p-4 md:p-5 rounded-lg bg-card border border-border relative group', className)}>
      {/* Top-right action area */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
              onClick={handleConfirm}
              disabled={!isValid || isSaving}
              aria-label="Confirmar"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={handleCancel}
              disabled={isSaving}
              aria-label="Cancelar"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            {editable && onSaveValue && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                onClick={() => setIsEditing(true)}
                aria-label="Editar balance inicial"
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            {showEdit && onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                onClick={onEdit}
                aria-label="Editar cuenta"
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </>
        )}
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'p-2.5 rounded-lg',
          variant === 'balance' ? 'bg-primary/10' : 'bg-muted'
        )}>
          {variant === 'balance' ? (
            <Wallet className="h-6 w-6 text-primary" />
          ) : isPositive ? (
            <TrendingUp className="h-6 w-6 text-profit" />
          ) : (
            <TrendingDown className="h-6 w-6 text-loss" />
          )}
        </div>
        {!isEditing && change !== undefined && (
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-md mr-16',
            isPositive
              ? 'bg-success/10 text-success'
              : 'bg-destructive/10 text-destructive'
          )}>
            {isPositive ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
        {title}
      </p>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <span className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-muted-foreground">$</span>
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={draft}
            onChange={(e) => handleDraftChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            className={cn(
              'flex-1 min-w-0 bg-transparent border-b-2 outline-none',
              'text-2xl md:text-3xl font-bold font-mono tracking-tight',
              isValid ? 'border-primary' : 'border-destructive/60'
            )}
            placeholder="0.00"
          />
        </div>
      ) : (
        <p className={cn(
          'text-2xl md:text-3xl font-bold font-mono tracking-tight',
          variant === 'pnl' && !isPositive && 'text-loss'
        )}>
          {displayValue}
        </p>
      )}
    </div>
  );
}
