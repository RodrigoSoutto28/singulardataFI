## Proteger archivos de capturas de pantalla de operaciones

### Migración SQL

1. Crear bucket privado `trade-screenshots` (`public = false`).
2. Crear 4 políticas RLS sobre `storage.objects` que restringen acceso al dueño según convención de path `{user_id}/...`:
   - **SELECT**: solo el dueño puede leer.
   - **INSERT**: solo el dueño puede subir a su carpeta.
   - **UPDATE**: solo el dueño puede modificar.
   - **DELETE**: solo el dueño puede borrar.

Todas usan: `auth.uid()::text = (storage.foldername(name))[1]`.

### Post-migración

- Marcar el finding `trade_screenshots_no_select_policy_for_screenshots_bucket` como resuelto en el panel de seguridad.

### Notas

- No se modifica código frontend: aún no hay flujo de subida implementado. El bucket queda listo y seguro para cuando se implemente.
- Cuando se implemente la subida, el path debe ser `{auth.uid()}/...` y la visualización debe usar URLs firmadas (`createSignedUrl`).
