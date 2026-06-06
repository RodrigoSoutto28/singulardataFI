## Problemas detectados

### 1. Editar operación cierra el diálogo automáticamente
La acción "Editar" está dentro de un `DropdownMenuItem` (Radix). Al hacer clic, el menú se cierra y devuelve el foco al trigger en el mismo tick en que abrimos el `Dialog`. Esa carrera de foco/`pointer-events` hace que el `Dialog` se cierre solo de inmediato.

### 2. La alerta "Sin Stop Loss" aparece de forma precoz
El `<form onSubmit={handleAddTrade}>` envuelve los inputs de los 2 pasos. Si el usuario pulsa Enter en cualquier input del Paso 1 (Activo, Entrada, Cantidad…), el formulario se envía con `stop_loss` vacío y se dispara la alerta antes de llegar al final del registro.

## Cambios (un solo archivo: `src/features/journal/Journal.tsx`)

### A. Editar operación
- En el `DropdownMenuItem` de "Editar" (línea 835), reemplazar `onClick={() => openEditTrade(trade)}` por `onSelect={(e) => { e.preventDefault(); openEditTrade(trade); }}`.
- En `openEditTrade` (línea 207), envolver `setIsAddTradeOpen(true)` en `setTimeout(..., 0)` para que el Dialog se abra después de que el DropdownMenu termine de cerrarse y restaurar el foco.

### B. Alerta sólo al final del registro
- En `handleAddTrade` (línea 550), añadir al inicio (tras `e.preventDefault()`):
  ```ts
  if (wizardStep !== 2) return;
  ```
  Esto garantiza que el submit (y por tanto la detección/alerta) sólo se ejecute cuando el usuario está en el Paso 2 y pulsa "Registrar Operación".

No se modifican textos, componentes ni la lógica de detección.