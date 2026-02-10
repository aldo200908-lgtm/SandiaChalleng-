
import { supabase } from '../lib/supabaseClient';

/**
 * Envía un código OTP (One-Time Password) al número de teléfono proporcionado.
 */
export const enviarOTP = async (phone: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phone,
  });
  
  if (error) {
    console.error("Error al enviar OTP:", error.message);
    throw error;
  }
  return data;
};

/**
 * Verifica el código enviado para autenticar al usuario.
 */
export const verificarOTP = async (phone: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phone,
    token: token,
    type: 'sms',
  });
  
  if (error) {
    console.error("Error al verificar OTP:", error.message);
    throw error;
  }
  return data.user;
};

export const AuthService = {
  enviarOTP,
  verificarOTP,
  
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (e) {
      return null;
    }
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
