
import React from 'react';
import { AppView, User, Challenge } from '../types';
import { Trophy, Flame, Target, ChevronRight, Play, Star } from 'lucide-react';
import AdsContainer from '../components/AdsContainer';

interface DashboardProps {
  user: User;
  navigateTo: (view: AppView) => void;
  availableChallenges: Challenge[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, navigateTo, availableChallenges }) => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Saludo y Resumen */}
      <div className="p-6 bg-slate-900 text-white rounded-b-[2.5rem] shadow-xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-poppins">Hola, {user.name.split(' ')[0]} 👋</h2>
            <p className="text-slate-400 text-xs">Tienes {availableChallenges.length} retos pendientes.</p>
          </div>
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-blue-500">
            <img src={user.avatar} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 text-orange-400">
              <Flame size={18} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Racha Actual</span>
            </div>
            <p className="text-2xl font-bold">{user.streak} días</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <Target size={18} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Nivel</span>
            </div>
            <p className="text-2xl font-bold">{user.level}</p>
          </div>
        </div>
      </div>

      {/* Progreso Diario */}
      <div className="p-6 space-y-6">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Tu Progreso de Hoy</h3>
            <span className="text-xs font-bold text-blue-600">0%</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-[0%] rounded-full shadow-lg shadow-blue-200" />
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Completa retos para ganar puntos y subir de nivel.</p>
        </div>

        {/* Zona de Anuncio Dashboard - Banner 320x50 aprox */}
        <AdsContainer zoneId="dashboard_banner_id" type="banner" className="my-2" />

        {/* Retos Destacados */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-slate-800">Sugerencias para ti</h3>
            <button 
              onClick={() => navigateTo(AppView.CHALLENGES)}
              className="text-xs font-bold text-blue-600 flex items-center gap-1"
            >
              Ver todos <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {availableChallenges.length > 0 ? (
              availableChallenges.slice(0, 2).map(challenge => (
                <div 
                  key={challenge.id}
                  onClick={() => navigateTo(AppView.CHALLENGES)}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={challenge.image_url} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-sm text-slate-800">{challenge.title}</h4>
                    <div className="flex items-center gap-1 text-green-600 mt-1">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-bold">+{challenge.points_reward} pts</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <Play size={18} fill="currentColor" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 text-sm py-4">¡Has completado todos los retos!</p>
            )}
          </div>
        </div>

        {/* Publicidad Reward */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-5 text-white shadow-lg shadow-orange-100 relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-lg leading-tight">Gana Puntos Gratis</h4>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">Mira un video patrocinado</p>
            </div>
            <button 
              onClick={() => navigateTo(AppView.WALLET)}
              className="bg-white text-orange-600 text-xs font-bold px-4 py-2 rounded-xl shadow-md active:scale-95 transition-all"
            >
              Ver Ahora
            </button>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
