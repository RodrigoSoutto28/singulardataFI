import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CapitalCardProps {
  title: string;
  value: string | number;
  change?: number;
  variant?: 'balance' | 'pnl';
  className?: string;
  showEdit?: boolean;
  onSave?: (newValue: number) => Promise<void> | void;
}

export function CapitalCard({
  title,
  value,
  change,
  variant = 'balance',
  className,
  showEdit = false,
  onSave,
}: CapitalCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setEditValue(typeof value === 'number' ? value.toString() : '');
    }
  }, [isEditing, value]);

  const handleSave = async () => {
    if (!onSave || !editValue) return;
    
    const numValue = parseFloat(editValue);
    if (isNaN(numValue)) return;

    setIsSaving(true);
    try {
      await onSave(numValue);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const isPositive = change !== undefined && change >= 0;
  const displayValue = typeof value === 'number' 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    : value;

  return (
    <div className={cn('p-5 rounded-lg bg-card border border-border relative group min-h-[140px]', className)}>
      {/* Action Buttons */}
      {showEdit && !isEditing && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </Button>
      )}
      {showEdit && isEditing && (
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setIsEditing(false)}
            disabled={isSaving}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      )}

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
            'text-xs font-medium px-2 py-1 rounded-md',
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
        <div className="mt-2">
          <Input 
            type="text" 
            inputMode="decimal"
            value={editValue}
            onChange={(e) => {
              // Validar solo números y punto decimal
              const val = e.target.value;
              if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                setEditValue(val);
              }
            }}
            placeholder="0.00"
            className="font-mono text-xl h-10 w-full"
            autoFocus
          />
        </div>
      ) : (
        <p className={cn(
          'text-3xl font-bold font-mono tracking-tight truncate',
          variant === 'pnl' && !isPositive && 'text-loss'
        )}>
          {displayValue}
        </p>
      )}
    </div>
  );
}
