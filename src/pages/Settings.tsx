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
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  power: boolean | string;
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Get started with basic trading journal',
    icon: Zap,
    features: ['50 trades/month', 'Basic analytics', 'Psychology tracking', '7-day data retention'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    description: 'Advanced features for serious traders',
    icon: Crown,
    popular: true,
    features: ['Unlimited trades', 'AI insights', 'Advanced analytics', 'Export reports', 'Multiple accounts', 'Priority support'],
  },
  {
    id: 'power',
    name: 'Power',
    price: 79,
    description: 'Full suite for professional traders',
    icon: Rocket,
    features: ['Everything in Pro', 'Backtesting module', 'API access', 'Custom integrations', 'Dedicated support', 'White-label option'],
  },
];

export default function Settings() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile
          </CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                defaultValue={profile?.full_name || ''}
                placeholder="Your name"
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                defaultValue={profile?.email || ''}
                disabled
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
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
              <Label>Currency</Label>
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
          <Button variant="glow">Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">AI Insights</p>
              <p className="text-sm text-muted-foreground">Get notified when new insights are available</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Trade Reminders</p>
              <p className="text-sm text-muted-foreground">Daily reminder to log your trades</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Overtrading Alerts</p>
              <p className="text-sm text-muted-foreground">Get warned when trading too frequently</p>
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
            Subscription
          </CardTitle>
          <CardDescription>Manage your plan and billing</CardDescription>
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
                    'relative p-6 rounded-xl border transition-all',
                    plan.popular
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/30',
                    isCurrentPlan && 'ring-2 ring-primary'
                  )}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
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
                    variant={isCurrentPlan ? 'outline' : plan.popular ? 'glow' : 'default'}
                    className="w-full"
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? 'Current Plan' : 'Upgrade'}
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
            Security
          </CardTitle>
          <CardDescription>Protect your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Change Password</p>
              <p className="text-sm text-muted-foreground">Update your password regularly</p>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Active Sessions</p>
              <p className="text-sm text-muted-foreground">Manage your logged in devices</p>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-destructive/5 border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Export All Data</p>
              <p className="text-sm text-muted-foreground">Download all your trades and settings</p>
            </div>
            <Button variant="outline" size="sm">Export</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
            </div>
            <Button variant="destructive" size="sm">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
