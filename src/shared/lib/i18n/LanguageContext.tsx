import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Language, translations, Translations } from '@/shared/lib/i18n/translations';

const VALID: Language[] = ['ES', 'EN', 'PT', 'FR'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('app-language') as Language | null;
    return stored && VALID.includes(stored) ? stored : 'ES';
  });

  const setLanguage = useCallback((lang: Language) => {
    const safe = VALID.includes(lang) ? lang : 'ES';
    setLanguageState(safe);
    localStorage.setItem('app-language', safe);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
