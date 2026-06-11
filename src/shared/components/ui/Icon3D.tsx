import { cn } from '@/shared/lib/utils';
import { icon3dRegistry, type Icon3DName } from '@/shared/lib/icon3d-registry';

interface Icon3DProps {
  /** Name of the 3D icon from the registry */
  name: Icon3DName;
  /** Tailwind classes for sizing (e.g. "h-5 w-5") */
  className?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** @deprecated - kept for API compatibility, no longer has effect */
  fusion?: boolean;
}

/**
 * Renders a 3D photorealistic sculpted icon from the icon registry.
 * Images are true PNGs with alpha channel — no CSS blend-mode hacks needed.
 */
export function Icon3D({ name, className, alt }: Icon3DProps) {
  const src = icon3dRegistry[name];

  return (
    <img
      src={src}
      alt={alt ?? name}
      loading="lazy"
      draggable={false}
      className={cn(
        'object-contain shrink-0 select-none transition-all duration-300',
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
export function createIcon3DComponent(name: Icon3DName, _fusion?: boolean) {
  const Icon3DComponent = ({ className }: { className?: string }) => (
    <Icon3D name={name} className={className} />
  );
  Icon3DComponent.displayName = `Icon3D(${name})`;
  return Icon3DComponent;
}
