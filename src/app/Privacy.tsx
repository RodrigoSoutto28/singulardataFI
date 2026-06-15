import { Link } from 'react-router-dom';
import { Power } from 'lucide-react';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { PublicFooter } from '@/shared/components/layout/PublicFooter';
import { TechGridTexture } from '@/shared/components/effects/TechGridTexture';

export default function Privacy() {
  const { language } = useLanguage();

  const c = {
    ES: {
      title: 'Política de Privacidad',
      updated: 'Última actualización: 1 de mayo de 2026',
      body: [
        ['Datos que recopilamos', 'Email, nombre, operaciones que registrás manualmente o importás, notas, métricas psicológicas y configuración de cuenta.'],
        ['Uso de los datos', 'Usamos tus datos exclusivamente para brindarte análisis personalizados dentro de la plataforma. Nunca vendemos tu información a terceros.'],
        ['Análisis con IA', 'Cuando solicitás insights, fragmentos relevantes de tus operaciones se procesan con modelos de IA bajo acuerdos de confidencialidad. No se utilizan para entrenar modelos públicos.'],
        ['Almacenamiento', 'Tus datos se almacenan de forma segura en infraestructura cifrada con políticas de acceso por usuario (Row Level Security).'],
        ['Tus derechos', 'Podés exportar todos tus datos o eliminar tu cuenta en cualquier momento desde Configuración → Privacidad.'],
        ['Cookies', 'Usamos cookies técnicas necesarias para la sesión. No utilizamos cookies de terceros con fines publicitarios.'],
        ['Contacto', 'Para ejercer tus derechos o consultas: privacy@mindon-trading.com'],
      ],
    },
    EN: {
      title: 'Privacy Policy',
      updated: 'Last updated: May 1, 2026',
      body: [
        ['Data we collect', 'Email, name, trades you log or import, notes, psychology metrics and account settings.'],
        ['Data usage', 'We use your data only to provide personalized analytics inside the platform. We never sell your information to third parties.'],
        ['AI analysis', 'When you request insights, relevant trade snippets are processed by AI models under confidentiality agreements. They are not used to train public models.'],
        ['Storage', 'Your data is stored securely with encrypted infrastructure and per-user access policies (Row Level Security).'],
        ['Your rights', 'You can export all your data or delete your account anytime from Settings → Privacy.'],
        ['Cookies', 'We use essential cookies for sessions only. No third-party advertising cookies.'],
        ['Contact', 'For inquiries: privacy@mindon-trading.com'],
      ],
    },
    PT: {
      title: 'Política de Privacidade',
      updated: 'Última atualização: 1 de maio de 2026',
      body: [
        ['Dados coletados', 'Email, nome, operações que você registra ou importa, notas, métricas psicológicas e configurações.'],
        ['Uso dos dados', 'Usamos seus dados exclusivamente para análises personalizadas. Nunca vendemos informações a terceiros.'],
        ['Análise com IA', 'Trechos relevantes das suas operações são processados por modelos de IA sob confidencialidade. Não treinamos modelos públicos com seus dados.'],
        ['Armazenamento', 'Seus dados são armazenados em infraestrutura criptografada com políticas de acesso por usuário.'],
        ['Seus direitos', 'Você pode exportar todos os seus dados ou excluir sua conta em Configurações → Privacidade.'],
        ['Cookies', 'Usamos apenas cookies técnicos. Sem cookies publicitários de terceiros.'],
        ['Contato', 'Consultas: privacy@mindon-trading.com'],
      ],
    },
  }[language];

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <TechGridTexture />
      <header className="border-b border-border relative z-10 bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Power strokeWidth={2.5} className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold leading-tight">Mind On</p>
              <p className="text-xs text-muted-foreground">Trading Software</p>
            </div>
          </Link>
        </div>
      </header>
      <main className="flex-1 relative z-10">
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

