import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Brain, Shield, BarChart3, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function Auth() {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);

    if (error) {
      toast.error('Error al iniciar sesión', { description: error.message });
    } else {
      toast.success('¡Bienvenido de nuevo!');
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast.error('Error al crear cuenta', { description: error.message });
    } else {
      toast.success('¡Cuenta creada!', { description: '¡Bienvenido a Analítica!' });
    }

    setIsLoading(false);
  };

  const features = [
    { icon: BarChart3, title: 'Analítica Avanzada', description: 'Insights profundos de tu rendimiento' },
    { icon: Brain, title: 'Insights con IA', description: 'Machine learning detecta patrones' },
    { icon: TrendingUp, title: 'Curva de Equidad', description: 'Visualiza tu crecimiento' },
    { icon: Shield, title: 'Psicología Trading', description: 'Domina tu mentalidad' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-primary/5 via-background to-background p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-primary shadow-glow">
            <TrendingUp className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Analítica</h1>
            <p className="text-sm text-muted-foreground">Trading Journal & AI Analytics</p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-8 relative z-10 max-w-md">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Opera más inteligente con insights{' '}
              <span className="gradient-text">potenciados por IA</span>
            </h2>
            <p className="text-muted-foreground">
              Únete a miles de traders que usan Analítica para rastrear, analizar y mejorar su rendimiento.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
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
            <p className="text-sm text-muted-foreground">Traders activos</p>
          </div>
          <div>
            <p className="text-3xl font-bold font-mono">2M+</p>
            <p className="text-sm text-muted-foreground">Trades analizados</p>
          </div>
          <div>
            <p className="text-3xl font-bold font-mono">94%</p>
            <p className="text-sm text-muted-foreground">Satisfacción</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md border-border bg-card shadow-elevated">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center mb-4 lg:hidden">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-primary">
                <Sparkles className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Bienvenido a Analítica</CardTitle>
            <CardDescription>Inicia sesión para acceder a tu diario de trading</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Correo electrónico</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="trader@example.com"
                      required
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Contraseña</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nombre completo</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="John Trader"
                      required
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Correo electrónico</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="trader@example.com"
                      required
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Contraseña</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      minLength={6}
                      required
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Al registrarte, aceptas nuestros Términos de Servicio y Política de Privacidad
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
