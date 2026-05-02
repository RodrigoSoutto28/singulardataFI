import { ReactNode } from 'react';
import { Trophy, Shield, AlertTriangle, Target, XCircle } from 'lucide-react';

export type AIMessageVariant = 'success' | 'warning' | 'danger' | 'info';
export type AIMessageTypeKey =
  | 'loss_high_discipline'
  | 'win_low_discipline'
  | 'loss_low_discipline'
  | 'win_high_discipline'
  | 'breakeven_neutral';

export interface AIMessage {
  type: AIMessageTypeKey;
  variant: AIMessageVariant;
  title: string;
  message: string;
  icon: ReactNode;
  stat?: string;
  actions?: string[];
}

export function getAIMessage(
  result: 'win' | 'loss' | 'breakeven',
  disciplineScore: number,
  pnlAmount: number,
): AIMessage {
  const isHighDiscipline = disciplineScore >= 4;
  const absPnl = Math.abs(pnlAmount).toFixed(2);

  if (result === 'breakeven') {
    return {
      type: 'breakeven_neutral',
      variant: 'info',
      title: 'Trade Neutral',
      message: 'Breakeven. Lo importante es que mantuviste tu proceso. Sigue ejecutando con disciplina.',
      icon: <Target className="h-8 w-8 text-primary" />,
      actions: ['Buscar próximo setup'],
    };
  }

  if (result === 'loss' && isHighDiscipline) {
    return {
      type: 'loss_high_discipline',
      variant: 'success',
      title: '🛡️ Pérdida Profesional',
      message: `Perdiste dinero pero GANASTE en disciplina. Ejecutaste tu plan bajo presión.\n\nSolo el 5% de los traders saben perder así. Esto es lo que separa profesionales de aficionados.\n\nEl mercado te quitó $${absPnl} hoy, pero TÚ protegiste tu capital psicológico. Eso vale mucho más a largo plazo.`,
      icon: <Shield className="h-8 w-8 text-success" />,
      stat: 'Cuando sigues tu plan incluso en pérdidas, tu win rate subsecuente mejora 23% en promedio.',
      actions: ['Continuar operando (tienes el control)', 'Tomar un break de 15 minutos'],
    };
  }

  if (result === 'win' && !isHighDiscipline) {
    return {
      type: 'win_low_discipline',
      variant: 'warning',
      title: '⚠️ Victoria Peligrosa',
      message: `Ganaste dinero, pero violaste ${5 - disciplineScore} de tus reglas.\n\nEl mercado te recompensó HOY por mal comportamiento. Esto es una trampa psicológica.\n\nLa próxima vez que rompas estas reglas, el mercado cobrará con intereses. No confundas suerte con habilidad.\n\nGanaste $${absPnl}, pero ¿a qué costo?`,
      icon: <AlertTriangle className="h-8 w-8 text-warning" />,
      stat: 'Traders que ganan rompiendo reglas tienen 68% más probabilidad de revenge trading en las siguientes 48 horas.',
      actions: ['Revisar mi plan para próxima entrada', 'Entiendo, seré más cuidadoso'],
    };
  }

  if (result === 'loss' && !isHighDiscipline) {
    return {
      type: 'loss_low_discipline',
      variant: 'danger',
      title: '🚨 Momento de Parar',
      message: `Este trade no salió bien Y rompiste tus propias reglas.\n\nNo es momento de análisis técnico. Es momento de análisis emocional.\n\nPregunta honesta: ¿Estás operando desde tu PLAN o desde tu EGO?\n\nEl mercado estará aquí mañana. Tu capital NO, si sigues este patrón.\n\nPerdiste $${absPnl}. No pierdas también tu disciplina.`,
      icon: <XCircle className="h-8 w-8 text-destructive" />,
      stat: 'Después de una pérdida con baja disciplina, el 73% de traders cometen otro error en la siguiente hora.',
      actions: ['Bloquear trading por hoy (recomendado)', 'Hacer check-in emocional'],
    };
  }

  // win + high discipline
  return {
    type: 'win_high_discipline',
    variant: 'success',
    title: '⭐ Ejecución Elite',
    message: `Trade ganador + proceso perfecto = así se construyen cuentas profesionales.\n\nNo fue suerte. Fue PREPARACIÓN encontrando OPORTUNIDAD.\n\nEjecutaste ${disciplineScore}/5 puntos de tu plan. Ganaste $${absPnl} de la manera correcta.\n\nEste es trading replicable. Sigue este camino.`,
    icon: <Trophy className="h-8 w-8 text-success" />,
    stat: `Adherencia perfecta: ${disciplineScore}/5 puntos del plan ejecutados.`,
    actions: ['Ver mi evolución', 'Buscar próximo setup'],
  };
}
