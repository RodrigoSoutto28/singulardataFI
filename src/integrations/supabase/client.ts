// Re-export canonical Supabase client to avoid duplicate instances.
// The single source of truth lives in @/config/supabase.
// This file is kept as an import alias for legacy paths.
export { supabase } from '@/config/supabase';