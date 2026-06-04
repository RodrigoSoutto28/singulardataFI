# Mover Índice de Disciplina a barra horizontal full-width

## Problema
El card "Disciplina" quedó apilado en la columna derecha bajo el Taxímetro, con badges en columna única. Esto deja la columna derecha alta y crea espacio vacío visual, además de desaprovechar el ancho disponible.

## Solución

### 1. `src/features/dashboard/Dashboard.tsx`
- Quitar el card "Disciplina" (`AchievementBadges variant="stack"`) de la columna derecha.
- Insertarlo como **barra horizontal full-width** justo debajo de la fila principal (curva + actividad / estado mental + taxímetro), antes del `AccountSetupModal`.
- El card ocupa todo el ancho (`grid-cols-1`) y dentro renderiza `AchievementBadges variant="grid"` para que use el grid `sm:grid-cols-2 lg:grid-cols-4` original — los 4 badges se distribuyen horizontalmente y centrados.
- Columna derecha queda con `MentalStateCard` + `TaxometerWidget` únicamente, alineando su altura con la columna izquierda (curva + actividad reciente).

### 2. Sin cambios en `AchievementBadges.tsx`
La variante `grid` ya existe y soporta el layout horizontal de 4 columnas — se reutiliza tal cual.

## Estructura resultante

```text
[Hero]
[QuickActions]
[Stats 4 cards]
┌──────────────────────────┬──────────────────┐
│ Curva de Capital         │ Estado Mental    │
│ Actividad Reciente       │ Taxómetro        │
└──────────────────────────┴──────────────────┘
[Índice de Disciplina — 4 badges en fila horizontal]
```

## Fuera de alcance
- No se modifica lógica, datos ni traducciones.
- No se tocan otros componentes ni el modo oscuro.
