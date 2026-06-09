import { cn } from '@/shared/lib/utils';
import { icon3dRegistry, type Icon3DName } from '@/shared/lib/icon3d-registry';

interface Icon3DProps {
  /** Name of the 3D icon from the registry */
  name: Icon3DName;
  /** Tailwind classes for sizing (e.g. "h-5 w-5") */
  className?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Apply advanced blending/fusion styling to emerge from the background */
  fusion?: boolean;
}

/**
 * Renders a 3D photorealistic sculpted icon from the icon registry.
 * Drop-in replacement for lucide-react icons with the same sizing API.
 */
export function Icon3D({ name, className, alt, fusion = false }: Icon3DProps) {
  const src = icon3dRegistry[name];

  return (
    <img
      src={src}
      alt={alt ?? name}
      loading="lazy"
      draggable={false}
      className={cn(
        'object-contain shrink-0 select-none transition-all duration-300',
        fusion && 'icon3d-fusion filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.35)]',
        className
      )}
    />
  );
}

/**
 * Wrapper component factory that creates an Icon3D with a preset name.
 * This enables using Icon3D as a drop-in for components that expect
 * a React component with a `className` prop (like NavItem.icon).
 */
export function createIcon3DComponent(name: Icon3DName, defaultFusion = false) {
  const Icon3DComponent = ({ className }: { className?: string }) => (
    <Icon3D name={name} className={className} fusion={defaultFusion} />
  );
  Icon3DComponent.displayName = `Icon3D(${name})`;
  return Icon3DComponent;
}
