## Objetivo

Permitir definir una meta de check-ins semanal (ej. 5 de 7) y mensual (ej. 20 días), y mostrar el progreso frente a esa meta junto a los porcentajes de cumplimiento actuales en el Historial de Check-ins.

## Estado actual (verificado)

- `HistoryView` en `src/features/behavioral/Psychology.tsx` (líneas 679-798) muestra racha actual, mejor racha, completados/total del período y una barra `Progress` con `stats.completionRate`.
- `periodStats` en `src/features/behavioral/utils/streak-metrics.ts` ya devuelve `completed`, `total`, `elapsed`, `missed`, `completionRate`.
- No existe hoy ningún concepto de meta/objetivo de check-ins.

## Cambios propuestos

1. **Persistencia de la meta (local, sin base de datos)**
   - Nuevo hook `useCheckinGoals` sobre `useLocalStorage` con `{ weeklyGoal, monthlyGoal }`.
   - Valores por defecto: 5 días/semana y 20 días/mes; rangos válidos 1-7 y 1-31.

2. **Selector de meta en el Historial**
   - Junto al toggle Semanal/Mensual, un `Select` con la meta del período activo:
     - Semanal: opciones 1 a 7 ("X de 7 días").
     - Mensual: opciones 5, 10, 15, 20, 25, 30 (o `Select` de 1-31 compacto).
   - Cambiar el período cambia qué meta se está editando.

3. **Progreso vs objetivo**
   - Nueva tarjeta "Meta del período": `completados / meta` + icono `Target`.
   - Barra de progreso hacia la meta (`completed / goal`, tope 100%), acompañada de la barra de cumplimiento actual existente (`completionRate` sobre días transcurridos), ambas etiquetadas para no confundirse.
   - Estado visual: meta alcanzada (verde + `Check`), en curso (primary), en riesgo cuando los días restantes del período ya no alcanzan para cumplir la meta (warning).
   - Texto auxiliar: "Faltan N check-ins" o "Meta cumplida".

4. **i18n**
   - Nuevas claves EN/ES/PT: `goal`, `weeklyGoal`, `monthlyGoal`, `periodGoal`, `goalReached`, `remainingCheckins`, `goalAtRisk`. Sin strings hardcodeados.

5. **Lógica y tests**
   - Añadir `goalProgress(stats, goal)` en `streak-metrics.ts` devolviendo `{ percent, remaining, reached, atRisk }`.
   - Tests en `src/features/behavioral/utils/__tests__/streak-metrics.test.ts`: meta cumplida, meta parcial, meta imposible por días restantes, meta mayor que el total del período.

## Notas técnicas

- Todo cliente: no hay cambios de base de datos; las metas se guardan en local storage por usuario del navegador.
- Los días futuros del período siguen contando para "días restantes" en el cálculo de riesgo, pero no como fallados.
