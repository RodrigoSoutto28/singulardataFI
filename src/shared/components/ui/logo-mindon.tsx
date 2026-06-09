/**
 * LogoMindOn — Logo de la marca MindOn Trading Software.
 *
 * Diseño 100% fiel al logo oficial:
 *   - "Mind" en color adaptable al tema (text-foreground)
 *   - "O" representada como un ícono de power en beige #C9A88A
 *   - "n" en beige #C9A88A
 *   - Subtítulo "TRADING SOFTWARE" en dorado/bronce #A6845F
 *
 * Se utiliza una estructura HTML con Flexbox en lugar de coordenadas SVG absolutas
 * para el texto. Esto previene desalineaciones, problemas de renderizado de fuentes
 * del sistema, solapamientos y cortes inexplicables en distintos navegadores.
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

export function LogoMindOn({ size = 'md', showSubtitle = false, className }: LogoMindOnProps) {
  // Configuración de tamaños para asegurar proporción matemática perfecta
  const styles = {
    sm: {
      fontSize: '20px',
      iconSize: '15px',
      iconStroke: '2.5',
      subtitleSize: '7.5px',
      subtitleSpacing: '2px',
      gap: '2px',
      marginTop: '1px',
    },
    md: {
      fontSize: '26px',
      iconSize: '20px',
      iconStroke: '3.5',
      subtitleSize: '9px',
      subtitleSpacing: '3px',
      gap: '3px',
      marginTop: '2px',
    },
    lg: {
      fontSize: '48px',
      iconSize: '36px',
      iconStroke: '6',
      subtitleSize: '15px',
      subtitleSpacing: '5px',
      gap: '5.5px',
      marginTop: '4px',
    },
  }[size];

  return (
    <div className={cn('flex flex-col items-start select-none font-bold', className)}>
      <div 
        className="flex items-center leading-none" 
        style={{ gap: styles.gap }}
      >
        {/* "Mind" en color adaptable */}
        <span 
          className="text-foreground tracking-tight"
          style={{ 
            fontSize: styles.fontSize,
            fontFamily: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 700,
          }}
        >
          Mind
        </span>

        {/* Icono de Power "O" */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A88A"
          strokeWidth={styles.iconStroke}
          strokeLinecap="round"
          className="shrink-0"
          style={{ 
            width: styles.iconSize, 
            height: styles.iconSize,
          }}
        >
          {/* Círculo del botón de encendido con apertura en la parte superior */}
          <path d="M 18.36 5.64 A 9 9 0 1 1 5.64 5.64" />
          {/* Línea vertical que pasa por el centro del gap superior */}
          <line x1="12" y1="2" x2="12" y2="12" />
        </svg>

        {/* "n" en color beige oficial */}
        <span 
          className="tracking-tight"
          style={{ 
            fontSize: styles.fontSize,
            color: '#C9A88A',
            fontFamily: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 700,
          }}
        >
          n
        </span>
      </div>

      {/* Subtítulo "TRADING SOFTWARE" */}
      {showSubtitle && (
        <span
          className="uppercase tracking-wider font-semibold"
          style={{
            fontSize: styles.subtitleSize,
            letterSpacing: styles.subtitleSpacing,
            color: '#A6845F',
            fontFamily: "'Geist', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            marginTop: styles.marginTop,
            paddingLeft: '1px',
          }}
        >
          TRADING SOFTWARE
        </span>
      )}
    </div>
  );
}
