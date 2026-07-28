import { useTheme } from '@/shared/lib/ThemeContext';

/**
 * TechGridTexture
 * Sutil textura de "grid técnico" estilo terminal financiero (Bloomberg-like).
 * Usada en rutas públicas (auth, reset-password, terms, privacy) y layout autenticado.
 * - SVG fixed full-screen, pointer-events-none.
 * - Líneas finas en hsl(var(--primary) / 0.04) + ticks acentuados cada 4 celdas.
 * - Vignette radial para profundidad.
 * - Compatible con dark/light mediante tokens HSL.
 * - En modo claro las opacidades se elevan para mantener legibilidad sobre fondos claros.
 */
export function TechGridTexture() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Base grid 32x32 */}
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="techgrid-fine"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke={`hsl(var(--primary) / ${isLight ? 0.18 : 0.05})`}
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="techgrid-coarse"
            width="128"
            height="128"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 128 0 L 0 0 0 128"
              fill="none"
              stroke={`hsl(var(--primary) / ${isLight ? 0.28 : 0.08})`}
              strokeWidth="1"
            />
            {/* Corner ticks */}
            <path
              d="M 0 0 L 6 0 M 0 0 L 0 6"
              stroke={`hsl(var(--accent) / ${isLight ? 0.75 : 0.35})`}
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="techgrid-vignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="hsl(var(--background))" stopOpacity="0" />
            <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity={isLight ? 0.55 : 0.85} />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#techgrid-fine)" />
        <rect width="100%" height="100%" fill="url(#techgrid-coarse)" />
        <rect width="100%" height="100%" fill="url(#techgrid-vignette)" />
      </svg>

      {/* Tints sutiles para profundidad institucional */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 0% 0%, hsl(var(--primary) / ${isLight ? 0.14 : 0.06}) 0%, transparent 60%),
            radial-gradient(ellipse 60% 45% at 100% 100%, hsl(var(--accent) / ${isLight ? 0.13 : 0.05}) 0%, transparent 55%)
          `,
        }}
      />
    </div>
  );
}

export default TechGridTexture;
