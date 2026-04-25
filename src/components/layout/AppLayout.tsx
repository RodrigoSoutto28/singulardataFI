import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { CorporateGrid } from '@/components/effects/CorporateGrid';
import { SidebarProvider } from '@/contexts/SidebarContext';

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background relative overflow-hidden">
        <CorporateGrid />

        {/* Desktop Sidebar */}
        <div className="hidden md:block relative z-10">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-[260px] bg-sidebar border-r border-border">
            <Sidebar mobile onNavigate={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
