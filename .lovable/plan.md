# Balance que no se actualiza + mejor formulario de nueva operación

## Qué está pasando (verificado en la base de datos)

Tu cuenta "FD1" tiene balance inicial 10.000 y balance actual 9.778,97, pero solo hay una operación cerrada con +175. El balance correcto sería 10.175. La fecha de última modificación de la cuenta es anterior a la creación de esa operación: la sincronización de balance que hoy corre en el navegador (después de guardar la operación) no llegó a impactar en la base. Hoy ese recálculo es "best effort": si falla, si el usuario cierra la pestaña o si la operación entra por otro camino (importación, edición, borrado), el balance queda desfasado y nadie se entera.

## Solución: el balance se calcula en el servidor

1. Recalcular el balance en la base de datos con un disparador automático sobre la tabla de operaciones (al crear, editar y borrar). Fórmula: balance actual = balance inicial + suma de P&L de operaciones cerradas de esa cuenta (incluyendo las operaciones antiguas sin cuenta asignada, que se atribuyen a la primera cuenta, igual que hoy).
2. Recalcular también cuando cambia el balance inicial de una cuenta.
3. Corrección puntual de los datos existentes para dejar tu cuenta en el valor correcto.
4. En el frontend: quitar el recálculo manual y dejar solo el refresco de datos, de modo que después de guardar una operación el Balance del panel y del selector de cuentas se actualicen siempre.
5. Arreglar un detalle relacionado: al abrir la app, el diario consulta operaciones con el identificador de cuenta guardado en el navegador antes de validar que esa cuenta siga existiendo (se ve una consulta con una cuenta inexistente). Se validará contra la lista real de cuentas antes de filtrar y antes de asignar cuenta a una operación nueva.

## Mejora de la interfaz al cargar una operación

El diálogo actual es una columna angosta con todos los campos apilados. Se rediseña como planilla de carga:

- Diálogo más ancho en escritorio, con dos columnas; en móvil sigue a pantalla completa en una columna.
- Campos agrupados en bloques con título: Instrumento, Ejecución, Riesgo y resultado, Contexto (estrategia, notas, imagen).
- Barra de progreso y estado ("Completando datos" / "Listo para registrar") pasa a ser encabezado fijo, y el botón Registrar queda en un pie fijo siempre visible.
- Resumen en vivo en el pie: R:R estimado, P&L cargado y su impacto sobre el balance de la cuenta.
- Mejoras de tipeo: avance con Enter entre campos, alineación monoespaciada de números, y los errores de campo se muestran junto al campo con salto automático al primero con error (ya existente, se mantiene).
- Sin cambios en las reglas de negocio: P&L y tamaño de stop se siguen ingresando manualmente, con los mismos signos y validaciones.

## Detalles técnicos

- Migración: función `recalc_account_balance(account_id)` en `public` (security definer, `search_path=public`) + disparadores `AFTER INSERT/UPDATE/DELETE` en `public.trades` y `AFTER UPDATE OF initial_balance` en `public.trading_accounts`; corrección de filas existentes.
- `src/features/journal/hooks/useTrades.ts`: eliminar `syncAccountBalance` y dejar únicamente la invalidación de `trades`, `trades-infinite`, `trading_accounts`, `trading_account`, `analytics_snapshots`.
- `src/features/dashboard/hooks/useTradingAccounts.ts`: `useSelectedAccountId` valida contra la lista de cuentas antes de exponer el id.
- `src/features/journal/Journal.tsx`: reestructuración del `DialogContent` (ancho, secciones, pie fijo con resumen). Sin cambios en `validation.ts`.
