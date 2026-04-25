import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('sidebar:collapsed') === '1';
  });

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar:collapsed', next ? '1' : '0');
      return next;
    });
  };

  const setCollapsedPersist = (v: boolean) => {
    setCollapsed(v);
    localStorage.setItem('sidebar:collapsed', v ? '1' : '0');
  };

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, setCollapsed: setCollapsedPersist }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarState() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebarState must be used within SidebarProvider');
  return ctx;
}
