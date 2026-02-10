
import React, { useState, useEffect } from 'react';
import { AppView, User, Challenge } from './types';
import BottomNav from './components/BottomNav';
import Dashboard from './views/Dashboard';
import Challenges from './views/Challenges';
import UploadProof from './views/UploadProof';
import Profile from './views/Profile';
import Wallet from './views/Wallet';
import AdminPanel from './views/AdminPanel';
import Chat from './views/Chat';
import Auth from './views/Auth';
import EarnSurveys from './views/EarnSurveys';
import { MOCK_USER, MOCK_CHALLENGES } from './constants';
import { AuthService } from './services/authService';
import { Wallet as WalletIcon, RefreshCw, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabaseClient';

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [user, setUser] = useState<User>(MOCK_USER);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsAuthenticated(true);
        fetchUserProfile(session.user.id, session.user.phone);
      } else {
        setIsAuthenticated(false);
      }
      setIsInitializing(false);
    });

    AuthService.getCurrentUser().then(sessionUser => {
      if (sessionUser) {
        setIsAuthenticated(true);
        fetchUserProfile(sessionUser.id, sessionUser.phone);
      }
      setTimeout(() => setIsInitializing(false), 1000);
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user.id) return;
    const profileChannel = supabase
      .channel(`profile-realtime-${user.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
        (payload) => {
          setUser(prev => ({
            ...prev,
            points: payload.new.points ?? prev.points,
            walletBalance: Number(payload.new.wallet_balance) ?? prev.walletBalance,
            exp: payload.new.exp ?? prev.exp,
            level: payload.new.level ?? prev.level,
          }));
          setIsSyncing(true);
          setTimeout(() => setIsSyncing(false), 2000);
        }
      ).subscribe();
    return () => { supabase.removeChannel(profileChannel); };
  }, [isAuthenticated, user.id]);

  const fetchUserProfile = async (id: string, phone?: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (data && !error) {
      setUser({
        id: data.id,
        name: data.name || 'Usuario',
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
  };

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isInitializing) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Cargando QuestNet</p>
    </div>
  );

  if (!isAuthenticated) return <Auth onLogin={() => setIsAuthenticated(true)} />;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-2xl relative font-inter">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2" onClick={() => navigateTo(AppView.DASHBOARD)}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
             <span className="text-white font-bold text-lg font-poppins">Q</span>
          </div>
          <h1 className="text-xl font-bold font-poppins text-slate-800 tracking-tight">QuestNet</h1>
        </div>
        <div className="flex items-center gap-3">
          {isSyncing && <RefreshCw size={12} className="text-blue-600 animate-spin" />}
          <button onClick={() => navigateTo(AppView.WALLET)} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100">
            <WalletIcon size={14} className="inline mr-1" />
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
