import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { ArrowLeft, Send, User, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  listing_id?: string;
}

export default function Chat() {
  const goBack = useBackNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { formatPrice } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [listing, setListing] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const listingId = location.state?.listingId;
  const sellerId = location.state?.sellerId;

  useEffect(() => {
    if (!user) return;

    // Fetch listing info
    if (listingId) {
      supabase.from('listings').select('*').eq('id', listingId).single().then(({ data }) => setListing(data));
    }

    // Fetch other user info
    const targetUserId = sellerId === user.id ? location.state?.buyerId : sellerId;
    if (targetUserId) {
      supabase.from('profiles').select('*').eq('id', targetUserId).single().then(({ data }) => setOtherUser(data));
    }

    // Fetch messages
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        if (data) setMessages(data as Message[]);
      } catch (err) {
        console.warn('Chat fetch failed, using fallback mock messages.', err);
        setMessages([
          {
            id: '1',
            sender_id: targetUserId || '1',
            receiver_id: user.id || '2',
            content: `Olá! Tenho interesse no seu anúncio. Ainda está disponível?`,
            created_at: new Date().toISOString()
          }
        ]);
      }
    };

    fetchMessages();

    // Subscribe to real-time (optional, can fail silently)
    let channel: any;
    try {
      channel = supabase
        .channel('chat_room')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        })
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription failed.');
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [user, listingId, sellerId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !otherUser) return;

    const messageObj = {
      sender_id: user.id,
      receiver_id: otherUser.id,
      listing_id: listingId,
      content: newMessage.trim()
    };

    try {
      const { data, error } = await supabase.from('messages').insert(messageObj).select().single();
      if (error) throw error;
      if (data) {
        setMessages(prev => [...prev, data as Message]);
        setNewMessage('');
      }
    } catch (err) {
      // Fallback for demo
      const fakeMsg: Message = {
        id: Math.random().toString(),
        sender_id: user.id,
        receiver_id: otherUser.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        listing_id: listingId
      };
      setMessages(prev => [...prev, fakeMsg]);
      setNewMessage('');
    }
  };

  if (!user) return null;

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center px-6 h-16 border-b border-outline-variant/10">
        <button onClick={() => goBack()} className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors mr-3">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
            {otherUser?.avatar_url ? <img src={otherUser.avatar_url} alt="" /> : <User size={20} />}
          </div>
          <div>
            <h1 className="text-sm font-black font-headline truncate max-w-[150px]">{otherUser?.full_name || 'Vendedor'}</h1>
            <p className="text-[10px] font-bold text-success uppercase tracking-widest">Online</p>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20 pb-24 px-4 overflow-y-auto max-w-2xl mx-auto w-full">
        {listing && (
          <div className="bg-surface-container-low p-3 rounded-2xl mb-6 flex gap-3 border border-outline-variant/10">
            <img src={listing.images?.[0]} className="w-16 h-16 rounded-xl object-cover" alt="" />
            <div className="flex-1">
              <h4 className="text-sm font-bold truncate">{listing.title}</h4>
              <p className="text-primary font-black">{formatPrice(listing.price)}</p>
            </div>
            <button className="self-center p-2 text-primary">
              <ShoppingBag size={20} />
            </button>
          </div>
        )}

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm text-sm ${
                  msg.sender_id === user.id 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-surface-container-highest text-on-surface rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>
      </main>

      <footer className="fixed bottom-0 w-full p-4 bg-background/80 backdrop-blur-xl border-t border-outline-variant/10 z-50">
        <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto flex gap-2">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escreve uma mensagem..." 
            className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-full py-4 px-6 text-sm outline-none focus:border-primary transition-all"
          />
          <button type="submit" className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors active:scale-90 shrink-0">
            <Send size={24} />
          </button>
        </form>
      </footer>
    </div>
  );
}
