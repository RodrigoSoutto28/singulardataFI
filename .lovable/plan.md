
# Plan: Mejoras Visuales y Corrección del Selector de Idioma

## Resumen
Este plan aborda tres cambios principales: cambiar el color de las partículas del fondo de naranja a gris claro, corregir el selector de idioma que actualmente no funciona, y reemplazar los emojis en los componentes de Analytics y Psychology por iconos profesionales de Lucide.

---

## 1. Cambiar Color de Partículas a Gris Claro

### Archivo a modificar:
`src/components/effects/NeuronParticles.tsx`

### Cambios:
- Actualizar el valor de `primaryColor` de `{ r: 230, g: 98, b: 31 }` (naranja #E6621F) a `{ r: 137, g: 137, b: 137 }` (gris medio #898989)
- Actualizar el color hardcoded en el gradiente de la línea 99 de `'rgba(230, 98, 31, 0)'` a `'rgba(137, 137, 137, 0)'`

---

## 2. Corregir Selector de Idioma

### Problema identificado:
El selector de idioma en el TopBar es actualmente visual pero no funcional. Los botones ES/EN/PT no tienen handlers de click ni gestión de estado.

### Solución:
Implementar un sistema básico de preferencia de idioma con estado local y persistencia.

### Archivo a modificar:
`src/components/layout/TopBar.tsx`

### Cambios:
- Agregar estado `language` con valor inicial desde localStorage
- Implementar función `changeLanguage` que actualice el estado y persista en localStorage
- Aplicar estilos condicionales a los botones según el idioma seleccionado
- Agregar handlers `onClick` a cada botón de idioma

```text
Estado inicial:
+------------------+
| localStorage     |
| 'app-language'   |
+--------+---------+
         |
         v
+--------+---------+
| useState         |
| language: 'ES'   |
+--------+---------+
         |
         v
+--------+---------+
| Render buttons   |
| with active      |
| state styling    |
+------------------+
```

---

## 3. Reemplazar Emojis por Iconos Profesionales

### Archivos a modificar:

#### `src/pages/Psychology.tsx`
Reemplazar emojis en el array `emotions` por iconos de Lucide:

| Emoción     | Emoji actual | Icono Lucide         |
|-------------|--------------|----------------------|
| confident   | 💪           | `Shield`             |
| calm        | 😌           | `Leaf`               |
| neutral     | 😐           | `Minus`              |
| excited     | 🎯           | `Zap`                |
| anxious     | 😰           | `AlertCircle`        |
| fearful     | 😨           | `ShieldAlert`        |
| greedy      | 🤑           | `TrendingUp`         |
| frustrated  | 😤           | `Flame`              |

**Cambios específicos:**
1. Agregar imports de iconos: `Shield, Leaf, Minus, Zap, AlertCircle, ShieldAlert, Flame`
2. Cambiar tipo de `icon` en interface de `string` a `React.ComponentType`
3. Actualizar el array `emotions` con componentes de iconos
4. Modificar `EmotionBadge` para renderizar el icono como componente

#### `src/pages/Analytics.tsx`
Este archivo ya usa iconos de Lucide (no emojis), por lo que no requiere cambios.

---

## Sección Técnica

### Dependencias
No se requieren nuevas dependencias. Todos los iconos están disponibles en `lucide-react`.

### Archivos Modificados
1. `src/components/effects/NeuronParticles.tsx` - Color de partículas
2. `src/components/layout/TopBar.tsx` - Funcionalidad del selector de idioma
3. `src/pages/Psychology.tsx` - Reemplazo de emojis por iconos

### Consideraciones de Compatibilidad
- El cambio de color de partículas es puramente visual y no afecta funcionalidad
- El selector de idioma guardará la preferencia pero no traducirá textos (i18n completo requeriría implementación adicional)
- Los iconos de Lucide mantienen consistencia visual con el resto de la aplicación

### Resultado Esperado
- Fondo con partículas en gris sutil que no compite con el contenido
- Selector de idioma funcional con feedback visual del idioma activo
- Interfaz más profesional sin emojis, usando iconos consistentes
