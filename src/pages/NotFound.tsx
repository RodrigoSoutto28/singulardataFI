import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LineChart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { PublicFooter } from '@/components/layout/PublicFooter';

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.warn('404:', location.pathname);
    }
  }, [location.pathname]);

  const copy = {
    ES: { title: '404 — Página no encontrada', sub: 'La página que buscás no existe o fue movida.', back: 'Volver al Panel de Control' },
    EN: { title: '404 — Page not found', sub: 'The page you are looking for does not exist or was moved.', back: 'Back to Dashboard' },
    PT: { title: '404 — Página não encontrada', sub: 'A página que você procura não existe ou foi movida.', back: 'Voltar ao Painel' },
  }[language];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto h-14 w-14 rounded-lg bg-primary flex items-center justify-center mb-6">
            <LineChart className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{copy.title}</h1>
          <p className="text-muted-foreground mb-6">{copy.sub}</p>
          <Button asChild>
            <Link to="/dashboard" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {copy.back}
            </Link>
          </Button>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
};

export default NotFound;
