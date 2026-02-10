
import React from 'react';
import { LayoutDashboard, Trophy, Wallet, User, CircleDollarSign } from 'lucide-react';
import { AppView } from '../types';

interface BottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const items = [
    { view: AppView.DASHBOARD, icon: LayoutDashboard, label: 'Inicio' },
    { view: AppView.CHALLENGES, icon: Trophy, label: 'Retos' },
    { view: AppView.EARN_SURVEYS, icon: CircleDollarSign, label: 'Gana', highlight: true },
    { view: AppView.WALLET, icon: Wallet, label: 'Wallet' },
    { view: AppView.PROFILE, icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 z-50 px-4 h-20 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.05)] pb-4 pt-2">
      {items.map((item) => {
        const isActive = currentView === item.view;
        const Icon = item.icon;

        return (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={`flex flex-col items-center justify-center space-y-1 transition-all group active:scale-90 ${item.highlight ? 'relative -mt-8' : ''}`}
          >
            <div className={`p-2.5 rounded-2xl transition-all ${
              item.highlight 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 ring-4 ring-white' 
                : isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-400 group-hover:text-blue-500'
            }`}>
              <Icon size={item.highlight ? 28 : 22} />
            </div>
            <span className={`text-[10px] font-bold transition-colors ${isActive || item.highlight ? 'text-blue-600' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
