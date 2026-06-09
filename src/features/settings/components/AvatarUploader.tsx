import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Camera, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/features/auth/hooks/AuthContext';

interface AvatarUploaderProps {
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarUploader({ size = 'lg' }: AvatarUploaderProps) {
  const { user, profile, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const sizeClass = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  }[size];

  const initials =
    profile?.full_name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'T';

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validación estricta: allowlist de MIME y extensión (sin SVG por riesgo XSS)
    const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_MIME.includes(file.type) || !ALLOWED_EXT.includes(ext)) {
      toast.error('Formato no permitido. Usá PNG, JPG, WEBP o GIF.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no puede superar 2MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Subir al bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true, cacheControl: '3600' });

      if (uploadError) throw uploadError;

      // Obtener URL pública con cache-bust
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      const urlWithBust = `${publicUrl}?t=${Date.now()}`;

      // Actualizar profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlWithBust })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshProfile?.();
      toast.success('Foto de perfil actualizada');
    } catch (err) {
      console.error('Avatar upload error:', err);
      toast.error('Error al subir la foto');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    if (!user) return;
    setUploading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);
      if (error) throw error;
      await refreshProfile?.();
      toast.success('Foto eliminada');
    } catch (err) {
      console.error('Avatar remove error:', err);
      toast.error('Error al eliminar la foto');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <Avatar className={`${sizeClass} border-2 border-border ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-all`}>
          <AvatarImage src={profile?.avatar_url || undefined} alt="Foto de perfil" />
          <AvatarFallback className="bg-muted text-muted-foreground text-xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          aria-label="Cambiar foto de perfil"
          className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-wait"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <Camera className="h-6 w-6 text-primary" />
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-2"
        >
          <Camera className="h-3.5 w-3.5" />
          {profile?.avatar_url ? 'Cambiar foto' : 'Subir foto'}
        </Button>
        {profile?.avatar_url && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleRemove}
            disabled={uploading}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        PNG, JPG o WEBP · máx. 2MB
      </p>
    </div>
  );
}

