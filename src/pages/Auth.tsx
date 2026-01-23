import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, TrendingUp, Brain, Shield, BarChart3 } from 'lucide-react';
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
      toast.error('Sign in failed', { description: error.message });
    } else {
      toast.success('Welcome back!');
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
      toast.error('Sign up failed', { description: error.message });
    } else {
      toast.success('Account created!', { description: 'Welcome to Analítica!' });
    }

    setIsLoading(false);
  };

  const features = [
    { icon: BarChart3, title: 'Advanced Analytics', description: 'Deep insights into your trading performance' },
    { icon: Brain, title: 'AI-Powered Insights', description: 'Machine learning detects patterns and edges' },
    { icon: TrendingUp, title: 'Equity Tracking', description: 'Visualize your growth over time' },
    { icon: Shield, title: 'Psychology Tracking', description: 'Master your trading mindset' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-primary/10 via-background to-background p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-primary shadow-glow">
            <Zap className="h-7 w-7 text-primary-foreground" />
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
              Trade smarter with <span className="gradient-text">AI-powered</span> insights
            </h2>
            <p className="text-muted-foreground">
              Join thousands of traders who use Analítica to track, analyze, and improve their trading performance.
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
            <p className="text-3xl font-bold">10K+</p>
            <p className="text-sm text-muted-foreground">Active traders</p>
          </div>
          <div>
            <p className="text-3xl font-bold">2M+</p>
            <p className="text-sm text-muted-foreground">Trades analyzed</p>
          </div>
          <div>
            <p className="text-3xl font-bold">94%</p>
            <p className="text-sm text-muted-foreground">User satisfaction</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md border-border/50 shadow-elevated">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center mb-4 lg:hidden">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-primary">
                <Zap className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome to Analítica</CardTitle>
            <CardDescription>Sign in to access your trading journal</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="trader@example.com"
                      required
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="bg-muted/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    variant="glow"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="John Trader"
                      required
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="trader@example.com"
                      required
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      minLength={6}
                      required
                      className="bg-muted/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    variant="glow"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    By signing up, you agree to our Terms of Service and Privacy Policy
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
