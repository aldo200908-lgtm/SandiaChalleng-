
import React, { useState, useEffect } from 'react';
import { User, RewardHistory } from '../types.ts';
import { History, Loader2, CheckCircle2, RefreshCw, ShieldCheck, AlertCircle, Smartphone, Info, ExternalLink, Globe } from 'lucide-react';
import { supabase } from '../lib/supabaseClient.ts';

interface EarnSurveysProps {
  user: User;
}

const EarnSurveys: React.FC<EarnSurveysProps> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<RewardHistory[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [secureHash, setSecureHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);

  const APP_ID = "31360";

  const initializeCPX = async (forceMock = false) => {
    try {
      setLoading(true);
      setError(null);
      setIsMock(forceMock);

      if (forceMock) {
        setSecureHash("mock_hash_for_preview");
        setLoading(false);
        return;
      }
      
      const { data, error: invokeError } = await supabase.functions.invoke('cpx-hash', {
        body: { userId: user.id }
      });

      if (invokeError) {
        if (invokeError.message?.includes('Failed') || invokeError.name === 'TypeError') {
          throw new Error("LA_FUNCION_NO_ESTA_DESPLEGADA");
        }
        throw new Error(invokeError.message || "Error en el servidor de seguridad");
      }

      if (data?.error) throw new Error(data.error);
      if (!data?.secureHash) throw new Error("No se pudo generar el código de seguridad.");
      
      setSecureHash(data.secureHash);
      await fetchHistory();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) initializeCPX();
  }, [user.id]);

  const fetchHistory = async () => {
    setIsRefreshing(true);
    try {
      const { data } = await supabase
        .from('reward_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setHistory(data);
    } catch (e) { console.error(e); } 
    finally { setIsRefreshing(false); }
  };

  const getCpxUrl = () => {
    if (!secureHash) return '';
    const params = new URLSearchParams({
      app_id: APP_ID,
      ext_user_id: user.id,
      secure_hash: secureHash,
      username: user.username || '',
      style: '1'
    });
    return `https://offers.cpx-research.com/index.php?${params.toString()}`;
  };

  const openExternal = () => {
    const url = getCpxUrl();
    if (url) window.open(url, '_blank');
  };

  if (error === "LA_FUNCION_NO_ESTA_DESPLEGADA") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center bg-white">
        <div className="w-20 h-20 bg-slate-900 text-blue-400 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-2xl">
          <Smartphone size={32} />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Paso Final Pendiente</h3>
        <p className="text-xs text-slate-500 mb-8 max-w-xs">
          Debes desplegar la función <b>cpx-hash</b> en tu panel de Supabase para que las encuestas carguen.
        </p>
        <div className="w-full space-y-3 max-w-xs">
          <button onClick={() => initializeCPX()} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all">REINTENTAR</button>
          <button onClick={() => initializeCPX(true)} className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Simular Vista</button>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center bg-white">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mb-6 border border-red-100">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Error de Hash</h3>
        <div className="bg-red-50 p-4 rounded-2xl mb-8 w-full max-w-xs overflow-hidden">
           <p className="text-[10px] text-red-600 font-mono break-words">{error}</p>
        </div>
        <button onClick={() => initializeCPX()} className="w-full max-w-xs bg-slate-900 text-white py-4 rounded-2xl font-black text-xs shadow-xl transition-all">REINTENTAR CONFIGURACIÓN</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24">
      <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
        <div>
           <h2 className="text-2xl font-black text-slate-800 leading-none">Gana Dinero</h2>
           <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Encuestas Pagadas</p>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full">
          <ShieldCheck size={14} className="text-blue-500" />
          <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Seguro</span>
        </div>
      </div>

      {isMock && (
        <div className="bg-amber-500 text-white px-4 py-2 text-[9px] font-black uppercase text-center tracking-[0.2em]">
          ⚠️ Modo Simulación Activo (Las encuestas no pagarán saldo real)
        </div>
      )}

      <div className="flex-grow bg-slate-50 relative min-h-[450px]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-20">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Validando Seguridad...</p>
          </div>
        )}
        
        {secureHash ? (
          <div className="flex flex-col h-full">
            <div className="p-4 bg-blue-600 flex justify-between items-center text-white">
                <span className="text-[10px] font-black uppercase tracking-wider">¿No carga la lista?</span>
                <button 
                  onClick={openExternal}
                  className="bg-white text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                >
                  <ExternalLink size={12} /> ABRIR EN NAVEGADOR
                </button>
            </div>
            <iframe 
              src={getCpxUrl()} 
              className="w-full h-[600px] border-none bg-white" 
              onLoad={() => setLoading(false)} 
              title="Portal CPX"
            />
          </div>
        ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center h-[400px] p-8 text-center">
              <Globe size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Conectando con el servidor...</p>
              <button onClick={() => initializeCPX()} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-xs">RECARGAR PORTAL</button>
            </div>
          )
        )}
      </div>

      <div className="p-6 bg-slate-50 border-y border-slate-100">
         <div className="flex gap-4 items-start">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600">
               <Info size={20} />
            </div>
            <div>
               <h4 className="text-sm font-bold text-slate-800">¿Ves la pantalla en blanco?</h4>
               <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                 CPX Research a veces bloquea la carga dentro de apps móviles. Si esto sucede, usa el botón azul de arriba para abrir las encuestas en Chrome o Safari.
               </p>
            </div>
         </div>
      </div>

      <div className="p-6 space-y-4 bg-white">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <History size={18} className="text-blue-600"/> Historial de Cobros
        </h3>
        {history.length > 0 ? history.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-100 shadow-sm">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                   <CheckCircle2 size={20} />
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-800">S/ {Number(item.reward_amount).toFixed(2)} Ganados</p>
                   <p className="text-[9px] text-slate-400 uppercase font-bold">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
             </div>
             <span className="bg-green-100 text-green-700 text-[8px] font-black px-2 py-1 rounded-lg uppercase">Pagado</span>
          </div>
        )) : (
          <div className="text-center py-10 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Aún no has completado encuestas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarnSurveys;
