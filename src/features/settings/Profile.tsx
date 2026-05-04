import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { AvatarUploader } from '@/features/settings/components/AvatarUploader';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { supabase } from '@/config/supabase';
import { toast } from 'sonner';
import { Save, User } from 'lucide-react';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name || '');
  }, [profile?.full_name]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() || null })
        .eq('id', user.id);
      if (error) throw error;
      await refreshProfile?.();
      toast.success('Perfil actualizado');
    } catch (err) {
      console.error(err);
      toast.error('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Mi Perfil
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gestiona tu información personal y foto de perfil.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Foto de perfil</CardTitle>
          <CardDescription>
            Esta imagen se mostrará en tu cuenta y en las funciones colaborativas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <AvatarUploader size="lg" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información personal</CardTitle>
          <CardDescription>
            Tu nombre se usa en saludos y notificaciones.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre"
              maxLength={80}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile?.email || user?.email || ''}
              disabled
              readOnly
            />
            <p className="text-xs text-muted-foreground">
              El email no se puede modificar desde aquí.
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={saving || fullName === (profile?.full_name || '')}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


