
import React, { useState } from 'react';
import { Challenge, ChallengeCategory } from '../types';
import { MapPin, Camera, Zap, Calendar, Search } from 'lucide-react';

interface ChallengesProps {
  onSelectChallenge: (challenge: Challenge) => void;
  availableChallenges: Challenge[];
}

const Challenges: React.FC<ChallengesProps> = ({ onSelectChallenge, availableChallenges }) => {
  const [filter, setFilter] = useState<ChallengeCategory | 'All'>('All');
  
  const categories = [
    { id: 'All', label: 'Todos', icon: Search },
    { id: 'Physical', label: 'Reales', icon: MapPin },
    { id: 'Creative', label: 'Creativos', icon: Camera },
    { id: 'Virtual', label: 'Virtuales', icon: Zap },
    { id: 'Daily', label: 'Diarios', icon: Calendar },
  ];

  const filteredChallenges = filter === 'All' 
    ? availableChallenges 
    : availableChallenges.filter(c => c.category === filter);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold font-poppins text-slate-800">Próximos Retos</h2>
        <p className="text-sm text-slate-500">Completa actividades y gana recompensas reales.</p>
      </div>

      {/* Horizontal Category Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = filter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all shadow-sm border ${
                isActive 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-slate-600 border-slate-100 hover:border-blue-100'
              }`}
            >
              <Icon size={16} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Challenges List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <div 
              key={challenge.id}
              className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              onClick={() => onSelectChallenge(challenge)}
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img src={challenge.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={challenge.title} />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {challenge.category}
                  </span>
                  {challenge.requires_gps && (
                     <span className="bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <MapPin size={10} /> GPS
                     </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800">{challenge.title}</h3>
                  <div className="flex flex-col items-end">
                    <span className="text-green-600 font-bold text-lg leading-none">+{challenge.points_reward}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Puntos</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {challenge.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                     <img src="https://picsum.photos/seed/u1/40" className="w-6 h-6 rounded-full border-2 border-white" />
                     <img src="https://picsum.photos/seed/u2/40" className="w-6 h-6 rounded-full border-2 border-white" />
                     <img src="https://picsum.photos/seed/u3/40" className="w-6 h-6 rounded-full border-2 border-white" />
                  </div>
                  <button className="bg-blue-50 text-blue-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                    Aceptar Reto
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <p className="text-slate-400 font-bold">No hay más retos disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;
