
import { createClient } from '@supabase/supabase-js';

/**
 * CONFIGURACIÓN DE SUPABASE
 * Proyecto: wyypcmkonemfmjzezwoo
 */
const SUPABASE_URL = 'https://wyypcmkonemfmjzezwoo.supabase.co';

// Clave proporcionada por el usuario
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5eXBjbWtvbmVtZm1qemV6d29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2ODk4NjUsImV4cCI6MjA4NjI2NTg2NX0.UmLl77Z7jFT2TA304uce_yqy1d6V3aEtGpFT20Puv0s'; 

export const isConfigured = () => {
  return SUPABASE_URL && !SUPABASE_URL.includes('your-project') && SUPABASE_ANON_KEY.startsWith('eyJ');
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
