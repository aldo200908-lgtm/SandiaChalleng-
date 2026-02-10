
import React, { useState } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';

const Ranking: React.FC = () => {
  const [period, setPeriod] = useState<'Weekly' | 'Monthly' | 'AllTime'>('Weekly');

  const mockRanking = [
    { name: 'Sofia King', points: 15400, level: 18, avatar: 'https://picsum.photos/seed/sofia/100' },
    { name: 'Marcus Well', points: 14200, level: 16, avatar: 'https://picsum.photos/seed/marcus/100' },
    { name: 'Elena Frost', points: 13900, level: 17, avatar: 'https://picsum.photos/seed/elena/100' },
    { name: 'Juan Perez', points: 12500, level: 14, avatar: 'https://picsum.photos/seed/juan/100' },
    { name: 'Lucia Sun', points: 11200, level: 13, avatar: 'https://picsum.photos/seed/lucia/100' },
    { name: 'Kevin Moon', points: 10800, level: 12, avatar: 'https://picsum.photos/seed/kevin/100' },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold font-poppins text-slate-800">Salón de la Fama</h2>
        <p className="text-sm text-slate-500">Los mejores exploradores del mundo.</p>
      </div>

      {/* Period Selector */}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        {['Weekly', 'Monthly', 'AllTime'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p as any)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              period === p ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            {p === 'Weekly' ? 'Semanal' : p === 'Monthly' ? 'Mensual' : 'Global'}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 pt-8 pb-4">
        {/* 2nd */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <img src={mockRanking[1].avatar} className="w-16 h-16 rounded-full border-4 border-slate-200" />
            <div className="absolute -bottom-2 -right-1 bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">2</div>
          </div>
          <p className="text-[10px] font-bold text-slate-800">{mockRanking[1].name.split(' ')[0]}</p>
          <div className="h-16 w-16 bg-slate-100 rounded-t-lg flex items-center justify-center">
             <Medal className="text-slate-400" size={24} />
          </div>
        </div>
        
        {/* 1st */}
        <div className="flex flex-col items-center gap-2 scale-110">
          <Crown className="text-amber-400 mb-1" size={28} />
          <div className="relative">
            <img src={mockRanking[0].avatar} className="w-20 h-20 rounded-full border-4 border-amber-400 shadow-lg shadow-amber-100" />
            <div className="absolute -bottom-2 -right-1 bg-amber-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold">1</div>
          </div>
          <p className="text-[11px] font-bold text-slate-800">{mockRanking[0].name.split(' ')[0]}</p>
          <div className="h-24 w-20 bg-amber-50 rounded-t-lg flex items-center justify-center border-t-2 border-amber-100">
             <Trophy className="text-amber-500" size={32} />
          </div>
        </div>

        {/* 3rd */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <img src={mockRanking[2].avatar} className="w-16 h-16 rounded-full border-4 border-amber-700/20" />
            <div className="absolute -bottom-2 -right-1 bg-amber-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">3</div>
          </div>
          <p className="text-[10px] font-bold text-slate-800">{mockRanking[2].name.split(' ')[0]}</p>
          <div className="h-12 w-16 bg-amber-50/50 rounded-t-lg flex items-center justify-center">
             <Medal className="text-amber-700/50" size={20} />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {mockRanking.slice(3).map((user, idx) => (
          <div key={idx} className="bg-white p-3 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
            <span className="text-sm font-bold text-slate-400 w-4">{idx + 4}</span>
            <img src={user.avatar} className="w-10 h-10 rounded-full" />
            <div className="flex-grow">
              <p className="text-sm font-bold text-slate-800">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">Nivel {user.level}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-blue-600">{user.points.toLocaleString()}</p>
              <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Puntos</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;
