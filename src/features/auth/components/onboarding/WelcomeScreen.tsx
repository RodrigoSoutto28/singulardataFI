import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Brain, Target, TrendingUp, Shield, Zap, Users, Sparkles } from 'lucide-react';

export function WelcomeScreen() {
  const features = [
    { icon: Brain, title: 'Psicología de Trading', description: 'Sistema basado en behavioral economics' },
    { icon: Target, title: 'Check-in Pre-Mercado', description: 'Define tu plan antes que el mercado lo defina' },
    { icon: Shield, title: 'Validador de Proceso', description: 'IA que celebra disciplina, no solo ganancias' },
    { icon: TrendingUp, title: 'Taxímetro de Errores', description: 'Cuantifica en $ el costo de tus malos hábitos' },
    { icon: Zap, title: 'Gamificación', description: 'Streaks, achievements y progreso visible' },
    { icon: Users, title: 'Comparación Anónima', description: 'Tu proceso vs otros traders (nunca P&L)' },
  ];

  return (
    <div className="space-y-6 py-2">
      <div className="text-center space-y-3">
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3" />
          El primer journal que mejora tu psicología
        </Badge>
        <h2 className="text-3xl font-bold">Bienvenido a SINGULAR dataFI</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          No somos otro journal genérico. Usamos <span className="font-semibold text-foreground">behavioral economics</span> para que realmente sigas tu plan.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="outline">✓ Ciencia, no opiniones</Badge>
          <Badge variant="outline">✓ Tus datos son tuyos</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <Card key={f.title} className="p-4 space-y-2">
              <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.description}</p>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Configuración inicial: menos de 3 minutos
      </p>
    </div>
  );
}

