## Plan

1. **Eliminar el check-in obligatorio al entrar a la app**
   - Quitar `PreMarketGate` del layout principal en `src/app/routes.tsx`.
   - Mantener intactos los componentes y hooks del Pre-Market Protocol para que sigan disponibles si se usan desde Behavioral Metrics, pero que ya no aparezca como modal obligatorio al crear cuenta o iniciar sesión.

2. **Corregir operaciones importadas para que entren como cerradas**
   - Ajustar la importación en `src/features/journal/Journal.tsx` para que toda operación con P&L, precio de salida, fecha de salida o resultado importado se guarde con `status: 'closed'`.
   - Si viene cerrada pero sin `exit_date`, asignar una fecha de cierre segura basada en `entryDate`, para que el dashboard, curva de equity y P&L mensual puedan leerla.
   - Incluir `asset_class` en el payload importado, porque hoy se detecta pero no se guarda.

3. **Hacer que el dashboard lea operaciones cerradas aunque falte fecha de salida histórica**
   - Ajustar `useAnalytics` para que la curva de equity y métricas mensuales usen `exit_date` si existe y, como fallback, `entry_date`.
   - Esto protege datos ya importados anteriormente que quedaron cerrados pero sin `exit_date`.

4. **Revalidar flujo principal**
   - Verificar que la ruta `/dashboard` ya no abra el check-in automáticamente.
   - Verificar que las importaciones cerradas alimenten Win Rate, P&L, curva de equity y balance.

5. **Sobre GitHub**
   - No haré comandos manuales de Git porque Lovable sincroniza los cambios automáticamente con GitHub cuando la integración está conectada.