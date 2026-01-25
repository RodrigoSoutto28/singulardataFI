import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { NeuronParticles } from '@/components/effects/NeuronParticles';

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Neuron Particles Background */}
      <NeuronParticles />

      {/* Desktop Sidebar - above particles */}
      <div className="hidden md:block relative z-10">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-[260px] glass-sidebar">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content - above particles */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
