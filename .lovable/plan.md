## Plan de corrección

1. **Restaurar la carga del preview**
   - Revisar la configuración que puede provocar “rechazó la conexión” en el iframe/preview.
   - Quitar o ajustar cabeceras locales que bloquean el render dentro del entorno de Lovable si están impidiendo la vista embebida.

2. **Corregir puntos frágiles de las cuentas múltiples**
   - Proteger el selector de cuentas contra estados vacíos, IDs guardados obsoletos y respuestas fallidas del backend.
   - Evitar duplicación de toasts al crear/editar cuentas.
   - Asegurar que eliminar una cuenta seleccionada cambie automáticamente a otra cuenta activa.

3. **Revisar la barra lateral agregada recientemente**
   - Mantener el auto-despliegue al pasar el cursor y el colapso al salir.
   - Limpiar el temporizador al desmontar para evitar actualizaciones de estado tardías.

4. **Validación**
   - Verificar que el preview vuelva a responder.
   - Revisar consola y red para confirmar que no queden errores críticos de carga.
   - Probar navegación básica: login/auth, dashboard y layout principal.

## Detalles técnicos

- Archivos probables a tocar:
  - `vite.config.ts`
  - `src/features/dashboard/hooks/useTradingAccounts.ts`
  - `src/features/dashboard/components/AccountSetupModal.tsx`
  - `src/shared/components/layout/Sidebar.tsx`
- No se tocará la lógica de trading ni se agregarán funciones nuevas fuera de la corrección de carga/estabilidad.