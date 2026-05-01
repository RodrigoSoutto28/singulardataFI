import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Brain, Shield, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { signInSchema, signUpSchema, translateAuthError } from '@/lib/validation';

export default function Auth() {
  const { user, loading, signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return; // prevent double submit
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    };

    const parsed = signInSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as string;
        if (!errs[k]) errs[k] = i.message;
      });
      setFieldErrors(errs);
      return;
    }

    setIsLoading(true);
    const { error } = await signIn(parsed.data.email, parsed.data.password);
    if (error) {
      // Do NOT disclose whether email or password was wrong
      toast.error(translateAuthError(error.message));
    } else {
      toast.success(t.auth.welcomeBack);
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return; // prevent double submit
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      fullName: String(formData.get('fullName') ?? ''),
    };

    const parsed = signUpSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as string;
        if (!errs[k]) errs[k] = i.message;
      });
      setFieldErrors(errs);
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(parsed.data.email, parsed.data.password, parsed.data.fullName);
    if (error) {
      toast.error(translateAuthError(error.message));
    } else {
      toast.success(t.auth.accountCreated, { description: t.auth.welcomeToApp });
    }
    setIsLoading(false);
  };

  const features = [
    { icon: BarChart3, title: t.auth.features.analytics, description: t.auth.features.analyticsDesc },
    { icon: Brain, title: t.auth.features.ai, description: t.auth.features.aiDesc },
    { icon: LineChart, title: t.auth.features.equity, description: t.auth.features.equityDesc },
    { icon: Shield, title: t.auth.features.psychology, description: t.auth.features.psychologyDesc },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-background p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle background accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/2 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary">
            <LineChart className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">SINGULAR dataFI</h1>
            <p className="text-sm text-muted-foreground">Trading Journal & AI Analytics</p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-8 relative z-10 max-w-md">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              {t.auth.headline} <span className="text-primary">{t.auth.headlineHighlight}</span>
            </h2>
            <p className="text-muted-foreground">
              {t.auth.subheadline}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-card border border-border"
              >
                <feature.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-12 relative z-10">
          <div>
            <p className="text-3xl font-bold font-mono">10K+</p>
            <p className="text-sm text-muted-foreground">{t.auth.stats.activeTraders}</p>
          </div>
          <div>
            <p className="text-3xl font-bold font-mono">2M+</p>
            <p className="text-sm text-muted-foreground">{t.auth.stats.analyzedTrades}</p>
          </div>
          <div>
            <p className="text-3xl font-bold font-mono">94%</p>
            <p className="text-sm text-muted-foreground">{t.auth.stats.satisfaction}</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center mb-4 lg:hidden">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary">
                <LineChart className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">{t.auth.welcome}</CardTitle>
            <CardDescription>{t.auth.subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">{t.auth.signIn}</TabsTrigger>
                <TabsTrigger value="signup">{t.auth.signUp}</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">{t.auth.email}</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="trader@example.com"
                      required
                      aria-invalid={!!fieldErrors.email}
                      className="bg-muted/50 border-border"
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-destructive">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">{t.auth.password}</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      aria-invalid={!!fieldErrors.password}
                      className="bg-muted/50 border-border"
                    />
                    {fieldErrors.password && (
                      <p className="text-xs text-destructive">{fieldErrors.password}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? t.auth.signingIn : t.auth.signIn}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t.auth.fullName}</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="John Trader"
                      required
                      aria-invalid={!!fieldErrors.fullName}
                      className="bg-muted/50 border-border"
                    />
                    {fieldErrors.fullName && (
                      <p className="text-xs text-destructive">{fieldErrors.fullName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t.auth.email}</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="trader@example.com"
                      required
                      aria-invalid={!!fieldErrors.email}
                      className="bg-muted/50 border-border"
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-destructive">{fieldErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t.auth.password}</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      minLength={6}
                      required
                      aria-invalid={!!fieldErrors.password}
                      className="bg-muted/50 border-border"
                    />
                    {fieldErrors.password && (
                      <p className="text-xs text-destructive">{fieldErrors.password}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? t.auth.creatingAccount : t.auth.createAccount}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    {t.auth.termsNotice}
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
