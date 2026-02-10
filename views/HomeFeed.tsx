
import React, { useEffect, useState } from 'react';
import { AppView } from '../types';
import { supabase } from '../lib/supabase';
import { Heart, MessageCircle, Share2, MoreHorizontal, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import AdsContainer from '../components/AdsContainer';

interface HomeFeedProps {
  navigateTo: (view: AppView) => void;
}

const HomeFeed: React.FC<HomeFeedProps> = ({ navigateTo }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('public:challenge_proofs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenge_proofs' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('challenge_proofs')
      .select(`
        id, photo_url, description, created_at, status,
        users_profile:user_id (username, photo_url),
        challenges:challenge_id (title)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (data) setPosts(data);
    setLoading(false);
  };

  if (loading) return (
    <div className="space-y-8 px-4 py-6">
      {[1, 2].map(i => (
        <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm animate-pulse">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100" />
            <div className="space-y-2">
              <div className="h-3 w-24 bg-slate-100 rounded" />
              <div className="h-2 w-16 bg-slate-50 rounded" />
            </div>
          </div>
          <div className="aspect-square bg-slate-50" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 px-4 py-6">
      {posts.length === 0 ? (
        <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center gap-4">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-200 shadow-sm border border-slate-100">
              <Sparkles size={32} />
           </div>
           <p className="text-slate-500 font-bold">Aún no hay aventuras</p>
           <button 
             onClick={() => navigateTo(AppView.CHALLENGES)} 
             className="bg-blue-600 text-white text-xs font-bold px-6 py-3 rounded-2xl shadow-lg active:scale-95 transition-all"
           >
             Empezar a Explorar
           </button>
        </div>
      ) : (
        posts.map((post, index) => (
          <React.Fragment key={post.id}>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm animate-in fade-in duration-300">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={post.users_profile?.photo_url} className="w-10 h-10 rounded-full border border-slate-100 object-cover shadow-sm" alt="Avatar" />
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-none">@{post.users_profile?.username}</p>
                    <p className="text-[10px] text-blue-600 mt-1 font-bold">Completó: {post.challenges?.title}</p>
                  </div>
                </div>
                <MoreHorizontal size={20} className="text-slate-300" />
              </div>
              
              <div className="aspect-square bg-slate-100 relative group">
                <img src={post.photo_url} className="w-full h-full object-cover" alt="Post" />
              </div>

              <div className="p-5">
                <div className="flex gap-4 mb-4">
                  <Heart size={24} className="text-slate-400" />
                  <MessageCircle size={24} className="text-slate-400" />
                  <Share2 size={24} className="text-slate-400 ml-auto" />
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  <span className="font-bold mr-2 text-slate-900">@{post.users_profile?.username}</span>
                  {post.description}
                </p>
              </div>
            </div>

            {/* Anuncio intercalado cada 2 posts */}
            {index % 2 === 1 && (
              <AdsContainer zoneId="feed_native_ad_id" type="native" className="bg-white rounded-[2.5rem] border border-slate-100 p-2" />
            )}
          </React.Fragment>
        ))
      )}
    </div>
  );
};

export default HomeFeed;
