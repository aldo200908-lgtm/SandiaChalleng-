
import React, { useState } from 'react';
import { User, AppView } from '../types.ts';
import { Settings, Award, History, Users, Flame, ChevronRight, Share2, Phone, Check, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase.ts';

interface ProfileProps {
  user: User;
  navigateTo: (view: AppView) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, navigateTo }) => {
  const [isEditingPayments, setIsEditingPayments] = useState(false);
  const [yape, setYape] = useState(user.yape_number || '');
  const [plin, setPlin] = useState(user.plin_number || '');
  const [loading, setLoading] = useState(false);

  const achievements = [
    { name: 'Madrugador', icon: '🌅', color: 'bg-amber-100' },
    { name: '10km Club', icon: '🏃', color: 'bg-blue-100' },
    { name: 'Influencer', icon: '📸', color: 'bg-purple-100' },
    { name: 'Veterano', icon: '🎖️', color: 'bg-green-100' },
  ];

  const savePaymentMethods = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          yape_number: yape, 
          plin_number: plin 
        })
        .eq('id', user.id);
      
      if (error) throw error;
      setIsEditingPayments(false);
      // En una app real recargaríamos el estado global del usuario aquí
    } catch (err) {
      alert("Error al guardar números");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="p-6 pb-20 bg-slate-900 text-white relative">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
             <h2 className="text-2xl font-bold font-poppins">{user.name}</h2>
             <p className="text-slate-400 text-sm">{user.username}</p>
          </div>
          <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
             <Settings size={20} />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
             <img src={user.avatar} className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl object-cover" />
             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 px-3 py-1 rounded-full text-[10px] font-bold border-2 border-slate-900 whitespace-nowrap shadow-lg">
                NIVEL {user.level}
             </div>
          </div>
          <div className="flex flex-col gap-3 flex-grow">
            <div className="flex justify-between items-end">
               <span className="text-xs font-bold text-slate-400 uppercase">Progreso Nivel</span>
               <span className="text-xs font-bold text-blue-400">{user.exp} / 1000 XP</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
               <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${(user.exp / 1000) * 100}%` }} />
            </div>
            <div className="flex gap-4">
               <div className="flex flex-col">
                  <span className="text-lg font-bold">128</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Seguidores</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-lg font-bold">45</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Retos</span>
               </div>
            </div>
          </div>
        </div>

        {/* Stats Cards overlap */}
        <div className="absolute -bottom-10 left-4 right-4 grid grid-cols-2 gap-3">
           <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                 <Flame size={20} />
              </div>
              <div>
                 <p className="text-slate-400 text-[10px] font-bold uppercase">Racha</p>
                 <p className="text-slate-800 font-bold text-lg leading-none">{user.streak} días</p>
              </div>
           </div>
           <div 
             onClick={() => navigateTo(AppView.WALLET)}
             className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3 cursor-pointer active:scale-95 transition-transform"
           >
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shadow-sm">
                 <Award size={20} />
              </div>
              <div>
                 <p className="text-slate-400 text-[10px] font-bold uppercase">Puntos</p>
                 <p className="text-slate-800 font-bold text-lg leading-none">{user.points.toLocaleString()}</p>
              </div>
           </div>
        </div>
      </div>

      <div className="px-4 pt-16 space-y-6 pb-24">
        {/* Metodos de Pago Peruanos */}
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               <Phone size={18} className="text-blue-600" />
               Cobros (Perú)
            </h3>
            <button 
              onClick={() => isEditingPayments ? savePaymentMethods() : setIsEditingPayments(true)}
              className="text-xs font-black text-blue-600 uppercase flex items-center gap-1"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : (isEditingPayments ? <><Save size={14} /> Guardar</> : 'Editar')}
            </button>
          </div>

          <div className="space-y-3">
            {/* Yape Row */}
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-[#742484] rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm">
                 Y
              </div>
              <div className="flex-grow">
                <p className="text-[10px] font-bold text-[#742484] uppercase tracking-widest">Yape</p>
                {isEditingPayments ? (
                  <input 
                    type="tel" 
                    value={yape}
                    onChange={(e) => setYape(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    className="w-full bg-white border border-purple-100 rounded-lg px-2 py-1 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-purple-200"
                    placeholder="999 999 999"
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-800">{user.yape_number || 'No vinculado'}</p>
                )}
              </div>
              {user.yape_number && !isEditingPayments && <Check size={16} className="text-green-500" />}
            </div>

            {/* Plin Row */}
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-[#00d1ff] rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm">
                 P
              </div>
              <div className="flex-grow">
                <p className="text-[10px] font-bold text-[#00a3cc] uppercase tracking-widest">Plin</p>
                {isEditingPayments ? (
                  <input 
                    type="tel" 
                    value={plin}
                    onChange={(e) => setPlin(e.target.value.replace(/\D/g, '').slice(0, 9))}
                    className="w-full bg-white border border-cyan-100 rounded-lg px-2 py-1 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-cyan-200"
                    placeholder="999 999 999"
                  />
                ) : (
                  <p className="text-sm font-bold text-slate-800">{user.plin_number || 'No vinculado'}</p>
                )}
              </div>
              {user.plin_number && !isEditingPayments && <Check size={16} className="text-green-500" />}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="space-y-3">
           <div className="flex justify-between items-center px-1">
              <h3 className="font-bold text-slate-800">Logros Destacados</h3>
              <button className="text-[10px] font-bold text-blue-600 uppercase">Ver todos</button>
           </div>
           <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth">
              {achievements.map((a, i) => (
                <div key={i} className="flex flex-col items-center gap-2 min-w-[80px]">
                   <div className={`${a.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-white`}>
                      {a.icon}
                   </div>
                   <span className="text-[10px] font-bold text-slate-600 text-center">{a.name}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Menu Options */}
        <div className="space-y-2 pb-10">
           {[
             { label: 'Historial de Retos', icon: History, action: () => {} },
             { label: 'Gestionar Wallet', icon: Award, action: () => navigateTo(AppView.WALLET) },
             { label: 'Invitar Amigos', icon: Users, action: () => {} },
             { label: 'Compartir Perfil', icon: Share2, action: () => {} },
           ].map((item, i) => (
             <button 
               key={i}
               onClick={item.action}
               className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 active:bg-slate-50 transition-all shadow-sm"
             >
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500">
                      <item.icon size={18} />
                   </div>
                   <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
             </button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
