
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';
import { supabase } from '../lib/supabase';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';

interface ChatProps {
  navigateTo: (view: AppView) => void;
}

const Chat: React.FC<ChatProps> = ({ navigateTo }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data);
    setLoading(false);
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const msgContent = newMessage;
    setNewMessage('');

    await supabase.from('messages').insert([{
      sender_id: user.id,
      receiver_id: user.id, // En este prototipo enviamos a nosotros mismos o global
      content: msgContent
    }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-in slide-in-from-right duration-300">
      <div className="p-4 bg-white border-b border-slate-100 flex items-center gap-3 shadow-sm">
        <button onClick={() => navigateTo(AppView.DASHBOARD)} className="text-slate-400"><ArrowLeft /></button>
        <h3 className="font-bold text-slate-800">Chat Global QuestNet</h3>
        <div className="ml-auto flex items-center gap-1.5">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-bold text-green-600">LIVE</span>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" /></div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender_id === messages[0]?.sender_id ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                 msg.sender_id === messages[0]?.sender_id ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none'
               }`}>
                 {msg.content}
               </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe un mensaje..."
          className="flex-grow bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
        />
        <button onClick={handleSend} className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg active:scale-90 transition-transform">
           <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
