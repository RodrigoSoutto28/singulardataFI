import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: 'primary' | 'success' | 'warning' | 'destructive' | 'teal';
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'primary',
  className,
}: MetricCardProps) {
  const iconStyles = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
    teal: 'bg-[hsl(173_80%_40%/0.1)] text-[hsl(173_80%_40%)]',
  };

  return (
    <div className={cn('flex items-center gap-4 p-5 rounded-xl border border-border bg-card', className)}>
      <div className={cn('p-3 rounded-xl', iconStyles[iconColor])}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold font-mono tracking-tight">
            {value}
          </p>
          {subtitle && (
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
}
