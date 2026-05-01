## Eliminar políticas duplicadas en bucket `study-pdfs`

### Hallazgo
Existen 3 pares de políticas duplicadas en `storage.objects` para el bucket `study-pdfs`:

| Operación | Mantener (`has_role`) | Eliminar (`is_admin`) |
|---|---|---|
| INSERT | `Admins can upload study PDFs` | `Admins can upload study pdfs` |
| UPDATE | `Admins can update study PDFs` | `Admins can update study pdfs` |
| DELETE | `Admins can delete study PDFs` | `Admins can delete study pdfs` |

Ambas funciones (`has_role` e `is_admin`) consultan la misma tabla `user_roles`, así que el control de acceso es equivalente. Mantengo `has_role` por consistencia con el resto del proyecto (profiles, user_roles).

### Migración SQL
```sql
DROP POLICY IF EXISTS "Admins can delete study pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update study pdfs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload study pdfs" ON storage.objects;
```

### Post-migración
Marcar el finding `study_pdfs_duplicate_policies` como resuelto.

### Notas
- No cambia quién puede acceder a los PDFs.
- No requiere cambios en código frontend.
