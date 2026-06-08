import { Card } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import {
  LayoutDashboard, Brain, TrendingUp, DollarSign, Download, BookOpen, Lightbulb,
} from 'lucide-react';

export function TourStep() {
  const sections = [
    { icon: LayoutDashboard, title: 'Dashboard', description: 'Métricas clave y acciones rápidas' },
    { icon: Brain, title: 'Psychology', description: 'Check-ins, streaks y achievements' },
    { icon: BookOpen, title: 'Journal', description: 'Registra y valida tus trades' },
    { icon: TrendingUp, title: 'Analytics', description: 'Estadísticas avanzadas' },
    { icon: DollarSign, title: 'Taxímetro', description: 'Costo de tus errores psicológicos' },
    { icon: Download, title: 'Exportación', description: 'JSON, CSV, PDF — sin restricciones' },
  ];

  return (
    <div className="space-y-5 py-2">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Tour de MindOn</h2>
        <p className="text-sm text-muted-foreground">Conoce las secciones principales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="p-4 space-y-2">
              <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">{s.title}</h3>
              <p className="text-xs text-muted-foreground">{s.description}</p>
            </Card>
          );
        })}
      </div>

      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <span className="font-semibold">Próximo paso:</span> Registra tu primer trade en Journal y completa la validación de proceso.
        </AlertDescription>
      </Alert>
    </div>
  );
}

