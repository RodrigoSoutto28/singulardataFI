## Cambio

Los toasts de error de la app actualmente son persistentes (`duration: Infinity`) y requieren cierre manual. El usuario quiere que se auto-cierren a los **10 segundos** con la animación de difuminado por defecto de Sonner.

## Archivos

**`src/shared/lib/toast.ts`**
- Cambiar `duration: Infinity` → `duration: 10000` en el wrapper de `toast.error`.
- Actualizar el comentario para reflejar la nueva regla.

No se necesitan cambios adicionales: Sonner aplica el fade-out automáticamente al expirar la duración. Los `toast.success` siguen con 4s configurados en `<Toaster />`.

## Verificación

Disparar un `toast.error("...")` desde cualquier parte de la app → debe permanecer ~10s y desvanecerse automáticamente.
