
# Plan: Rebranding a SINGULAR dataFI y Preparación del Entorno

## Resumen
Este plan cambia el logo actual por un icono profesional de analítica, actualiza todos los textos de branding a "SINGULAR dataFI", y prepara el entorno para que el usuario pueda comenzar a usar la aplicación de inmediato.

---

## 1. Reemplazar Logo por Icono de Analítica

### Archivo a modificar:
`src/components/layout/Sidebar.tsx`

### Cambios:
- Eliminar la importación de la imagen `logo-analitica.png`
- Importar el icono `LineChart` de Lucide (representa analítica de datos)
- Reemplazar la etiqueta `<img>` por un contenedor con el icono y el nombre de la marca

### Diseño del nuevo logo:
```text
+---------------------------+
|   ┌─────────────────┐     |
|   │  [LineChart]    │     |
|   │    SINGULAR     │     |
|   │     dataFI      │     |
|   └─────────────────┘     |
+---------------------------+
```

---

## 2. Actualizar Nombre de la Aplicación

### Archivos a modificar:

#### `index.html`
- Cambiar `<title>` de "Lovable App" a "SINGULAR dataFI"
- Actualizar meta tags (og:title, description, author)

#### `src/components/layout/TopBar.tsx`
- El título en la barra superior usará las traducciones i18n

#### `src/i18n/translations.ts`
- Actualizar `topbar.title` en los 3 idiomas:
  - ES: "SINGULAR dataFI - Trading Journal & Analytics"
  - EN: "SINGULAR dataFI - Trading Journal & Analytics"
  - PT: "SINGULAR dataFI - Trading Journal & Analytics"

#### `src/pages/Auth.tsx`
- Cambiar todas las referencias de "Analítica" a "SINGULAR dataFI"
- Actualizar textos de bienvenida
- Cambiar el icono del logo en la página de autenticación

---

## 3. Ajustar el Entorno para Comenzar a Usar

### Verificaciones del sistema:
La base de datos ya tiene configuradas las siguientes tablas:
- `profiles` - Perfiles de usuario
- `trades` - Operaciones de trading
- `psychology_entries` - Entradas psicológicas
- `trading_accounts` - Cuentas de trading
- `ai_insights` - Insights de IA
- `analytics_snapshots` - Snapshots de analítica

### Mejoras de la página de autenticación:
`src/pages/Auth.tsx`
- Agregar soporte de internacionalización (i18n)
- Actualizar textos de features a las traducciones dinámicas

### Nuevas traducciones necesarias:
Agregar claves de traducción para la página de autenticación:
- `auth.welcome`
- `auth.subtitle`
- `auth.signIn`
- `auth.signUp`
- `auth.email`
- `auth.password`
- `auth.fullName`
- `auth.features.*`

---

## Sección Técnica

### Archivos a Modificar
1. `src/components/layout/Sidebar.tsx` - Logo con icono LineChart + texto
2. `index.html` - Meta tags y título
3. `src/i18n/translations.ts` - Nuevas traducciones para auth y branding
4. `src/pages/Auth.tsx` - Rebranding completo + i18n
5. `src/components/layout/TopBar.tsx` - Ya usa i18n, solo verificar

### Dependencias
No se requieren nuevas dependencias. Se usa `LineChart` de `lucide-react` que ya está instalado.

### Diseño del Logo en Sidebar
```text
Sidebar (70px ancho)
┌──────────────────┐
│   [LineChart]    │  <- Icono 28px, color primary
│                  │
│    SINGULAR      │  <- Texto 9px, font-bold
│     dataFI       │  <- Texto 8px, text-primary
│                  │
└──────────────────┘
```

### Resultado Esperado
- Logo profesional con icono de analítica y nombre de marca
- Branding consistente "SINGULAR dataFI" en toda la aplicación
- Página de autenticación completamente traducida a 3 idiomas
- Sistema listo para registrar usuarios y comenzar a operar
