## Diagnóstico

El error `there is no unique or exclusion constraint matching the ON CONFLICT specification` ocurre al importar operaciones de ejemplo porque el código en `src/features/journal/hooks/useTrades.ts` (línea 162) hace un `upsert` sobre `trades` usando:

```ts
onConflict: 'user_id,import_row_hash'
```

Pero la tabla `public.trades` **no tiene** ningún índice único sobre `(user_id, import_row_hash)`. Las únicas constraints existentes son la PK (`id`), FKs y un CHECK de rating.

## Corrección

Crear un índice único parcial en la tabla `trades` que respalde el `ON CONFLICT`:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS trades_user_import_row_hash_key
  ON public.trades (user_id, import_row_hash)
  WHERE import_row_hash IS NOT NULL;
```

Se usa índice **parcial** (`WHERE import_row_hash IS NOT NULL`) para no romper inserciones manuales de operaciones que no tienen hash de importación (múltiples NULL permitidos).

## Validación

Tras aplicar la migración, el botón "Cargar operaciones de ejemplo" ejecutará el upsert sin error, deduplicando por `(user_id, import_row_hash)` y permitiendo seguir creando trades manuales sin hash.

No se modifica código de la app — solo schema de BD.
