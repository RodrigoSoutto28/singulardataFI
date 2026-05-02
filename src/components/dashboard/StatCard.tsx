import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
  label: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  color?: 'primary' | 'teal' | 'purple' | 'orange';
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  trend,
  color = 'primary',
  className,
}: StatCardProps) {
  const colorClasses: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    teal: 'bg-[hsl(173_80%_40%/0.1)] text-[hsl(173_80%_40%)]',
    purple: 'bg-[hsl(265_84%_60%/0.1)] text-[hsl(265_84%_60%)]',
    orange: 'bg-[hsl(28_95%_55%/0.1)] text-[hsl(28_95%_55%)]',
  };

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-2 rounded-lg', colorClasses[color])}>
            <Icon className="h-5 w-5" />
          </div>
          {change !== undefined && (
            <Badge
              variant={trend === 'up' ? 'default' : 'destructive'}
              className={cn(
                'text-xs font-mono',
                trend === 'up' && 'bg-success/15 text-success hover:bg-success/20'
              )}
            >
              {trend === 'up' ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-bold font-mono tracking-tight">{value}</p>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 pointer-events-none" />
    </Card>
  );
}
