/**
 * PageLoader — estado de carga para transiciones entre workspaces.
 *
 * Diseño:
 * - Barra de progreso delgada en el borde superior del área de contenido (NO fixed/overlay)
 * - Skeleton con transparencia — el layout (sidebar, topbar, logo) permanece siempre visible
 * - Usa SOLO variables CSS del tema → se adapta a dark/light y cualquier paleta
 * - Animación rápida y discreta para no interrumpir la experiencia
 */

import { useEffect, useState } from 'react';

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`rounded-md skeleton-block ${className}`} />;
}

export function PageLoader({ label = 'Cargando...' }: { label?: string }) {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Progreso acelerado hacia 85%
    const t1 = setTimeout(() => setProgress(50), 60);
    const t2 = setTimeout(() => setProgress(75), 160);
    const t3 = setTimeout(() => setProgress(88), 320);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="workspace-loader" role="status" aria-label={label}>

      {/* Barra de progreso — relativa al área de contenido, NO cubre el header */}
      <div className="loader-progress-track">
        <div className="loader-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Skeleton del contenido — transparente, sin fondos opacos */}
      <div className="loader-body">

        {/* Título y subtítulo de sección */}
        <div className="loader-header">
          <SkeletonBlock className="h-7 w-44" />
          <SkeletonBlock className="h-4 w-64 mt-2" />
        </div>

        {/* 4 stat cards */}
        <div className="loader-stat-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="loader-stat-card">
              <div className="flex items-center justify-between mb-3">
                <SkeletonBlock className="h-3.5 w-16" />
                <SkeletonBlock className="h-8 w-8 rounded-lg" />
              </div>
              <SkeletonBlock className="h-7 w-24" />
              <SkeletonBlock className="h-3 w-14 mt-2" />
            </div>
          ))}
        </div>

        {/* Chart + lista lateral */}
        <div className="loader-main-grid">
          <div className="loader-chart-card">
            <SkeletonBlock className="h-4 w-28 mb-4" />
            <SkeletonBlock className="h-36 w-full" />
          </div>
          <div className="loader-side-card">
            <SkeletonBlock className="h-4 w-20 mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 mb-3">
                <SkeletonBlock className="h-9 w-9 rounded-full shrink-0" />
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
