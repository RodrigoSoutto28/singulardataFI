import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, DollarSign, PieChart, Shield, TrendingDown } from 'lucide-react';
import { useTaxometer } from '@/hooks/useTaxometer';
import { ERROR_LABELS, type ErrorType } from '@/lib/error-detection';
import { cn } from '@/lib/utils';
import {
  Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

const ERROR_TONE: Record<ErrorType, string> = {
  revenge_trading: 'hsl(var(--destructive))',
  fomo: 'hsl(var(--warning))',
  overtrading: 'hsl(var(--warning))',
  risk_exceeded: 'hsl(var(--destructive))',
  no_stop_loss: 'hsl(var(--destructive))',
  holding_losers: 'hsl(var(--warning))',
};

function comparison(amount: number) {
  if (amount < 100) return { item: 'Comida para una semana', emoji: '🍕' };
  if (amount < 500) return { item: 'Suscripción anual a herramientas pro', emoji: '💼' };
  if (amount < 1000) return { item: 'Un curso de trading profesional', emoji: '📚' };
  if (amount < 5000) return { item: '3 meses de gastos básicos', emoji: '🏠' };
  if (amount < 10000) return { item: 'Depósito para un auto', emoji: '🚗' };
  return { item: `Inversión que generaría $${(amount * 0.07).toFixed(0)}/año`, emoji: '📈' };
}

export function TaxometerDashboard() {
  const { stats, errorsByType, isLoading } = useTaxometer();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando taxímetro...</p>;
  }

  if (stats.count === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-3">
          <Shield className="h-10 w-10 mx-auto text-success" />
          <h3 className="text-lg font-semibold">Sin errores registrados</h3>
          <p className="text-sm text-muted-foreground">
            Todavía no hemos detectado errores psicológicos en tus operaciones. Sigue así.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = Object.entries(errorsByType).map(([type, d]) => ({
    type,
    name: ERROR_LABELS[type as ErrorType] ?? type,
    value: d.total_cost,
    count: d.count,
    color: ERROR_TONE[type as ErrorType] ?? 'hsl(var(--primary))',
  }));

  const cmp = comparison(stats.totalCost);

  return (
    <div className="space-y-6">
      <Card className="border-destructive/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-destructive" />
              Taxímetro de Errores
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground">
            Cuánto te han costado tus errores psicológicos
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
              Total Perdido por Errores
            </p>
            <p className="font-mono text-5xl font-bold text-destructive">
              ${stats.totalCost.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">USD</p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4 flex items-start gap-4">
            <span className="text-2xl">{cmp.emoji}</span>
            <p className="text-sm">
              <span className="text-muted-foreground">Podrías haber comprado: </span>
              <span className="font-medium">{cmp.item}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Esta Semana', value: stats.weekCost },
              { label: 'Este Mes', value: stats.monthCost },
              { label: 'Este Trimestre', value: stats.quarterCost },
              { label: 'Total Histórico', value: stats.totalCost },
            ].map((p) => (
              <div key={p.label} className="rounded-lg border bg-card p-3">
                <p className="text-xs text-muted-foreground">{p.label}</p>
                <p className="font-mono text-lg font-semibold">${p.value.toFixed(0)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Desglose por Tipo de Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number, _n, p) => [
                    `$${Number(v).toFixed(2)} · ${p.payload.count}x`,
                    p.payload.name,
                  ]}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {chartData
              .sort((a, b) => b.value - a.value)
              .map((e) => (
                <div
                  key={e.type}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: e.color }}
                    />
                    <div>
                      <p className="font-medium text-sm">{e.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {e.count} {e.count === 1 ? 'vez' : 'veces'}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-destructive">
                    ${e.value.toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {stats.savingsFromImprovement > 0 && (
        <Card className="border-success/40 bg-success/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <TrendingDown className="h-5 w-5" />
              Dinero Ahorrado por Mejora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-bold text-success">
              ${stats.savingsFromImprovement.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Has reducido tus errores en comparación con meses anteriores. ¡Excelente!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
