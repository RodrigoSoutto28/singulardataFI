/**
 * PageLoader — skeleton de carga premium para transiciones entre workspaces.
 *
 * Diseño:
 * - Barra de progreso "shimmer" en el borde superior (100% ancho, 2px)
 * - Logo/icono central con pulso suave
 * - Tarjetas skeleton que imitan el layout del workspace de destino
 * - Usa SOLO variables CSS del tema → siempre coincide con el color actual
 * - Sin colores hardcoded; adaptable a dark/light y cualquier paleta futura
 */

import { useEffect, useState } from 'react';

// Shimmer skeleton block reutilizable
function SkeletonBlock({ className }: { className: string }) {
  return <div className={`rounded-lg skeleton-block ${className}`} />;
}

export function PageLoader({ label = 'Cargando...' }: { label?: string }) {
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    // Simula progreso acelerado: llega al 85% rápido y luego se detiene
    const t1 = setTimeout(() => setProgress(55), 80);
    const t2 = setTimeout(() => setProgress(78), 200);
    const t3 = setTimeout(() => setProgress(88), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className="workspace-loader"
      role="status"
      aria-label={label}
    >
      {/* Barra de progreso superior */}
      <div className="loader-progress-track">
        <div
          className="loader-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Área de contenido skeleton */}
      <div className="loader-body">
        {/* Fila de título + stat cards */}
        <div className="loader-header">
          <SkeletonBlock className="h-8 w-48" />
          <SkeletonBlock className="h-5 w-72 mt-2" />
        </div>

        {/* 4 stat cards */}
        <div className="loader-stat-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="loader-stat-card">
              <div className="flex items-center justify-between mb-3">
                <SkeletonBlock className="h-4 w-20" />
                <SkeletonBlock className="h-9 w-9 rounded-lg" />
              </div>
              <SkeletonBlock className="h-8 w-28" />
              <SkeletonBlock className="h-3 w-16 mt-2" />
            </div>
          ))}
        </div>

        {/* Área principal: chart + sidebar card */}
        <div className="loader-main-grid">
          <div className="loader-chart-card">
            <SkeletonBlock className="h-5 w-32 mb-4" />
            <SkeletonBlock className="h-40 w-full" />
          </div>
          <div className="loader-side-card">
            <SkeletonBlock className="h-5 w-24 mb-4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 mb-3">
                <SkeletonBlock className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1">
                  <SkeletonBlock className="h-3.5 w-full mb-1.5" />
                  <SkeletonBlock className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
