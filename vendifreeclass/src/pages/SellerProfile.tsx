import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MessageSquare, ShieldCheck, MapPin, Package, Loader2, Share2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useSettings } from '../contexts/SettingsContext';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

interface Seller {
  name: string;
  username: string;
  rating: number;
  reviews: number;
  location: string;
  joined: string;
  avatar: string;
  isVerified: boolean;
  listings: Product[];
}

export default function SellerProfile() {
  const { showToast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = useBackNavigation();
  const { t, formatPrice } = useSettings();
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<Seller | null>(null);

  useEffect(() => {
    async function fetchSellerData() {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        // Fetch their products
        const { data: productsData, error: productsError } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', id);

        if (profileError) {
          // Fallback if profile doesn't exist yet but product has a seller_id
          setSeller({
            name: "Vendedor Vendifree",
            username: "@vendedor",
            rating: 4.8,
            reviews: 12,
            location: "Lisboa, Portugal",
            joined: "2024",
            avatar: "https://picsum.photos/seed/seller/200/200",
            isVerified: true,
            listings: []
          });
        } else {
          setSeller({
            name: profileData.full_name || "Vendedor",
            username: `@${profileData.full_name?.toLowerCase().replace(/\s/g, '_') || 'user'}`,
            rating: 4.9,
            reviews: 45,
            location: profileData.location || "Portugal",
            joined: "2024",
            avatar: profileData.avatar_url || "https://picsum.photos/seed/avatar/200/200",
            isVerified: true,
            listings: (productsData || []).map(p => ({
              id: p.id,
              title: p.title,
              price: Number(p.price),
              location: p.location,
              image: p.image_url || 'https://picsum.photos/seed/item/300/300',
              category: p.category
            }))
          });
        }
      } catch (err) {
        console.error('Error fetching seller:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSellerData();
  }, [id]);

  const handleShare = async () => {
    const shareData = {
      title: `Perfil de ${seller?.name} na Vendifree`,
      text: `Confira os artigos de ${seller?.name} na Vendifree!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link do perfil copiado!');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <h2 className="text-2xl font-black font-headline text-primary mb-2">Ops!</h2>
        <p className="text-on-surface-variant mb-6">Não conseguimos encontrar este vendedor.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-primary text-white rounded-full font-bold">Voltar à Home</button>
      </div>
    );
  }

  const handleContact = async () => {
    // For now we don't have the seller email directly in the local state, but we can try
    // Since we fetch profiles, we might have email if we add it, but normally it's on auth.users.
    // If empty it opens email client empty.
    window.location.href = `mailto:suporte@vendifree.pt?subject=${encodeURIComponent(`Contacto via Perfil Vendifree: ${seller.name}`)}`;
  };

  return (
    <div className="bg-background min-h-screen pb-32">
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black font-headline text-primary tracking-tight">Perfil do Vendedor</h1>
        </div>
        <button 
          onClick={handleShare}
          className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors"
        >
          <Share2 size={24} />
        </button>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Seller Info */}
        <section className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <img src={seller.avatar} alt={seller.name} className="w-28 h-28 rounded-full border-4 border-surface-container-lowest object-cover shadow-lg" />
            {seller.isVerified && (
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md">
                <ShieldCheck size={18} />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-black font-headline text-on-surface mb-1">{seller.name}</h2>
          <p className="text-on-surface-variant text-sm font-medium mb-4">{seller.username} • {seller.location}</p>
          
          <div className="flex gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center gap-1 text-primary font-black text-xl">
                <Star size={20} fill="currentColor" />
                <span>{seller.rating}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">{seller.reviews} Reviews</p>
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/30 self-center"></div>
            <div className="text-center">
              <p className="text-xl font-black text-primary">{seller.listings.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Artigos</p>
            </div>
          </div>

          <button 
            onClick={handleContact}
            className="w-full py-4 signature-gradient text-white font-headline font-bold text-lg rounded-full shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <MessageSquare size={20} />
            Contactar Vendedor
          </button>
        </section>

        {/* Seller Listings */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Package size={20} className="text-primary" />
            <h3 className="text-lg font-bold font-headline">Artigos à venda</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {seller.listings.map((item) => (
              <div key={item.id} className="bg-surface-container-low/50 rounded-2xl p-2 group cursor-pointer hover:bg-surface-container-low transition-colors">
                <div className="aspect-square rounded-xl overflow-hidden mb-3">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="px-1">
                  <span className="text-primary font-black">{formatPrice(item.price)}</span>
                  <h5 className="text-sm font-bold font-headline truncate">{item.title}</h5>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
