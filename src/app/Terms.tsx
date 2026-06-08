import { Link } from 'react-router-dom';
import { LineChart } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { PublicFooter } from '@/shared/components/layout/PublicFooter';

export default function Terms() {
  const { language } = useLanguage();

  const c = {
    ES: {
      title: 'Términos y Condiciones',
      updated: 'Última actualización: 1 de mayo de 2026',
      body: [
        ['1. Aceptación', 'Al usar MindOn aceptás estos términos. Si no estás de acuerdo, no utilices la plataforma.'],
        ['2. Naturaleza del servicio', 'MindOn es una herramienta de análisis y registro de operaciones. No ofrece asesoramiento financiero, ni señales, ni promesas de rentabilidad. El usuario es el único responsable de sus decisiones de inversión.'],
        ['3. Cuenta', 'Sos responsable de mantener la confidencialidad de tus credenciales. Notificá inmediatamente cualquier uso no autorizado.'],
        ['4. Datos del usuario', 'Tus operaciones, notas y métricas son privadas y nos pertenecés a vos. Podés exportarlas o eliminarlas en cualquier momento desde Configuración.'],
        ['5. Limitación de responsabilidad', 'MindOn no se responsabiliza por pérdidas financieras derivadas del uso de la plataforma. El servicio se ofrece "tal cual" sin garantías.'],
        ['6. Modificaciones', 'Podemos actualizar estos términos. Las modificaciones se comunican en la app y se publican en esta misma página.'],
        ['7. Contacto', 'Para consultas: hello@mindon-trading.com'],
      ],
    },
    EN: {
      title: 'Terms and Conditions',
      updated: 'Last updated: May 1, 2026',
      body: [
        ['1. Acceptance', 'By using MindOn you agree to these terms. If you do not agree, do not use the platform.'],
        ['2. Nature of service', 'MindOn is an analytics and journaling tool. It does not provide financial advice, signals, or profit guarantees. The user is solely responsible for their investment decisions.'],
        ['3. Account', 'You are responsible for keeping your credentials confidential. Report unauthorized use immediately.'],
        ['4. User data', 'Your trades, notes and metrics are private and belong to you. You may export or delete them anytime from Settings.'],
        ['5. Limitation of liability', 'MindOn is not liable for financial losses derived from the use of the platform. The service is provided "as is" without warranties.'],
        ['6. Changes', 'We may update these terms. Updates are posted in the app and on this page.'],
        ['7. Contact', 'For inquiries: hello@mindon-trading.com'],
      ],
    },
    PT: {
      title: 'Termos e Condições',
      updated: 'Última atualização: 1 de maio de 2026',
      body: [
        ['1. Aceitação', 'Ao usar o MindOn você aceita estes termos. Se não concorda, não utilize a plataforma.'],
        ['2. Natureza do serviço', 'MindOn é uma ferramenta de análise e diário. Não oferece assessoria financeira, sinais ou garantias de lucro. O usuário é o único responsável pelas suas decisões.'],
        ['3. Conta', 'Você é responsável por manter suas credenciais confidenciais. Comunique uso não autorizado imediatamente.'],
        ['4. Dados do usuário', 'Suas operações, notas e métricas são privadas e pertencem a você. Pode exportá-las ou eliminá-las em Configurações.'],
        ['5. Limitação de responsabilidade', 'MindOn não se responsabiliza por perdas financeiras. O serviço é fornecido "como está" sem garantias.'],
        ['6. Alterações', 'Podemos atualizar estes termos. As alterações são publicadas no app e nesta página.'],
        ['7. Contato', 'Consultas: hello@mindon-trading.com'],
      ],
    },
  }[language];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <LineChart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold leading-tight">MindOn</p>
              <p className="text-xs text-muted-foreground">Trading Software</p>
            </div>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">{c.title}</h1>
          <p className="text-xs text-muted-foreground mb-8">{c.updated}</p>
          <div className="space-y-6">
            {c.body.map(([h, p]) => (
              <section key={h}>
                <h2 className="font-semibold mb-1">{h}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{p}</p>
              </section>
            ))}
          </div>
        </article>
      </main>
      <PublicFooter />
    </div>
  );
}

