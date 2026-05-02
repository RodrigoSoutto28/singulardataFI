import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, DollarSign, Shield } from 'lucide-react';
import { useTaxometer } from '@/hooks/useTaxometer';

export function TaxometerWidget() {
  const { stats, isLoading } = useTaxometer();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-destructive" />
          Taxímetro de Errores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-xs text-muted-foreground">Cargando…</p>
        ) : stats.count === 0 ? (
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-success mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Sin errores registrados — sigue así.
            </p>
          </div>
        ) : (
          <>
            <div>
              <p className="text-xs text-muted-foreground">Total perdido</p>
              <p className="font-mono text-2xl font-bold text-destructive">
                ${stats.totalCost.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Esta semana</span>
              <span className="font-mono font-semibold">${stats.weekCost.toFixed(2)}</span>
            </div>
          </>
        )}
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to="/psychology?tab=taxometer">
            Ver detalle
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
