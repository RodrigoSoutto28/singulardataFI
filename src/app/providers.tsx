import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "@/config/queryClient";
import { AuthProvider } from "@/features/auth/hooks/AuthContext";
import { LanguageProvider } from "@/shared/lib/i18n/LanguageContext"; // This was in contexts/LanguageContext.tsx, I moved it to shared/lib/i18n/
import { ThemeProvider } from "@/shared/lib/ThemeContext"; // This was in contexts/ThemeContext.tsx, I moved it to shared/lib/
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { ErrorBoundary } from "@/shared/components/feedback/ErrorBoundary";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AuthProvider>
                  {children}
                </AuthProvider>
              </BrowserRouter>
            </TooltipProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
