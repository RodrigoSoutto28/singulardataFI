## Estado actual: 6 de 7 pasos ya están aplicados

Al revisar el código actual, los pasos 1–6 y casi todo el paso 7 ya están implementados (probablemente por iteraciones previas tras la refactorización a feature-based architecture). Solo queda **una pieza pendiente**: el bucket `avatars` en Lovable Cloud no existe, por lo que el upload de foto de perfil falla.

### Verificación realizada

| Paso | Estado | Evidencia |
|---|---|---|
| 1 — Botón editar Balance | ✅ Listo | `Dashboard.tsx` líneas 9, 31, 96–115, 176 ya tienen modal + botón |
| 2 — Animaciones futuristas | ✅ Listo | `index.css` líneas 560–693: holo-shimmer, border-glow-pulse, data-flow, scale-in-spring, letter-reveal, border-trace, page-enter |
| 3 — Centrado dinámico | ✅ Listo | `AppLayout.tsx`: `mx-auto w-full max-w-[1440px] ... page-enter` |
| 4 — Quitar selector idioma | ✅ Listo | `TopBar.tsx` línea 16 (comentario), `Sidebar.tsx` usa `showQuickToggles` |
| 5 — Dark mode neutral | ✅ Listo | `index.css` líneas 81–139 con `--background: 220 10% 5%` |
| 6 — Glassmorphism | ✅ Listo | `index.css` líneas 190–243 con `backdrop-filter` en surface-card y glass-chrome |
| 7 — Perfil + foto | ⚠️ Casi | AvatarUploader, Profile.tsx, ruta `/profile`, dropdown items con onClick y `refreshProfile` en AuthContext: todo existe. **Falta el bucket `avatars` en storage** (consulta SQL devolvió 0 filas) |

Las rutas mencionadas en el prompt (`src/components/...`, `src/contexts/...`, `src/pages/...`, `src/index.css`) ya no existen porque el repo se migró a estructura feature-based; los cambios equivalentes ya están aplicados sobre las nuevas rutas (`src/features/...`, `src/shared/...`, `src/styles/index.css`).

## Acción propuesta

**Único cambio:** crear el bucket de Storage `avatars` con sus políticas RLS, vía migración SQL.

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatars are publicly accessible"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]);
```

Tras la migración, el flujo del paso 7 quedará 100% operativo: subir foto desde `/profile`, persistencia, eliminación y refresco del avatar en TopBar.

## Lo que NO se va a tocar

- Estructura de carpetas (ya feature-based).
- Lógica de hooks existentes.
- Componentes ya alineados con las instrucciones.
- `tailwind.config.ts`.

## Memoria del proyecto

La memoria `Core` indica explícitamente "NO glassmorphism, NO neon glows". El paso 6 ya está aplicado y contradice esa regla. No es parte del cambio actual, pero conviene que confirmes si querés que actualice la memoria para reflejar la nueva dirección visual (glass sutil aceptado) o si preferís revertir el paso 6 en una iteración posterior.