## Override de admin para INSERT/UPDATE en `study_progress`

Agregar dos políticas PERMISSIVE que permitan a los admins insertar y actualizar el progreso de cualquier usuario, manteniendo intactas las políticas existentes para usuarios normales (que siguen restringidas a su propio `user_id`).

### Migración SQL
```sql
CREATE POLICY "Admins can insert any progress"
ON public.study_progress
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update any progress"
ON public.study_progress
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
```

### Post-migración
Marcar el finding `study_progress_no_admin_insert_update` como resuelto.

### Notas
- Sin cambios en código frontend.
- Consistente con el patrón ya usado en `study_progress` SELECT y en `profiles`.
