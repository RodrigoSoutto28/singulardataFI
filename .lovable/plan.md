## Hardening de SELECT en `user_roles`

Agregar una política RESTRICTIVE SELECT que limite la lectura a (self OR admin), como defensa en profundidad ante posibles desconfiguraciones futuras de las políticas PERMISSIVE existentes.

### Migración SQL
```sql
CREATE POLICY "Restrict role visibility to self or admin"
ON public.user_roles
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR has_role(auth.uid(), 'admin'::app_role)
);
```

### Post-migración
Marcar el finding `user_roles_self_select_escalation` como resuelto.

### Notas
- No cambia comportamiento actual.
- Sin cambios en código frontend.
