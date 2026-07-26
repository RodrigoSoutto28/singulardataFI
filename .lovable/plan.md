## Plan: Realzar la cuadrícula técnica en modo claro

### Resumen
Aumentar la visibilidad de la textura de grid técnico en modo claro sin alterar el ADN institucional ni tocar el modo oscuro.

### Cambios propuestos

1. **Detección de modo claro en `TechGridTexture.tsx`**
   - Usar `useTheme()` para detectar `theme === 'light'` o, preferentemente, aplicar dos estilos vía una clase `is-light` para evitar hidratación inconsistente.

2. **Incrementar opacidades en modo claro**
   - Grid fino: de `0.05` a `0.12`.
   - Grid grueso: de `0.08` a `0.18`.
   - Ticks de esquina: de `0.35` a `0.55`.
   - Dejar las opacidades actuales para `.dark` sin cambios.

3. **Aumentar tintes de profundidad en modo claro**
   - Radial primary: de `0.06` a `0.10`.
   - Radial accent: de `0.05` a `0.09`.
   - Máscara vignette: reducir ligeramente la opacidad del fade en modo claro para que el grid se mantenga legible cerca de los bordes.

4. **Verificación visual**
   - Prender el preview en modo claro (`/auth`, `/dashboard`) y confirmar que la cuadrícula se lee claramente sin competir con el contenido.
   - Capturar comparación dark vs light para asegurar que no se vuelva demasiado fuerte.

### Archivos a modificar
- `src/shared/components/effects/TechGridTexture.tsx`

### Fuera de alcance
- Cambiar el color de los tokens primarios/accento.
- Alterar el modo oscuro.
- Reemplazar la textura por otra.