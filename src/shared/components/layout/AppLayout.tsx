import { useEffect, useState, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Sheet, SheetContent } from '@/shared/components/ui/sheet';
import { CorporateGrid } from '@/shared/components/effects/CorporateGrid';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { PageLoader } from '@/shared/components/ui/page-loader';

function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const handler = () => setIsTablet(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isTablet;
}

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isTablet = useIsTablet();
  const location = useLocation();
  const { t } = useLanguage();

  // Tablet defaults to collapsed; user can expand. Persist their choice.
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored !== null) return stored === 'true';
    return false;
  });

  useEffect(() => {
    // Only auto-collapse on tablet if the user has no saved preference
    if (isTablet && localStorage.getItem('sidebar-collapsed') === null) {
      setCollapsed(true);
    }
  }, [isTablet]);

  const handleToggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  // Section title shown on mobile header
  const sectionTitle = (() => {
    const p = location.pathname;
    if (p.startsWith('/dashboard')) return t.nav.dashboard;
    if (p.startsWith('/journal')) return t.nav.journal;
    if (p.startsWith('/analytics')) return t.nav.analytics;
    if (p.startsWith('/psychology')) return t.nav.psychology;
    if (p.startsWith('/settings')) return t.nav.settings;
    if (p.startsWith('/admin')) return 'Admin';
    return '';
  })();

  return (
    <div className="flex h-[100dvh] w-full bg-background relative overflow-hidden">
      <CorporateGrid />

      {/* Desktop / Tablet Sidebar */}
      <div className="hidden md:block relative z-10 h-full">
        <Sidebar collapsed={collapsed} onToggleCollapsed={handleToggleCollapsed} />
      </div>

      {/* Mobile Sidebar Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-[280px] bg-sidebar border-r border-border">
          <Sidebar
            collapsed={false}
            onItemClick={() => setMobileMenuOpen(false)}
            showQuickToggles
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <TopBar
          onMenuClick={() => setMobileMenuOpen(true)}
          sectionTitle={sectionTitle}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
            {/*
              key={location.key}: fuerza a React a desmontar y remontar el Suspense
              en cada navegación, mostrando el skeleton loader siempre desde cero
              y con los colores actuales del tema (sin "freeze" del workspace anterior).
            */}
            <Suspense key={location.key} fallback={<PageLoader />}>
              <div className="page-enter">
                <Outlet />
              </div>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
