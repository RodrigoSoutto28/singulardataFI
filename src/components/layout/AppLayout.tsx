import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { CorporateGrid } from '@/components/effects/CorporateGrid';
import { useLanguage } from '@/contexts/LanguageContext';

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
    if (isTablet) setCollapsed(true);
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
    <div className="flex min-h-screen w-full bg-background relative overflow-hidden">
      <CorporateGrid />

      {/* Desktop / Tablet Sidebar */}
      <div className="hidden md:block relative z-10">
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
          <div className="mx-auto w-full max-w-[1440px] px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-7 page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
