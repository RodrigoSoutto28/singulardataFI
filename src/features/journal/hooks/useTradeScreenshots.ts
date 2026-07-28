import { useState } from 'react';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { toast } from 'sonner';

export interface TradeScreenshot {
  id: string;
  trade_id: string;
  user_id: string;
  image_url: string;
  caption: string | null;
  screenshot_type: string | null;
  created_at: string | null;
}

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const MAX_SIZE_MB = 5;

export function useTradeScreenshots() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const uploadScreenshot = async (
    tradeId: string,
    file: File,
    caption?: string,
    screenshotType = 'trade'
  ): Promise<TradeScreenshot | null> => {
    if (!user?.id) {
      toast.error('Debes iniciar sesión para subir capturas.');
      return null;
    }

    // Validate file type
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_MIME.includes(file.type) || !ALLOWED_EXT.includes(ext)) {
      toast.error('Formato no permitido. Usá PNG, JPG, WEBP o GIF.');
      return null;
    }

    // Validate file size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`La imagen no puede superar ${MAX_SIZE_MB}MB.`);
      return null;
    }

    setUploading(true);
    try {
      const timestamp = Date.now();
      const fileName = `${user.id}/${tradeId}/${timestamp}.${ext}`;

      // Upload to storage bucket
      const { error: uploadError } = await supabase.storage
        .from('trade-screenshots')
        .upload(fileName, file, { upsert: false, cacheControl: '3600' });

      if (uploadError) {
        // If bucket doesn't exist, try to insert the URL directly
        console.error('[Screenshot] Storage upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('trade-screenshots').getPublicUrl(fileName);

      // Save metadata to trade_screenshots table
      const { data, error: insertError } = await supabase
        .from('trade_screenshots')
        .insert({
          trade_id: tradeId,
          user_id: user.id,
          image_url: publicUrl,
          caption: caption ?? null,
          screenshot_type: screenshotType,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      toast.success('Captura guardada correctamente.');
      return data as TradeScreenshot;
    } catch (err) {
      console.error('[Screenshot] Upload failed:', err);
      toast.error('No se pudo guardar la captura. Verificá que el bucket "trade-screenshots" exista en Supabase.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const fetchScreenshots = async (tradeId: string): Promise<TradeScreenshot[]> => {
    if (!user?.id) return [];
    const { data, error } = await supabase
      .from('trade_screenshots')
      .select('*')
      .eq('trade_id', tradeId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Screenshot] Fetch error:', error);
      return [];
    }
    return (data ?? []) as TradeScreenshot[];
  };

  const deleteScreenshot = async (screenshotId: string, imageUrl: string): Promise<boolean> => {
    if (!user?.id) return false;
    try {
      // Extract file path from public URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/trade-screenshots/');
      if (pathParts.length > 1) {
        await supabase.storage.from('trade-screenshots').remove([pathParts[1]]);
      }

      const { error } = await supabase
        .from('trade_screenshots')
        .delete()
        .eq('id', screenshotId)
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Captura eliminada.');
      return true;
    } catch (err) {
      console.error('[Screenshot] Delete error:', err);
      toast.error('No se pudo eliminar la captura.');
      return false;
    }
  };

  return {
    uploading,
    uploadScreenshot,
    fetchScreenshots,
    deleteScreenshot,
  };
}
