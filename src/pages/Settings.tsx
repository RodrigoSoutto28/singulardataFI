import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Language } from '@/i18n/translations';
import { supabase } from '@/integrations/supabase/client';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Zap,
  Check,
  Crown,
  Rocket,
  Database,
  Loader2,
  Sparkles,
  Globe,
  Download,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLoadSampleData } from '@/components/onboarding/WelcomeModal';
import { resetOnboardingTour } from '@/components/onboarding/OnboardingTour';
import { toast } from 'sonner';

export default function Settings() {
  const { profile, user, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { load: loadSample, loading: loadingSample } = useLoadSampleData();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const [trades, psych, account] = await Promise.all([
        supabase.from('trades').select('*').eq('user_id', user.id),
        supabase.from('psychology_entries').select('*').eq('user_id', user.id),
        supabase.from('trading_accounts').select('*').eq('user_id', user.id),
      ]);
      const payload = {
        exported_at: new Date().toISOString(),
        user: { id: user.id, email: user.email },
        profile,
        trades: trades.data ?? [],
        psychology_entries: psych.data ?? [],
        trading_accounts: account.data ?? [],
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `singular-datafi-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Datos exportados correctamente');
    } catch (e) {
      toast.error('No pudimos exportar tus datos. Intentá nuevamente.');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      // Borrar datos del usuario (RLS limita al propio usuario)
      await Promise.all([
        supabase.from('trades').delete().eq('user_id', user.id),
        supabase.from('psychology_entries').delete().eq('user_id', user.id),
        supabase.from('trading_accounts').delete().eq('user_id', user.id),
        supabase.from('profiles').delete().eq('id', user.id),
      ]);
      toast.success('Tu cuenta y datos fueron eliminados.');
      await signOut();
    } catch {
      toast.error('No pudimos eliminar la cuenta. Contactanos a privacy@singulardatafi.com');
    } finally {
      setDeleting(false);
    }
  };


  const plans = [
    {
      id: 'free',
      name: t.settings.plans.free,
      price: 0,
      description: t.settings.plans.freeDesc,
      icon: Zap,
      features: [
        t.settings.plans.features.tradesPerMonth,
        t.settings.plans.features.basicAnalytics,
        t.settings.plans.features.psychologyTracking,
        t.settings.plans.features.dataRetention,
      ],
    },
    {
      id: 'pro',
      name: t.settings.plans.pro,
      price: 29,
      description: t.settings.plans.proDesc,
      icon: Crown,
      popular: true,
      features: [
        t.settings.plans.features.unlimited,
        t.settings.plans.features.aiInsights,
        t.settings.plans.features.advancedAnalytics,
        t.settings.plans.features.exportReports,
        t.settings.plans.features.multipleAccounts,
        t.settings.plans.features.prioritySupport,
      ],
    },
    {
      id: 'power',
      name: t.settings.plans.power,
      price: 79,
      description: t.settings.plans.powerDesc,
      icon: Rocket,
      features: [
        t.settings.plans.features.everythingInPro,
        t.settings.plans.features.backtesting,
        t.settings.plans.features.apiAccess,
        t.settings.plans.features.customIntegrations,
        t.settings.plans.features.dedicatedSupport,
        t.settings.plans.features.whiteLabel,
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t.settings.title}</h1>
        <p className="text-muted-foreground">{t.settings.subtitle}</p>
      </div>

      {/* Profile Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {t.settings.profile}
          </CardTitle>
          <CardDescription>{t.settings.personalInfo}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.settings.fullName}</Label>
              <Input
                defaultValue={profile?.full_name || ''}
                placeholder={t.settings.yourName}
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label>{t.settings.email}</Label>
              <Input
                defaultValue={profile?.email || ''}
                disabled
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label>{t.settings.timezone}</Label>
              <Select defaultValue={profile?.timezone || 'UTC'}>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t.settings.currency}</Label>
              <Select defaultValue={profile?.currency || 'USD'}>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="ARS">ARS ($)</SelectItem>
                  <SelectItem value="BRL">BRL (R$)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button>{t.settings.saveChanges}</Button>
        </CardContent>
      </Card>

      {/* Data & Onboarding */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Datos y Onboarding
          </CardTitle>
          <CardDescription>
            Cargá datos de ejemplo para explorar la plataforma o reiniciá el
            tour de bienvenida.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="font-medium text-sm">Cargar datos de ejemplo</p>
              <p className="text-xs text-muted-foreground">
                Agrega 30 operaciones distribuidas en los últimos 2 meses.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadSample}
              disabled={loadingSample}
              className="gap-2"
              aria-label="Cargar datos de ejemplo"
            >
              {loadingSample ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              {loadingSample ? 'Cargando...' : 'Cargar ejemplos'}
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="font-medium text-sm">Tour de bienvenida</p>
              <p className="text-xs text-muted-foreground">
                Vuelve a mostrar la guía interactiva de 5 pasos.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetOnboardingTour}
              className="gap-2"
              aria-label="Repetir tour de bienvenida"
            >
              <Sparkles className="h-4 w-4" />
              Repetir tour
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            {t.settings.notifications}
          </CardTitle>
          <CardDescription>{t.settings.configureAlerts}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.settings.aiInsights}</p>
              <p className="text-sm text-muted-foreground">{t.settings.aiInsightsDesc}</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.settings.tradeReminders}</p>
              <p className="text-sm text-muted-foreground">{t.settings.tradeRemindersDesc}</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.settings.weeklyReports}</p>
              <p className="text-sm text-muted-foreground">{t.settings.weeklyReportsDesc}</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.settings.overtradingAlerts}</p>
              <p className="text-sm text-muted-foreground">{t.settings.overtradingAlertsDesc}</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {t.settings.subscription}
          </CardTitle>
          <CardDescription>{t.settings.managePlan}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isCurrentPlan = profile?.subscription_plan === plan.id;
              const Icon = plan.icon;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    'relative p-6 rounded-lg border transition-colors',
                    plan.popular
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/50',
                    isCurrentPlan && 'ring-2 ring-primary'
                  )}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      {t.common.mostPopular}
                    </Badge>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <Icon className={cn('h-6 w-6', plan.popular ? 'text-primary' : 'text-muted-foreground')} />
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold font-mono-numbers">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={isCurrentPlan ? 'outline' : 'default'}
                    className="w-full"
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? t.common.currentPlan : t.common.upgrade}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {t.settings.security}
          </CardTitle>
          <CardDescription>{t.settings.protectAccount}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.settings.twoFactor}</p>
              <p className="text-sm text-muted-foreground">{t.settings.twoFactorDesc}</p>
            </div>
            <Button variant="outline" size="sm">{t.common.enable}</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.settings.changePassword}</p>
              <p className="text-sm text-muted-foreground">{t.settings.changePasswordDesc}</p>
            </div>
            <Button variant="outline" size="sm">{t.common.change}</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.settings.activeSessions}</p>
              <p className="text-sm text-muted-foreground">{t.settings.activeSessionsDesc}</p>
            </div>
            <Button variant="outline" size="sm">{t.settings.viewAll}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Apariencia */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Apariencia
          </CardTitle>
          <CardDescription>Personalizá el aspecto de la plataforma.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-medium text-sm">Tema</p>
              <p className="text-xs text-muted-foreground">Claro, oscuro o seguir el sistema.</p>
            </div>
            <Select
              value={theme}
              onValueChange={(v) => setTheme(v as 'light' | 'dark')}
            >
              <SelectTrigger className="w-[180px] bg-muted/50" aria-label="Seleccionar tema">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Oscuro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Idioma */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Idioma
          </CardTitle>
          <CardDescription>Se aplica a toda la interfaz.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-muted-foreground">Idioma de la aplicación</p>
            <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
              <SelectTrigger className="w-[180px] bg-muted/50" aria-label="Seleccionar idioma">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ES">Español</SelectItem>
                <SelectItem value="EN">English</SelectItem>
                <SelectItem value="PT">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacidad / Danger Zone */}
      <Card className="bg-destructive/5 border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">{t.settings.dangerZone}</CardTitle>
          <CardDescription>{t.settings.irreversibleActions}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="font-medium">{t.settings.exportAllData}</p>
              <p className="text-sm text-muted-foreground">{t.settings.exportDataDesc}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting}
              className="gap-2"
              aria-label="Exportar todos mis datos"
            >
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {t.common.export}
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="font-medium text-destructive">{t.settings.deleteAccount}</p>
              <p className="text-sm text-muted-foreground">{t.settings.deleteAccountDesc}</p>
            </div>
            <AlertDialog onOpenChange={() => setConfirmText('')}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2" aria-label="Eliminar cuenta">
                  <Trash2 className="h-4 w-4" />
                  {t.common.delete}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar cuenta de forma permanente?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminarán tus operaciones, notas y configuración.
                    Para confirmar, escribí <strong>ELIMINAR</strong> a continuación.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="ELIMINAR"
                  aria-label="Confirmación de eliminación"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={confirmText !== 'ELIMINAR' || deleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleting ? 'Eliminando…' : 'Eliminar definitivamente'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <GeolocationCard />
    </div>
  );
}

// ============================================================
// IP geolocation settings card
// ============================================================
import { useEffect as _useEffectGeo, useState as _useStateGeo } from 'react';
import { Globe as _GlobeIcon, MapPin as _MapPinIcon, Info as _InfoIcon, RefreshCw as _RefreshIcon, Trash2 as _TrashIcon } from 'lucide-react';
import { useIPGeolocation } from '@/hooks/useIPGeolocation';

function GeolocationCard() {
  const { t } = useLanguage();
  const [enabled, setEnabled] = _useStateGeo(
    () => localStorage.getItem('singular_use_ip_detection') !== 'false',
  );
  const { detection, isLoading, detectLocation, reset, hasCache } = useIPGeolocation();

  _useEffectGeo(() => {
    localStorage.setItem('singular_use_ip_detection', enabled ? 'true' : 'false');
  }, [enabled]);

  const labels = {
    title: (t as any)?.settings?.geolocation?.title || 'Detección de Ubicación',
    description:
      (t as any)?.settings?.geolocation?.description ||
      'Usa tu ubicación para detectar automáticamente el idioma apropiado.',
    toggle: (t as any)?.settings?.geolocation?.toggle || 'Detección de idioma por IP',
    privacy:
      (t as any)?.settings?.geolocation?.privacy ||
      'Privacidad: Solo detectamos tu país (no guardamos tu IP). Los resultados se guardan localmente por 7 días.',
    detected: (t as any)?.settings?.geolocation?.detected || 'Ubicación detectada',
    country: (t as any)?.settings?.geolocation?.country || 'País',
    city: (t as any)?.settings?.geolocation?.city || 'Ciudad',
    language: (t as any)?.settings?.geolocation?.language || 'Idioma',
    source: (t as any)?.settings?.geolocation?.source || 'Servicio',
    detectNow: (t as any)?.settings?.geolocation?.detectNow || 'Detectar ahora',
    clear: (t as any)?.settings?.geolocation?.clear || 'Limpiar caché',
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <_GlobeIcon className="h-5 w-5 text-primary" />
          {labels.title}
        </CardTitle>
        <CardDescription>{labels.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label htmlFor="ip-detection-toggle" className="text-sm font-medium">
              {labels.toggle}
            </Label>
            <p className="text-xs text-muted-foreground">{labels.privacy.split(':')[1]?.trim()}</p>
          </div>
          <Switch
            id="ip-detection-toggle"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        <div className="flex items-start gap-2 rounded-md border border-border bg-muted/30 p-3">
          <_InfoIcon className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">{labels.privacy}</p>
        </div>

        {enabled && (
          <div className="rounded-md border border-border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <_MapPinIcon className="h-4 w-4 text-primary" />
              {labels.detected}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-muted-foreground">{labels.country}: </span>
                <span className="text-foreground">
                  {detection?.countryName || '—'}{' '}
                  {detection?.country && detection.country !== 'UNKNOWN' && `(${detection.country})`}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">{labels.city}: </span>
                <span className="text-foreground">{detection?.city || '—'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{labels.language}: </span>
                <span className="text-foreground uppercase">{detection?.language || '—'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{labels.source}: </span>
                <span className="text-foreground">
                  {detection?.service || '—'}
                  {detection?.cached && ' (cache)'}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => detectLocation().catch(() => {})}
                disabled={isLoading}
                className="gap-2"
              >
                <_RefreshIcon className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')} />
                {labels.detectNow}
              </Button>
              {hasCache && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  className="gap-2 text-muted-foreground"
                >
                  <_TrashIcon className="h-3.5 w-3.5" />
                  {labels.clear}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
