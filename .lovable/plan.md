## Goal

Mejorar el gráfico de Curva de Capital del Dashboard para que represente correctamente las pérdidas significativas y comunique visualmente el estado del balance.

## Problemas detectados (ver captura)

1. El eje Y muestra `4000` debajo de `$0` sin signo negativo → confunde porque parece positivo.
2. El color del área es siempre verde aunque haya tramos profundamente negativos.
3. No hay línea de referencia en `$0`, por lo que no se distingue cuándo el capital cruza a negativo.
4. El balance del Dashboard puede ser negativo pero la tarjeta y el gráfico no lo reflejan en rojo.

## Cambios

### 1. `src/components/dashboard/EquityChart.tsx`
- Calcular `currentEquity = data[last].equity` y `minEquity = min(data.equity)`.
- Lógica de color:
  - `currentEquity < 0` → rojo (`hsl(var(--loss))`).
  - `currentEquity >= 0` y tendencia positiva → verde (`hsl(var(--profit))`).
  - `currentEquity >= 0` pero tendencia negativa (drawdown) → ámbar/warn (`hsl(var(--warning))` o el token `#F7A019`).
- Dominio del eje Y: `[Math.min(0, minEquity * 1.1), 'auto']` para que el `$0` siempre sea visible cuando hay negativos.
- `tickFormatter` y tooltip: usar `formatCurrency` de `@/lib/utils` (maneja signo y separadores correctamente, p.ej. `-$1,952.75` en vez de `4000`).
- Añadir `<ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" />` cuando `minEquity < 0`.
- Gradiente: usar `stopOpacity` más alto (0.4) cuando es pérdida para reforzar el rojo.
- Icono del header: `TrendingDown` (lucide) cuando `currentEquity < 0` o tendencia negativa.

### 2. `src/pages/Dashboard.tsx`
- Pasar `trend` correcto al `StatCard` de Balance: `balance < 0 ? 'down' : (balanceChange >= 0 ? 'up' : 'down')`.
- Forzar color rojo del valor cuando `balance < 0` (añadir prop `negative` al StatCard o usar `color="loss"` si existe; si no, agregar variante mínima en `StatCard`).

### 3. `src/components/dashboard/StatCard.tsx` (ajuste mínimo)
- Aceptar prop opcional `valueClassName` o detectar `value` que empiece con `-` / parsear numero para aplicar `text-loss` cuando sea negativo. Aplicar a Balance y P&L Hoy.

## Detalles técnicos

- Tokens HSL ya existen en `src/index.css`: `--profit`, `--loss`. Si `--warning` no existe, usar el token de marca `--accent-warn` (naranja `#F7A019`) o reutilizar `--loss` con menor opacidad para drawdown.
- `formatCurrency` ya está exportado en `src/lib/utils.ts`.
- No tocar tipos generados de Supabase ni `client.ts`.

## Fuera de alcance

- No se modifica el cálculo de `equityCurve` en `useAnalytics`.
- No se cambian otras tarjetas ni traducciones.
