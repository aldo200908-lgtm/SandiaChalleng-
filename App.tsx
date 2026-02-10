import React, { useState, useEffect } from 'react';
import { AppView, User } from './types.ts';
import BottomNav from './components/BottomNav.tsx';
import Dashboard from './views/Dashboard.tsx';
import Challenges from './views/Challenges.tsx';
import Profile from './views/Profile.tsx';
import Wallet from './views/Wallet.tsx';
import Auth from './views/Auth.tsx';
import EarnSurveys from './views/EarnSurveys.tsx';
import { MOCK_USER, MOCK_CHALLENGES } from './constants.tsx';
import { AuthService } from './services/authService.ts';
import { Wallet as WalletIcon, RefreshCw } from 'lucide-react';
import { supabase } from './lib/supabaseClient.ts';

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [user, setUser] = useState<User>(MOCK_USER);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
          await fetchUserProfile(session.user.id, session.user.phone);
        }
      } catch (e) {
        console.warn("QuestNet: Sesión no encontrada.");
      } finally {
        setIsInitializing(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
        fetchUserProfile(session.user.id, session.user.phone);
      } else {
        setIsAuthenticated(false);
      }
    });

    checkAuth();
    return () => { subscription.unsubscribe(); };
  }, []);

  const fetchUserProfile = async (id: string, phone?: string) => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (data && !error) {
        setUser({
          id: data.id,
          name: data.name || 'Explorador',
          username: data.username || `@${data.name?.toLowerCase().replace(/\s/g, '_') || 'user'}`,
          avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
          level: data.level || 1,
          exp: data.exp || 0,
          points: data.points || 0,
          walletBalance: Number(data.wallet_balance) || 0,
          streak: data.streak || 0,
          isAdmin: false,
          phone: phone || data.phone,
          yape_number: data.yape_number,
          plin_number: data.plin_number
        });
      }
    } catch (e) {
      console.error("Error al sincronizar perfil:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isInitializing) return null;

  if (!isAuthenticated) return <Auth onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-2xl relative font-inter overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo(AppView.DASHBOARD)}>
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-active:scale-90 transition-transform">
             <span className="text-white font-black text-xl font-poppins">Q</span>
          </div>
          <h1 className="text-xl font-black font-poppins text-slate-900 tracking-tighter">QuestNet</h1>
        </div>
        <div className="flex items-center gap-3">
          {isSyncing && <RefreshCw size={14} className="text-blue-600 animate-spin" />}
          <button 
            onClick={() => navigateTo(AppView.WALLET)} 
            className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold border border-slate-800 flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <WalletIcon size={14} className="text-blue-400" />
            S/ {user.walletBalance.toFixed(2)}
          </button>
        </div>
      </header>

      <main className="flex-grow pb-28">
        {(() => {
          switch (currentView) {
            case AppView.DASHBOARD: return <Dashboard user={user} navigateTo={navigateTo} availableChallenges={MOCK_CHALLENGES} />;
            case AppView.CHALLENGES: return <Challenges onSelectChallenge={() => {}} availableChallenges={MOCK_CHALLENGES} />;
            case AppView.EARN_SURVEYS: return <EarnSurveys user={user} />;
            case AppView.PROFILE: return <Profile user={user} navigateTo={navigateTo} onLogout={() => {}} />;
            case AppView.WALLET: return <Wallet user={user} navigateTo={navigateTo} />;
            default: return <Dashboard user={user} navigateTo={navigateTo} availableChallenges={MOCK_CHALLENGES} />;
          }
        })()}
      </main>

      <BottomNav currentView={currentView} onNavigate={navigateTo} />
    </div>
  );
};

export default App;