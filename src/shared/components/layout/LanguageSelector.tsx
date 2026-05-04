import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import {
  SUPPORTED_LANGUAGE_LIST,
  SupportedLanguage,
  getLanguageName,
  getLanguageFlag,
  toContextCode,
  toDbCode,
} from '@/shared/lib/i18n/detector';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';

interface Props {
  variant?: 'default' | 'compact';
}

export function LanguageSelector({ variant = 'default' }: Props) {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const current = toDbCode(language);

  const handleChange = async (next: SupportedLanguage) => {
    if (busy || next === current) return;
    setBusy(true);
    try {
      setLanguage(toContextCode(next));
      if (user) {
        await supabase.from('profiles').update({ language: next } as any).eq('id', user.id);
      }
      const messages: Record<SupportedLanguage, string> = {
        es: 'Idioma cambiado a Español',
        en: 'Language changed to English',
        pt: 'Idioma alterado para Português',
        fr: 'Langue changée en Français',
      };
      toast.success(messages[next]);
    } catch (e) {
      console.error('Error changing language:', e);
      toast.error('Error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === 'compact' ? (
          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Language">
            <span className="text-base leading-none">{getLanguageFlag(current)}</span>
          </Button>
        ) : (
          <Button variant="outline" className="gap-2">
            <Globe className="h-4 w-4" />
            <span>{getLanguageFlag(current)}</span>
            <span>{getLanguageName(current)}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {SUPPORTED_LANGUAGE_LIST.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleChange(lang)}
            className={cn(
              'cursor-pointer flex items-center justify-between gap-2',
              lang === current && 'bg-accent',
            )}
          >
            <span className="flex items-center gap-2">
              <span>{getLanguageFlag(lang)}</span>
              <span>{getLanguageName(lang)}</span>
            </span>
            {lang === current && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


