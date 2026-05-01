import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { ArrowLeft, MapPin, Calendar, Clock, Star, ShieldCheck, Mail, HelpCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

export default function Store() {
  const { userId } = useParams();
  const goBack = useBackNavigation();
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStore() {
      if (!userId) return;
      try {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (profile) {
          setStoreData(profile);
          const { data: userListings } = await supabase.from('listings').select('*').eq('user_id', userId);
          setListings(userListings || []);
        }
      } catch (err) {
        console.error('Error fetching store', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStore();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex bg-surface min-h-screen items-center justify-center pt-20">
        <div className="text-on-surface-variant font-medium">A carregar loja...</div>
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="flex bg-surface min-h-screen items-center justify-center pt-20">
        <div className="text-on-surface-variant font-medium text-center">
          <p className="mb-4">Loja não encontrada.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-primary text-white rounded-full">Voltar à Home</button>
        </div>
      </div>
    );
  }

  // Se não for premium, podemos querer ocultar ou mostrar um design mais simples.
  // O prompt diz "Apenas disponível para plano Premium", mas na prática podemos só verificar
  const isPremium = storeData.plan_type === 'premium';

  if (!isPremium) {
     return (
      <div className="flex bg-surface min-h-screen items-center justify-center pt-20">
        <div className="text-on-surface-variant font-medium text-center p-6 bg-surface-container-low rounded-2xl max-w-sm mx-auto">
          <p className="mb-4">O utilizador tem de subscrever o plano Premium para ter uma loja ativa.</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-primary text-white rounded-full">Voltar à Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32">
      <SEO 
        title={`${storeData.store_name || storeData.full_name} | Loja Vendifree`}
        description={storeData.store_description || `Loja oficial de ${storeData.full_name} na Vendifree.`}
      />

      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors active:scale-95 duration-200">
            <ArrowLeft size={24} className="text-[#00f5ff]" />
          </button>
          <h1 className="font-headline font-bold tracking-tight text-xl text-slate-900">Loja Premium</h1>
        </div>
        <button onClick={() => window.location.href='mailto:suporte@vendifree.pt'} className="p-2 rounded-full hover:bg-slate-100 transition-colors active:scale-95 duration-200">
          <HelpCircle size={24} className="text-slate-500" />
        </button>
      </header>

      {/* Hero Banner */}
      <div className="pt-16">
        <div className="h-48 md:h-64 bg-primary/10 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 mix-blend-multiply" />
          <Star size={100} className="text-primary/20 absolute -right-10 -bottom-10 rotate-12" />
          <ShieldCheck size={120} className="text-secondary/20 absolute -left-10 -top-10 -rotate-12" />
        </div>
        
        <main className="px-6 max-w-6xl mx-auto -mt-16 relative z-10">
          <div className="bg-surface-container-lowest p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-outline-variant/10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left mb-12">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-surface shadow-2xl overflow-hidden bg-surface-container shrink-0">
              {storeData.avatar_url ? (
                <img src={storeData.avatar_url} alt={storeData.store_name || storeData.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-primary">
                  {(storeData.store_name || storeData.full_name)?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div>
                <h1 className="text-3xl md:text-4xl font-black font-headline tracking-tight text-on-surface break-words">
                  {storeData.store_name || storeData.full_name}
                </h1>
                <p className="text-primary font-medium flex items-center justify-center md:justify-start gap-2 mt-2">
                  <ShieldCheck size={18} />
                  Loja Premium Verificada
                </p>
              </div>

              {storeData.store_description && (
                <p className="text-on-surface-variant font-medium leading-relaxed max-w-2xl">
                  {storeData.store_description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4 text-xs font-bold text-on-surface-variant/80">
                <div className="flex items-center gap-1.5"><Calendar size={16} /> Membro desde {new Date(storeData.created_at || Date.now()).getFullYear()}</div>
                <div className="w-1 h-1 rounded-full bg-outline-variant/50 hidden md:block" />
                <div className="flex items-center gap-1.5"><Clock size={16} /> {listings.length} anúncios ativos</div>
              </div>
            </div>

            <div className="shrink-0">
              <button 
                onClick={() => window.location.href = `mailto:${storeData.email || 'suporte@vendifree.pt'}`} 
                className="w-full md:w-auto px-8 py-3 bg-on-surface text-surface rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Contactar Loja
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-black font-headline tracking-tight text-on-surface mb-6">Todos os Artigos</h2>
          
          {listings.length === 0 ? (
            <div className="text-center p-12 bg-surface-container-low rounded-[2rem] border border-outline-variant/20">
              <p className="text-on-surface-variant font-medium">Esta loja ainda não tem anúncios ativos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="bg-surface-container-lowest rounded-3xl p-3 flex flex-col gap-3 border border-outline-variant/20 hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container-low relative">
                    <img 
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=600'} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black tracking-widest text-[#00f5ff]">
                      DESTAQUE
                    </div>
                  </div>
                  <div className="p-2">
                    <h3 className="font-bold text-on-surface font-headline line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-xs text-on-surface-variant line-clamp-1 mt-1 mb-2">{item.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-lg text-on-surface">{item.price}€</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
