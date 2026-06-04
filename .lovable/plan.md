# Compactar el dashboard y suavizar el modo claro

## Objetivos
1. Eliminar el espacio vacío debajo de la **Curva de Capital** y reorganizar el dashboard para que no queden huecos.
2. Bajar la luminosidad del modo claro: tonos un poco más cálidos/grises para que no canse la vista, manteniendo legibilidad y jerarquía.

---

## 1. Reorganización del dashboard (`src/features/dashboard/Dashboard.tsx`)

Problema actual: la columna izquierda (Curva de Capital) es más alta que la derecha (Estado Mental + Taxómetro), pero como en la fila siguiente solo hay "Actividad Reciente" full-width, queda un hueco vertical bajo la curva mientras la columna derecha "termina antes".

Cambios de layout:
- Mover **Actividad Reciente (RecentTrades)** dentro de la columna izquierda, justo debajo de la `EquityChart`, en lugar de fila propia más abajo. Así la columna izquierda crece y consume el espacio.
- La columna derecha (Estado Mental + Taxómetro) puede recibir además el bloque de **Logros (AchievementBadges)** apilado, para equilibrar alturas.
- Reducir paddings inferiores: en `EquityChart` el wrapper usa `p-6 pb-4`; al renderizarse dentro de un `Card` con `CardContent className="pb-2"` queda doble padding. Pasar a `p-0` (ya que `className="border-0 bg-transparent p-0"` se pasa pero el componente concatena, no reemplaza). Ajustar para que el padding venga solo del Card y eliminar el `mb-3` del indicador.
- Bajar la altura del chart a `h-[200px] sm:h-[240px]` para densificar.
- Quitar `CardContent pb-2` → usar `pb-0` y `CardHeader pb-2`.

Estructura resultante:

```text
[Hero]
[QuickActions]
[Stats 4 cards]
┌──────────────────────────┬──────────────────┐
│ Curva de Capital         │ Estado Mental    │
│                          │ Taxómetro        │
│ Actividad Reciente       │ Logros           │
└──────────────────────────┴──────────────────┘
```

Sin filas full-width sueltas debajo.

---

## 2. Suavizar tonos del modo claro (`src/styles/index.css`)

Ajustes en `:root` para reducir el contraste agresivo blanco puro / azul saturado:

| Token | Antes | Después | Motivo |
|---|---|---|---|
| `--background` | `210 20% 95%` | `215 18% 92%` | gris algo más profundo, menos blanco lavado |
| `--card` | `0 0% 100%` (blanco puro) | `210 25% 98%` | off-white cálido, evita el "papel deslumbrante" |
| `--popover` | `0 0% 100%` | `210 25% 98%` | coherencia |
| `--sidebar-background` | `215 18% 93%` | `215 16% 90%` | más profundidad lateral |
| `--muted` | `215 16% 89%` | `215 14% 87%` | empty states menos brillantes |
| `--secondary` | `215 16% 91%` | `215 14% 88%` | chips/badges |
| `--border` | `215 16% 84%` | `215 14% 80%` | bordes más visibles para compensar menor contraste de fondos |
| `--input` | `215 16% 86%` | `215 14% 82%` | inputs distinguibles |
| `--primary` | `197 100% 35%` | `197 85% 38%` | azul algo menos eléctrico |
| `--accent` | `199 70% 52%` | `199 60% 48%` | acento menos saturado |

`--foreground` se mantiene (`215 28% 14%`) para preservar contraste de texto.

Modo oscuro **no se toca**.

---

## Archivos a modificar
- `src/features/dashboard/Dashboard.tsx` — reorganizar columnas, mover RecentTrades a columna izquierda, mover AchievementBadges a columna derecha, ajustar paddings de la Card de Equity.
- `src/features/dashboard/components/EquityChart.tsx` — reducir altura del chart y padding interno cuando se pasa `className` con `p-0`.
- `src/styles/index.css` — actualizar tokens HSL del bloque `:root` (light mode) según la tabla.

## Fuera de alcance
- No se modifica lógica de negocio, hooks, ni datos.
- No se toca el modo oscuro.
- No se cambian textos ni traducciones.
