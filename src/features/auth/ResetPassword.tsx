import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart } from 'lucide-react';
import { supabase } from '@/config/supabase';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { toast } from 'sonner';
import { translateAuthError } from '@/shared/lib/validation';
import { PublicFooter } from '@/shared/components/layout/PublicFooter';
import { useLanguage } from '@/shared/lib/i18n/LanguageContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const c = {
    ES: { title: 'Nueva contraseña', sub: 'Ingresá una nueva contraseña para tu cuenta.', label: 'Nueva contraseña', confirm: 'Confirmar contraseña', mismatch: 'Las contraseñas no coinciden', save: 'Guardar nueva contraseña', success: 'Contraseña actualizada. Ya podés iniciar sesión.', back: 'Volver' },
    EN: { title: 'New password', sub: 'Enter a new password for your account.', label: 'New password', confirm: 'Confirm password', mismatch: 'Passwords do not match', save: 'Save new password', success: 'Password updated. You can sign in now.', back: 'Back' },
    PT: { title: 'Nova senha', sub: 'Insira uma nova senha para sua conta.', label: 'Nova senha', confirm: 'Confirmar senha', mismatch: 'As senhas não coincidem', save: 'Salvar nova senha', success: 'Senha atualizada. Faça login.', back: 'Voltar' },
  }[language];

  useEffect(() => {
    // Supabase parses the recovery token from the URL hash automatically and emits PASSWORD_RECOVERY
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setReady(true);
    });
    // Si no hay hash de recovery dejamos pasar igual: el form fallará si no hay sesión
    setTimeout(() => setReady(true), 800);
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const pwd = String(fd.get('password') ?? '');
    const conf = String(fd.get('confirm') ?? '');
    if (pwd.length < 6) return setError('Mínimo 6 caracteres');
    if (pwd !== conf) return setError(c.mismatch);
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setLoading(false);
    if (error) {
      toast.error(translateAuthError(error.message));
      return;
    }
    toast.success(c.success);
    navigate('/auth', { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary">
                <LineChart className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle>{c.title}</CardTitle>
            <CardDescription>{c.sub}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rp-password">{c.label}</Label>
                <Input id="rp-password" name="password" type="password" minLength={6} required disabled={!ready} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rp-confirm">{c.confirm}</Label>
                <Input id="rp-confirm" name="confirm" type="password" minLength={6} required disabled={!ready} />
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading || !ready}>
                {loading ? '…' : c.save}
              </Button>
              <Link to="/auth" className="block text-center text-xs text-muted-foreground hover:text-foreground">
                {c.back}
              </Link>
            </form>
          </CardContent>
        </Card>
      </main>
      <PublicFooter />
    </div>
  );
}

