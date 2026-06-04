## Aumentar tono azulado en hero de bienvenida

**Archivo:** `src/features/dashboard/Dashboard.tsx` (líneas ~73-87)

**Cambio:** Intensificar el azul del bloque de saludo ("Buenos días, {nombre} 👋").

Actualmente usa `from-primary/10 via-primary/5 to-background` con `border-primary/20` — muy sutil.

**Nuevo:**
- Gradiente: `from-primary/30 via-primary/15 to-accent/10` para un azul más presente.
- Borde: `border-primary/40` para definir mejor el contorno.
- Blobs decorativos: `bg-primary/30` (de `/20`) y `bg-accent/20` (de `/10`) para más profundidad azul.

Sin cambios de layout, tipografía ni lógica. Solo intensidad del color azul (token `--primary` ya es el azul de marca #429EBD).
