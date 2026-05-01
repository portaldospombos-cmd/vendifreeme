import { useNavigate } from 'react-router-dom';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { ArrowLeft, Plus, MoreVertical, TrendingUp, Edit3, Trash2, Loader2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function MyListings() {
  const goBack = useBackNavigation();
  const navigate = useNavigate();
  const { t, formatPrice } = useSettings();
  const { user } = useAuth();
  const [activeStatus, setActiveStatus] = useState('active');
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMyListings() {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setListings(data || []);
      } catch (err) {
        console.error('Error fetching my listings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyListings();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem a certeza que deseja apagar este anúncio?')) {
      try {
        const { error } = await supabase.from('listings').delete().eq('id', id);
        if (error) throw error;
        setListings(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Erro ao apagar o anúncio.');
      }
    }
  };

  const currentListings = listings.filter(item => {
    if (activeStatus === 'active') return item.status !== 'sold' && item.status !== 'expired';
    return item.status === activeStatus;
  });

  return (
    <div className="bg-background min-h-screen pb-32">
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center px-6 h-16 border-b border-outline-variant/10">
        <button 
          onClick={() => goBack()}
          className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black font-headline text-primary tracking-tight">{t('myListings.title')}</h1>
      </header>

      <main className="pt-24 px-6 max-w-4xl mx-auto">
        <div className="flex gap-4 mb-8 overflow-x-auto hide-scrollbar">
          {['active', 'sold', 'expired'].map((status) => (
            <button 
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                activeStatus === status 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {(t('myListings') as any)[status]}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="animate-spin text-primary mx-auto mb-4" size={32} />
              <p className="font-bold text-on-surface-variant">A carregar os teus anúncios...</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {currentListings.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface-container-lowest rounded-3xl p-4 flex gap-4 border border-outline-variant/10 shadow-sm group"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                    <img src={item.image_url || (item.images && item.images[0]) || 'https://picsum.photos/seed/default/400/300'} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold font-headline text-on-surface line-clamp-1">{item.title}</h3>
                        <button className="text-on-surface-variant hover:text-primary p-1">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                      <p className="text-primary font-black">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant opacity-60">
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12} /> {item.views || 0} views
                      </span>
                      <span>{item.likes || 0} likes</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 justify-center">
                    {activeStatus === 'active' && (
                      <>
                        <button 
                          onClick={() => navigate('/promote', { state: { productId: item.id } })}
                          className="p-2 bg-primary/5 text-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
                          title={t('myListings.promote')}
                        >
                          <TrendingUp size={18} />
                        </button>
                        <button 
                          onClick={() => navigate('/sell', { state: { listing: item } })}
                          className="p-2 bg-secondary-container/30 text-on-secondary-container rounded-xl hover:bg-secondary-container transition-colors"
                          title={t('myListings.edit')}
                        >
                          <Edit3 size={18} />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-error/5 text-error rounded-xl hover:bg-error hover:text-white transition-colors"
                      title={t('myListings.delete')}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {!loading && currentListings.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6 text-on-surface-variant/30">
              <Plus size={40} />
            </div>
            <p className="text-on-surface-variant font-medium mb-6">{t('myListings.noListings')}</p>
            <button 
              onClick={() => navigate('/sell')}
              className="signature-gradient text-white px-8 py-3 rounded-full font-bold shadow-lg"
            >
              {t('myListings.startSelling')}
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
