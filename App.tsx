
import React, { useState, useEffect } from 'react';
import { AppView, User, Challenge } from './types.ts';
import BottomNav from './components/BottomNav.tsx';
import Dashboard from './views/Dashboard.tsx';
import Challenges from './views/Challenges.tsx';
import Profile from './views/Profile.tsx';
import Wallet from './views/Wallet.tsx';
import Auth from './views/Auth.tsx';
import EarnSurveys from './views/EarnSurveys.tsx';
import { MOCK_USER, MOCK_CHALLENGES } from './constants.tsx';
import { AuthService } from './services/authService.ts';
import { Wallet as WalletIcon, RefreshCw, Loader2 } from 'lucide-react';
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
        const sessionUser = await AuthService.getCurrentUser();
        if (sessionUser) {
          setIsAuthenticated(true);
          await fetchUserProfile(sessionUser.id, sessionUser.phone);
        }
      } catch (e) {
        console.warn("QuestNet: Usuario no autenticado.");
      } finally {
        // Forzamos el fin de la carga de sistema
        setIsInitializing(false);
        // Quitamos el loader de HTML puro para que no tape la app
        const staticLoader = document.getElementById('app-loader');
        if (staticLoader) staticLoader.remove();
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
          username: data.username || '@user',
          avatar: data.avatar || MOCK_USER.avatar,
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
      console.error("Error al obtener perfil:", e);
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
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-2xl relative font-inter animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo(AppView.DASHBOARD)}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
             <span className="text-white font-bold text-lg font-poppins">Q</span>
          </div>
          <h1 className="text-xl font-bold font-poppins text-slate-800 tracking-tight">QuestNet</h1>
        </div>
        <div className="flex items-center gap-3">
          {isSyncing && <RefreshCw size={12} className="text-blue-600 animate-spin" />}
          <button onClick={() => navigateTo(AppView.WALLET)} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100 flex items-center">
            <WalletIcon size={14} className="mr-1" />
            S/ {user.walletBalance.toFixed(2)}
          </button>
        </div>
      </header>

      <main className="flex-grow pb-24 overflow-x-hidden">
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
