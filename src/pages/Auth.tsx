import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Brain, Shield, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { signInSchema, signUpSchema, translateAuthError } from '@/lib/validation';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { LanguageSelector } from '@/components/LanguageSelector';
import { detectUserLanguage, toContextCode, toDbCode } from '@/lib/i18n/detector';
import { useEffect } from 'react';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path fill="#EA4335" d="M12 11v3.2h7.6c-.3 1.7-2.4 5-7.6 5-4.6 0-8.3-3.8-8.3-8.5S7.4 2.2 12 2.2c2.6 0 4.4 1.1 5.4 2.1l3-2.9C18.4.6 15.5-.5 12-.5 5.4-.5 0 4.9 0 11.5S5.4 23.5 12 23.5c6.9 0 11.5-4.8 11.5-11.6 0-.8-.1-1.4-.2-1.9H12z"/>
  </svg>
);

export default function Auth() {
  const { user, loading, signIn, signUp } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  // On mount: if no stored preference, detect from browser.
  useEffect(() => {
    if (localStorage.getItem('app-language')) return;
    detectUserLanguage().then((d) => setLanguage(toContextCode(d.language))).catch(() => {});
  }, [setLanguage]);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  const localized = {
    ES: {
      tagline: 'Trading Intelligence Platform',
      confirmPassword: 'Confirmar contraseña',
      confirmMismatch: 'Las contraseñas no coinciden',
      acceptTerms: 'Acepto los',
      termsLink: 'Términos y Condiciones',
      and: 'y la',
      privacyLink: 'Política de Privacidad',
      mustAccept: 'Debés aceptar los términos para continuar',
      forgot: '¿Olvidaste tu contraseña?',
      orContinueWith: 'o continuá con',
      googleSignIn: 'Continuar con Google',
      oauthError: 'No pudimos iniciar sesión con Google. Intentá nuevamente.',
    },
    EN: {
      tagline: 'Trading Intelligence Platform',
      confirmPassword: 'Confirm password',
      confirmMismatch: 'Passwords do not match',
      acceptTerms: 'I agree to the',
      termsLink: 'Terms and Conditions',
      and: 'and',
      privacyLink: 'Privacy Policy',
      mustAccept: 'You must accept the terms to continue',
      forgot: 'Forgot your password?',
      orContinueWith: 'or continue with',
      googleSignIn: 'Continue with Google',
      oauthError: 'Could not sign in with Google. Please try again.',
    },
    PT: {
      tagline: 'Trading Intelligence Platform',
      confirmPassword: 'Confirmar senha',
      confirmMismatch: 'As senhas não coincidem',
      acceptTerms: 'Aceito os',
      termsLink: 'Termos e Condições',
      and: 'e a',
      privacyLink: 'Política de Privacidade',
      mustAccept: 'Você deve aceitar os termos para continuar',
      forgot: 'Esqueceu sua senha?',
      orContinueWith: 'ou continue com',
      googleSignIn: 'Continuar com Google',
      oauthError: 'Não foi possível entrar com Google. Tente novamente.',
    },
  }[language];

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
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
    if (error) toast.error(translateAuthError(error.message));
    else toast.success(t.auth.welcomeBack);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);
    const password = String(formData.get('password') ?? '');
    const confirm = String(formData.get('confirmPassword') ?? '');
    const payload = {
      email: String(formData.get('email') ?? ''),
      password,
      fullName: String(formData.get('fullName') ?? ''),
    };
    const parsed = signUpSchema.safeParse(payload);
    const errs: Record<string, string> = {};
    if (!parsed.success) {
      parsed.error.issues.forEach((i) => {
        const k = i.path[0] as string;
        if (!errs[k]) errs[k] = i.message;
      });
    }
    if (password !== confirm) errs.confirmPassword = localized.confirmMismatch;
    if (!acceptTerms) errs.terms = localized.mustAccept;
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(parsed.data!.email, parsed.data!.password, parsed.data!.fullName);
    if (error) toast.error(translateAuthError(error.message));
    else {
      // Persist detected/current language onto the new profile (best-effort).
      try {
        const { data: { user: created } } = await supabase.auth.getUser();
        if (created) {
          await supabase.from('profiles').update({ language: toDbCode(language) } as any).eq('id', created.id);
        }
      } catch { /* no-op */ }
      toast.success(t.auth.accountCreated, { description: t.auth.welcomeToApp });
    }
    setIsLoading(false);
  };

  const handleGoogle = async () => {
    if (oauthLoading) return;
    setOauthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) toast.error(localized.oauthError);
    } catch {
      toast.error(localized.oauthError);
    } finally {
      setOauthLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = (document.getElementById('signin-email') as HTMLInputElement | null)?.value?.trim();
    if (!email) {
      setFieldErrors({ email: 'Email requerido' });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(translateAuthError(error.message));
    else toast.success('Te enviamos un email para restablecer tu contraseña.');
  };

  const features = [
    { icon: BarChart3, title: t.auth.features.analytics, description: t.auth.features.analyticsDesc },
    { icon: Brain, title: t.auth.features.ai, description: t.auth.features.aiDesc },
    { icon: LineChart, title: t.auth.features.equity, description: t.auth.features.equityDesc },
    { icon: Shield, title: t.auth.features.psychology, description: t.auth.features.psychologyDesc },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex">
        {/* Branding */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-background p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/2 rounded-full blur-3xl" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary">
              <LineChart className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SINGULAR dataFI</h1>
              <p className="text-sm text-muted-foreground">{localized.tagline}</p>
            </div>
          </div>

          <div className="space-y-8 relative z-10 max-w-md">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                {t.auth.headline} <span className="text-primary">{t.auth.headlineHighlight}</span>
              </h2>
              <p className="text-muted-foreground">{t.auth.subheadline}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="p-4 rounded-lg bg-card border border-border">
                  <feature.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-12 relative z-10">
            <div><p className="text-3xl font-bold font-mono">10K+</p><p className="text-sm text-muted-foreground">{t.auth.stats.activeTraders}</p></div>
            <div><p className="text-3xl font-bold font-mono">2M+</p><p className="text-sm text-muted-foreground">{t.auth.stats.analyzedTrades}</p></div>
            <div><p className="text-3xl font-bold font-mono">94%</p><p className="text-sm text-muted-foreground">{t.auth.stats.satisfaction}</p></div>
          </div>
        </div>

        {/* Form */}
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
                      <Input id="signin-email" name="email" type="email" placeholder="trader@example.com" required aria-invalid={!!fieldErrors.email} className="bg-muted/50 border-border" />
                      {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password">{t.auth.password}</Label>
                        <button type="button" onClick={handleForgotPassword} className="text-xs text-primary hover:underline">
                          {localized.forgot}
                        </button>
                      </div>
                      <Input id="signin-password" name="password" type="password" placeholder="••••••••" required aria-invalid={!!fieldErrors.password} className="bg-muted/50 border-border" />
                      {fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password}</p>}
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={isLoading}>
                      {isLoading ? t.auth.signingIn : t.auth.signIn}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">{t.auth.fullName}</Label>
                      <Input id="signup-name" name="fullName" type="text" placeholder="John Trader" required aria-invalid={!!fieldErrors.fullName} className="bg-muted/50 border-border" />
                      {fieldErrors.fullName && <p className="text-xs text-destructive">{fieldErrors.fullName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">{t.auth.email}</Label>
                      <Input id="signup-email" name="email" type="email" placeholder="trader@example.com" required aria-invalid={!!fieldErrors.email} className="bg-muted/50 border-border" />
                      {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">{t.auth.password}</Label>
                      <Input id="signup-password" name="password" type="password" placeholder="••••••••" minLength={6} required aria-invalid={!!fieldErrors.password} className="bg-muted/50 border-border" />
                      {fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">{localized.confirmPassword}</Label>
                      <Input id="signup-confirm" name="confirmPassword" type="password" placeholder="••••••••" minLength={6} required aria-invalid={!!fieldErrors.confirmPassword} className="bg-muted/50 border-border" />
                      {fieldErrors.confirmPassword && <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>}
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox id="accept-terms" checked={acceptTerms} onCheckedChange={(v) => setAcceptTerms(v === true)} aria-invalid={!!fieldErrors.terms} />
                      <Label htmlFor="accept-terms" className="text-xs leading-relaxed font-normal cursor-pointer">
                        {localized.acceptTerms}{' '}
                        <Link to="/terminos" target="_blank" className="text-primary hover:underline">{localized.termsLink}</Link>{' '}
                        {localized.and}{' '}
                        <Link to="/privacidad" target="_blank" className="text-primary hover:underline">{localized.privacyLink}</Link>.
                      </Label>
                    </div>
                    {fieldErrors.terms && <p className="text-xs text-destructive">{fieldErrors.terms}</p>}
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={isLoading}>
                      {isLoading ? t.auth.creatingAccount : t.auth.createAccount}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">{localized.orContinueWith}</span></div>
              </div>

              <Button type="button" variant="outline" className="w-full gap-2" onClick={handleGoogle} disabled={oauthLoading} aria-label={localized.googleSignIn}>
                <GoogleIcon />
                {localized.googleSignIn}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
