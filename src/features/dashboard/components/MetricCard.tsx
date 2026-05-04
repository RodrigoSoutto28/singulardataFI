import { cn } from '@/shared/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: 'primary' | 'success' | 'warning' | 'destructive' | 'teal' | 'purple' | 'orange';
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
  const iconStyles: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
    teal: 'bg-[hsl(173_80%_40%/0.1)] text-[hsl(173_80%_40%)]',
    purple: 'bg-[hsl(265_84%_60%/0.1)] text-[hsl(265_84%_60%)]',
    orange: 'bg-[hsl(28_95%_55%/0.1)] text-[hsl(28_95%_55%)]',
  };

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className={cn('p-3 rounded-xl', iconStyles[iconColor])}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
            {subtitle && (
              <span className="text-sm text-muted-foreground">{subtitle}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

