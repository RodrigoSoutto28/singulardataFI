/**
 * LogoMindOn — Logo vectorial de la marca MindOn Trading Software
 *
 * Diseño fiel al logo oficial:
 *   - "Mind" en color del tema (foreground)
 *   - "O" representada como ícono de power en beige #C9A88A
 *   - "n" en beige #C9A88A
 *   - Subtítulo opcional "TRADING SOFTWARE" en dorado #A6845F
 *
 * Se utiliza 100% SVG para asegurar que el ícono y el texto queden
 * perfectamente alineados en la misma línea base, evitando el desfase
 * que ocurre al mezclar elementos HTML <span> con <svg>.
 */

import { cn } from '@/shared/lib/utils';

interface LogoMindOnProps {
  /** Tamaño del logo */
  size?: 'sm' | 'md' | 'lg';
  /** Mostrar subtítulo "TRADING SOFTWARE" */
  showSubtitle?: boolean;
  /** Clases adicionales para el contenedor */
  className?: string;
}

const CONFIG = {
  sm: { width: 110, height: 32 },
  md: { width: 155, height: 45 },
  lg: { width: 280, height: 80 },
} as const;

export function LogoMindOn({ size = 'md', showSubtitle = false, className }: LogoMindOnProps) {
  const c = CONFIG[size];
  const viewBoxHeight = showSubtitle ? 86 : 70;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 300 ${viewBoxHeight}`}
      width={c.width}
      height={c.height}
      className={cn('select-none', className)}
      fill="none"
      aria-label="MindOn Trading Software"
      role="img"
    >
      {/* "Mind" — usa currentColor (adaptable a dark/light) */}
      <text
        x="2"
        y="61"
        fontFamily="'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        fontSize="54"
        fontWeight="700"
        letterSpacing="-2"
        fill="currentColor"
      >
        Mind
      </text>

      {/* 
        Power icon "O":
        Centro en x=168 + 12 = 180, y=6 + 16 = 22
      */}
      <g transform="translate(148, 25)">
        {/* Arco power (semicírculo con gap arriba de ~60°) */}
        <path
          d="M 10 9 A 18 18 0 1 0 26 9"
          stroke="#C9A88A"
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Barra vertical del power icon */}
        <line
          x1="18"
          y1="-2"
          x2="18"
          y2="15"
          stroke="#C9A88A"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
      </g>

      {/* "n" beige */}
      <text
        x="200"
        y="61"
        fontFamily="'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        fontSize="54"
        fontWeight="700"
        letterSpacing="-2"
        fill="#C9A88A"
      >
        n
      </text>

      {/* Subtítulo */}
      {showSubtitle && (
        <text
          x="4"
          y="83"
          fontFamily="'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
          fontSize="10"
          fontWeight="400"
          letterSpacing="4.5"
          fill="#A6845F"
        >
          TRADING SOFTWARE
        </text>
      )}
    </svg>
  );
}

