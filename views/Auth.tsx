
import React, { useState, useEffect } from 'react';
import { Phone, ArrowRight, Globe, Loader2, Info, KeyRound, ChevronLeft, AlertTriangle } from 'lucide-react';
import { enviarOTP, verificarOTP } from '../services/authService';
import { isConfigured } from '../lib/supabaseClient';
import { User as AppUser } from '../types';

interface AuthProps {
  onLogin: (userData?: Partial<AppUser>) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('927595715'); // Tu número pre-configurado
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [configMissing, setConfigMissing] = useState(false);

  // Detectar si es el número de prueba configurado por el usuario
  const isTestNumber = phone === '927595715';

  useEffect(() => {
    if (!isConfigured()) {
      setConfigMissing(true);
      setErrorMsg("Configuración requerida: Verifica la URL en lib/supabaseClient.ts");
    }
  }, []);

  const getFullPhone = () => {
    // Supabase Auth requiere el formato internacional con + para la API
    return phone.startsWith('+') ? phone : `+51${phone}`;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (configMissing) return;

    setLoading(true);
    setErrorMsg(null);
    
    try {
      await enviarOTP(getFullPhone());
      setStep('otp');
    } catch (error: any) {
      console.warn("OTP Send failed, might be using test number mode:", error.message);
      
      if (isTestNumber) {
        // Si falla el envío real pero es el número que configuraste en el dashboard, 
        // pasamos al siguiente paso igual para que pongas el código 123456
        setStep('otp');
        setErrorMsg('Modo Prueba detectado. Usa el código 123456.');
      } else {
        setErrorMsg('Error: No se pudo enviar el SMS. ¿Configuraste este número como "Test Number" en Supabase?');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    try {
      const user = await verificarOTP(getFullPhone(), otp);
      if (user) {
        onLogin({ id: user.id, phone: user.phone });
      }
    } catch (error: any) {
      setErrorMsg('Código incorrecto. Recuerda usar 123456 para el número de prueba.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-6 relative overflow-hidden font-inter">
      {/* Luces de fondo */}
      <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full rotate-12 pointer-events-none" />
      
      <div className="relative z-10 pt-10 text-center space-y-2">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl mx-auto flex items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.3)] mb-4 animate-in zoom-in duration-700">
          <span className="text-white text-4xl font-black font-poppins">Q</span>
        </div>
        <h1 className="text-3xl font-black text-white font-poppins tracking-tighter">QuestNet</h1>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
          <Globe size={14} className="text-blue-400" />
          <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Perú • Beta</p>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto space-y-6">
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-8 rounded-[3rem] shadow-2xl space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {step === 'phone' ? 'Bienvenido' : 'Verificar'}
            </h2>
            <p className="text-slate-400 text-xs">
              {step === 'phone' ? 'Accede a tus retos con tu celular' : `Ingresa el código para el 927 595 715`}
            </p>
          </div>

          {errorMsg && (
            <div className={`p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2 bg-amber-500/10 border border-amber-500/20`}>
               <AlertTriangle size={18} className="text-amber-400 shrink-0" />
               <p className="text-[10px] text-amber-200 font-bold leading-tight">{errorMsg}</p>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm border-r border-white/10 pr-3">+51</div>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder="999 999 999"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-20 pr-4 text-white text-lg font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl shadow-blue-900/20"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <> Entrar <ArrowRight size={16} /> </>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="------"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-center text-2xl font-black tracking-[0.4em] outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verificar Ahora'}
              </button>
              <button 
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2"
              >
                Cambiar número
              </button>
            </form>
          )}
        </div>

        <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 flex gap-3 items-center">
           <Info className="text-blue-500 shrink-0" size={18} />
           <p className="text-[10px] text-blue-200/70 leading-relaxed italic">
              Configura en Supabase: <b>51927595715=123456</b> para entrar sin costo.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
