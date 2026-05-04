import { LucideIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
  className?: string;
  variant?: 'default' | 'error';
}

/**
 * Estado vacío unificado: ícono + título + subtítulo + UN botón principal.
 * Para errores, usa variant="error" con actionLabel="Reintentar".
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  className,
  variant = 'default',
}: EmptyStateProps) {
  const isError = variant === 'error';
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-4',
        className,
      )}
      role={isError ? 'alert' : undefined}
    >
      <div
        className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
          isError ? 'bg-destructive/10' : 'bg-muted/50',
        )}
      >
        <Icon
          className={cn(
            'h-7 w-7',
            isError ? 'text-destructive' : 'text-muted-foreground',
          )}
          aria-hidden
        />
      </div>
      <h3 className="font-semibold text-foreground mb-1 text-base">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          size="sm"
          variant={isError ? 'outline' : 'default'}
          className="gap-2 mt-5"
        >
          {ActionIcon && <ActionIcon className="h-4 w-4" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

