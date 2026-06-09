import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight, Shield } from 'lucide-react';
import { createIcon3DComponent } from '@/shared/components/ui/Icon3D';
import { useTaxometer } from '@/features/behavioral/hooks/useTaxometer';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { Skeleton } from '@/shared/components/ui/skeleton';

const Taxometer3D = createIcon3DComponent('taxometer', true);

export function TaxometerWidget() {
  const { stats, isLoading } = useTaxometer();
  const { t } = useLanguage();
  const ps = t.psychology;

  return (
    <Card className="lift-strong bg-card/25 backdrop-blur-md border-white/5 relative overflow-hidden group">
      <CardHeader className="pb-4 relative z-10 mr-16">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {ps.errorTaxometer ?? 'Taxímetro de Errores'}
        </CardTitle>
      </CardHeader>

      {/* Floating 3D Taxometer Icon in the top-right corner */}
      <div className="absolute right-2 top-2 h-20 w-20 opacity-90 pointer-events-none group-hover:scale-115 group-hover:rotate-6 transition-all duration-300">
        <Taxometer3D className="h-full w-full object-contain" />
      </div>

      <CardContent className="space-y-4 relative z-10">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-32" />
          </div>
        ) : stats.count === 0 ? (
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-success mt-0.5" aria-hidden />
            <p className="text-xs text-muted-foreground">
              {ps.noErrorsRegistered ?? 'Sin errores registrados — sigue así.'}
            </p>
          </div>
        ) : (
          <>
            <div>
              <p className="text-xs text-muted-foreground">{ps.totalLost ?? 'Total perdido'}</p>
              <p className="font-mono text-2xl font-bold text-destructive number-pop">
                ${stats.totalCost.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{ps.thisWeek ?? 'Esta semana'}</span>
              <span className="font-mono font-semibold">${stats.weekCost.toFixed(2)}</span>
            </div>
          </>
        )}
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to="/psychology?tab=taxometer">
            {ps.viewDetail ?? 'Ver detalle'}
            <ArrowRight className="h-3 w-3 ml-1" aria-hidden />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}


