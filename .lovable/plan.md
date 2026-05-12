Plan de implementación:

1. Crear control persistente de importaciones en Lovable Cloud
   - Agregar una tabla de lotes de importación para registrar: usuario, nombre de archivo, hash del archivo, cantidad importada y duplicados omitidos.
   - Agregar a `trades` los campos de trazabilidad del lote y una huella única por operación importada.
   - Proteger todo con reglas por usuario: cada usuario solo ve, crea y deshace sus propios lotes.

2. Bloquear doble carga del mismo archivo
   - Calcular un hash SHA-256 del archivo antes de parsearlo.
   - Si ya existe un lote activo con ese hash para el usuario, detener la importación antes del preview y mostrar un aviso claro.
   - Esto evita que el usuario cargue el mismo CSV/Excel dos veces por accidente.

3. Detectar clones de operaciones antes de guardar
   - Generar una huella normalizada por operación con campos estables: símbolo, dirección, entry/exit, cantidad, fechas, P&L, SL/TP, estrategia y asset class.
   - Marcar y omitir duplicados dentro del mismo archivo.
   - Comparar contra operaciones importadas existentes para omitir clones ya guardados.
   - Añadir una restricción única en la base para impedir duplicados incluso si dos importaciones se ejecutan casi al mismo tiempo.

4. Guardar importaciones por lote
   - Al confirmar el preview, crear un lote de importación.
   - Insertar las operaciones con `import_batch_id` y `import_row_hash`.
   - Mantener el estado `closed` cuando el archivo trae datos de cierre o P&L, para que el dashboard las lea correctamente.

5. Agregar “Deshacer último proceso”
   - Añadir una acción en Trade Ledger junto a Importar/Exportar.
   - Buscar el último lote activo del usuario.
   - Eliminar solo las operaciones asociadas a ese lote.
   - Marcar el lote como deshecho para que quede auditoría y para permitir volver a cargar ese archivo si el usuario realmente quiere rehacer la importación.
   - Sin afectar operaciones manuales ni importaciones anteriores.

6. Ajustar mensajes e i18n
   - Agregar textos en ES/EN/PT para: archivo ya importado, duplicados omitidos, importación deshecha, no hay proceso para deshacer y errores del flujo.

7. Validación
   - Probar el flujo con el mismo archivo dos veces: la segunda carga debe bloquearse.
   - Probar un archivo con filas repetidas: debe omitir clones.
   - Probar “Deshacer último proceso”: debe borrar solo el último lote y recalcular balance/dashboard.
   - Probar recarga posterior del mismo archivo tras deshacer: debe permitir importarlo nuevamente.