import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Separator } from '@/shared/components/ui/separator';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
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
} from '@/shared/components/ui/alert-dialog';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';
import { useTheme } from '@/shared/lib/ThemeContext';
import { Language } from '@/shared/lib/i18n/translations';
import { supabase } from '@/config/supabase';
import { useQueryClient } from '@tanstack/react-query';
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
  MapPin as _MapPinIcon,
  Info as _InfoIcon,
  RefreshCw as _RefreshIcon,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useLoadSampleData } from '@/features/auth/components/onboarding/WelcomeModal';
import { resetOnboardingTour } from '@/features/auth/components/onboarding/OnboardingTour';
import { toast } from 'sonner';
import { useSubscription } from '@/shared/hooks/useSubscription';
import { UpgradeModal, useUpgradeModal } from '@/shared/components/ui/UpgradeModal';

export default function Settings() {
  const { profile, user, signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { load: loadSample, loading: loadingSample } = useLoadSampleData();
  const queryClient = useQueryClient();
  const { plan, isPro, isPower, isExpired, expiresAt, daysUntilExpiry } = useSubscription();
  const { upgradeModalOpen, featureMessage, recommendedPlan, openUpgradeModal, closeUpgradeModal } = useUpgradeModal();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  // Notification preferences — persistidas en localStorage
  const readNotifPref = (key: string, def = true) => {
    try { return localStorage.getItem(key) !== 'false'; } catch { return def; }
  };
  const [notifAI, setNotifAI] = useState(() => readNotifPref('notif_ai_insights'));
  const [notifReminders, setNotifReminders] = useState(() => readNotifPref('notif_trade_reminders'));
  const [notifWeekly, setNotifWeekly] = useState(() => readNotifPref('notif_weekly_reports'));
  const [notifOvertrading, setNotifOvertrading] = useState(() => readNotifPref('notif_overtrading'));

  const saveNotifPref = (key: string, value: boolean) => {
    try { localStorage.setItem(key, value ? 'true' : 'false'); } catch { /* ignore */ }
  };

  // Profile Form state
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [timezone, setTimezone] = useState(profile?.timezone || 'UTC');
  const [currency, setCurrency] = useState(profile?.currency || 'USD');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setTimezone(profile.timezone || 'UTC');
      setCurrency(profile.currency || 'USD');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim() || null,
          timezone,
          currency,
        })
      if (error) throw error;
      toast.success(t.settings.saveSuccess);
    } catch (err) {
      toast.error('Error al actualizar el perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const [profileRes, trades, psych, account] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('trades').select('*').eq('user_id', user.id),
        supabase.from('psychology_entries').select('*').eq('user_id', user.id),
        supabase.from('trading_accounts').select('*').eq('user_id', user.id),
      ]);

      // Surface any per-table failure instead of silently exporting partial data.
      const errors = [profileRes.error, trades.error, psych.error, account.error].filter(Boolean);
      if (errors.length > 0) {
        throw new Error(errors.map((e) => e!.message).join('; '));
      }

      const payload = {
        exported_at: new Date().toISOString(),
        user: { id: user.id, email: user.email },
        profile: profileRes.data,
        trades: trades.data ?? [],
        psychology_entries: psych.data ?? [],
        trading_accounts: account.data ?? [],
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindon-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Datos exportados correctamente');
    } catch (e) {
      console.error('[settings] export failed:', e);
      toast.error('No pudimos exportar tus datos. Intentá nuevamente.');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-account', {
        method: 'POST',
      });
      if (error || !(data as { success?: boolean })?.success) {
        throw error ?? new Error('delete failed');
      }
      toast.success('Tu cuenta y datos fueron eliminados.');
      // Limpiar cache de React Query antes de cerrar sesión
      queryClient.clear();
      await signOut();
    } catch {
      toast.error('No pudimos eliminar la cuenta. Contactanos a privacy@mindon-trading.com');
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
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
              <Select value={timezone} onValueChange={setTimezone}>
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
              <Select value={currency} onValueChange={setCurrency}>
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
          <Button onClick={handleSaveProfile} disabled={savingProfile}>
            {savingProfile ? t.settings.saving : t.settings.saveChanges}
          </Button>
        </CardContent>
      </Card>

      {/* Data & Onboarding */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            {t.settings.dataAndOnboarding}
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
            <Switch
              checked={notifAI}
              onCheckedChange={(v) => { setNotifAI(v); saveNotifPref('notif_ai_insights', v); }}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.settings.tradeReminders}</p>
              <p className="text-sm text-muted-foreground">{t.settings.tradeRemindersDesc}</p>
            </div>
            <Switch
              checked={notifReminders}
              onCheckedChange={(v) => { setNotifReminders(v); saveNotifPref('notif_trade_reminders', v); }}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.settings.weeklyReports}</p>
              <p className="text-sm text-muted-foreground">{t.settings.weeklyReportsDesc}</p>
            </div>
            <Switch
              checked={notifWeekly}
              onCheckedChange={(v) => { setNotifWeekly(v); saveNotifPref('notif_weekly_reports', v); }}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.settings.overtradingAlerts}</p>
              <p className="text-sm text-muted-foreground">{t.settings.overtradingAlertsDesc}</p>
            </div>
            <Switch
              checked={notifOvertrading}
              onCheckedChange={(v) => { setNotifOvertrading(v); saveNotifPref('notif_overtrading', v); }}
            />
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
            {plans.map((p) => {
              const isCurrentPlan = profile?.subscription_plan === p.id;
              const Icon = p.icon;

              return (
                <div
                  key={p.id}
                  className={cn(
                    'relative p-6 rounded-lg border transition-colors',
                    p.popular
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/50',
                    isCurrentPlan && 'ring-2 ring-primary'
                  )}
                >
                  {p.popular && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      {t.common.mostPopular}
                    </Badge>
                  )}
                  {isCurrentPlan && (
                    <Badge className="absolute -top-2 right-4 bg-emerald-600 text-white text-[10px]">
                      Activo
                    </Badge>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <Icon className={cn('h-6 w-6', p.popular ? 'text-primary' : 'text-muted-foreground')} />
                    <h3 className="font-bold text-lg">{p.name}</h3>
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold font-mono-numbers">${p.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{p.description}</p>

                  {/* Show expiry info for current paid plan */}
                  {isCurrentPlan && p.id !== 'free' && expiresAt && (
                    <div className={cn(
                      'mb-4 rounded-md px-3 py-2 text-xs',
                      isExpired
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    )}>
                      {isExpired
                        ? `⚠️ Vencido el ${new Date(expiresAt).toLocaleDateString('es-ES')}`
                        : daysUntilExpiry !== null && daysUntilExpiry <= 7
                        ? `⏰ Vence en ${daysUntilExpiry} día${daysUntilExpiry === 1 ? '' : 's'}`
                        : `✓ Activo hasta ${new Date(expiresAt).toLocaleDateString('es-ES')}`
                      }
                    </div>
                  )}

                  <ul className="space-y-2 mb-6">
                    {p.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full" disabled>
                      {t.common.currentPlan}
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold gap-2"
                      onClick={() => openUpgradeModal({ plan: p.id as 'pro' | 'power' })}
                    >
                      <Sparkles className="h-4 w-4" />
                      {t.common.upgrade} a {p.name}
                    </Button>
                  )}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Autenticación de dos factores disponible próximamente.')}
            >
              {t.common.enable}
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.settings.changePassword}</p>
              <p className="text-sm text-muted-foreground">{t.settings.changePasswordDesc}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (!user?.email) return;
                const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                  redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) toast.error('No se pudo enviar el email de cambio de contraseña.');
                else toast.success('Te enviamos un email para cambiar tu contraseña.');
              }}
            >
              {t.common.change}
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.settings.activeSessions}</p>
              <p className="text-sm text-muted-foreground">{t.settings.activeSessionsDesc}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info('Gestión de sesiones disponible próximamente.')}
            >
              {t.settings.viewAll}
            </Button>
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
import { MapPin as _MapPinIcon, Info as _InfoIcon, RefreshCw as _RefreshIcon, Trash2 as _TrashIcon } from 'lucide-react';
import { useIPGeolocation } from '@/shared/hooks/useIPGeolocation';

function GeolocationCard() {
  const { t } = useLanguage();
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem('singular_use_ip_detection') !== 'false',
  );
  const { detection, isLoading, detectLocation, reset, hasCache } = useIPGeolocation();

  useEffect(() => {
    localStorage.setItem('singular_use_ip_detection', enabled ? 'true' : 'false');
  }, [enabled]);

  const geo = t.settings.geolocation;
  const labels = {
    title: geo?.title ?? 'Detección de Ubicación',
    description: geo?.description ?? 'Usa tu ubicación para detectar automáticamente el idioma apropiado.',
    toggle: geo?.toggle ?? 'Detección de idioma por IP',
    privacy: geo?.privacy ?? 'Privacidad: Solo detectamos tu país (no guardamos tu IP). Los resultados se guardan localmente por 7 días.',
    detected: geo?.detected ?? 'Ubicación detectada',
    country: geo?.country ?? 'País',
    city: geo?.city ?? 'Ciudad',
    language: geo?.language ?? 'Idioma',
    source: geo?.source ?? 'Servicio',
    detectNow: geo?.detectNow ?? 'Detectar ahora',
    clear: geo?.clear ?? 'Limpiar caché',
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
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



