import { Link } from 'react-router-dom';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { Language } from '@/shared/lib/i18n/translations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export function PublicFooter() {
  const { language, setLanguage } = useLanguage();

  const labels = {
    ES: { terms: 'Términos', privacy: 'Privacidad', contact: 'Contacto', rights: 'Todos los derechos reservados.' },
    EN: { terms: 'Terms', privacy: 'Privacy', contact: 'Contact', rights: 'All rights reserved.' },
    PT: { terms: 'Termos', privacy: 'Privacidade', contact: 'Contato', rights: 'Todos os direitos reservados.' },
  }[language];

  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© 2026 Mind On · {labels.rights}</p>
        <nav className="flex items-center gap-3">
          <Link to="/terminos" className="hover:text-foreground transition-colors">{labels.terms}</Link>
          <span aria-hidden>·</span>
          <Link to="/privacidad" className="hover:text-foreground transition-colors">{labels.privacy}</Link>
          <span aria-hidden>·</span>
          <a href="mailto:hello@mindon-trading.com" className="hover:text-foreground transition-colors">{labels.contact}</a>
        </nav>
        <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
          <SelectTrigger className="h-8 w-[88px] text-xs" aria-label="Idioma">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ES">Español</SelectItem>
            <SelectItem value="EN">English</SelectItem>
            <SelectItem value="PT">Português</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </footer>
  );
}


