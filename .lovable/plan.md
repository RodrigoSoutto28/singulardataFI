## Problemas detectados

### 1. El fondo de partículas no se ve
En `src/pages/Auth.tsx` el contenedor raíz tiene `bg-background` (color sólido). El `<canvas>` del `ParticleBackground` está en `fixed inset-0 -z-10`, por lo que queda **detrás** del fondo sólido del propio div raíz y nunca se ve.

Adicionalmente, el componente `Card` y la columna de branding también tienen `bg-background` / `bg-card` opacos que tapan el efecto.

### 2. La ruta `/` no muestra landing
`/` redirige directamente al dashboard tras autenticación. El usuario pidió ver el fondo "en la página principal antes del inicio" — esto se interpreta como la página de Auth (login), que es la primera vista para usuarios sin sesión.

### 3. Base de datos
Hay 2 usuarios, 2 cuentas y 120 trades. El usuario solicita reset total a 0.

---

## Cambios propuestos

### A. Arreglar visibilidad del ParticleBackground (`src/pages/Auth.tsx`)
- Quitar `bg-background` del div raíz (usar `bg-transparent` o ninguno) para que el canvas detrás sea visible.
- Mantener `bg-background` aplicado al `<body>` global (ya lo está vía `index.css`) para no romper temas claro/oscuro.
- Quitar `bg-background` de la columna de branding izquierda; mantener `Card` con `bg-card/80 backdrop-blur-sm` para que el formulario sea legible **pero deje ver el fondo** alrededor.
- Subir el `z-index` del canvas a `z-0` y poner el contenido en `relative z-10`, para garantizar el orden de pintura sin depender de `-z-10` (que falla cuando el padre crea su propio stacking context con bg).

### B. Aumentar opacidad/visibilidad del efecto (`src/components/effects/ParticleBackground.tsx`)
- Cambiar `opacity-60` por `opacity-90` en la clase por defecto.
- Subir partículas mínimas a 60 para pantallas pequeñas.

### C. Reset de la base de datos a 0
Migración SQL que vacía (en orden, respetando dependencias) todos los datos de usuario y borra cuentas de auth:

```sql
TRUNCATE
  public.process_validations,
  public.psychological_errors,
  public.user_streaks,
  public.pre_market_checkins,
  public.trade_screenshots,
  public.psychology_entries,
  public.analytics_snapshots,
  public.ai_insights,
  public.trading_rules,
  public.study_progress,
  public.trades,
  public.trading_accounts,
  public.user_roles,
  public.profiles
RESTART IDENTITY CASCADE;

DELETE FROM auth.users;
```

Las tablas `feature_flags` y `study_content` (contenido del producto) **se conservan**.

### D. QA funcional
1. Verificar que el build compila sin errores.
2. Cargar `/auth` con el browser y comprobar visualmente con screenshot que el fondo de partículas se ve.
3. Confirmar con `read_query` que `auth.users`, `profiles`, `trades` quedan en 0.

---

## Confirmación requerida

⚠️ La opción C **borra todos los usuarios y sus datos de forma irreversible**. Necesito tu aprobación explícita para ejecutarla. Si solo querés el arreglo visual y el QA (A, B, D), aprobá el plan y avisame "no borres datos" en el siguiente mensaje.
