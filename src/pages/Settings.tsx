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
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Palette,
  Zap,
  Check,
  Crown,
  Rocket,
  Database,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLoadSampleData } from '@/components/onboarding/WelcomeModal';
import { resetOnboardingTour } from '@/components/onboarding/OnboardingTour';

export default function Settings() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const { load: loadSample, loading: loadingSample } = useLoadSampleData();

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
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button>{t.settings.saveChanges}</Button>
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

      {/* Danger Zone */}
      <Card className="bg-destructive/5 border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">{t.settings.dangerZone}</CardTitle>
          <CardDescription>{t.settings.irreversibleActions}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t.settings.exportAllData}</p>
              <p className="text-sm text-muted-foreground">{t.settings.exportDataDesc}</p>
            </div>
            <Button variant="outline" size="sm">{t.common.export}</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">{t.settings.deleteAccount}</p>
              <p className="text-sm text-muted-foreground">{t.settings.deleteAccountDesc}</p>
            </div>
            <Button variant="destructive" size="sm">{t.common.delete}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
