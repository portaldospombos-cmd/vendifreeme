import { useBackNavigation } from '../hooks/useBackNavigation';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MapPin, ShieldCheck, MessageCircle, Phone, Star, Car, Ruler, Calendar, Fuel, Gauge, Home, BedDouble, Bath, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import Header from '../components/Header';
import { useSettings } from '../contexts/SettingsContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { useState } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

export default function ProductDetails() {
  const goBack = useBackNavigation();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, formatPrice } = useSettings();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [isContacting, setIsContacting] = useState(false);

  const productFromState = location.state?.item;
  const [product, setProduct] = useState<any>(productFromState);
  const [loading, setLoading] = useState(!productFromState);

  useEffect(() => {
    async function fetchProduct() {
      if (!id || productFromState) return;
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*, profiles!listings_user_id_fkey(full_name, avatar_url, location, email)')
          .eq('id', id)
          .single();
        
        if (data) {
          setProduct({
            id: data.id,
            title: data.title,
            price: data.price,
            location: data.location || data.profiles?.location || 'Portugal',
            description: data.description,
            images: data.images || [],
            seller: {
              id: data.user_id,
              name: data.profiles?.full_name || 'Vendedor Vendifree',
              rating: 0,
              reviews: 0,
              avatar: data.profiles?.avatar_url,
              joined: '2024'
            },
            category: data.category,
            email: data.profiles?.email || 'suporte@vendifree.pt'
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, productFromState]);

  if (loading) {
    return <div className="min-h-screen bg-background flex flex-col justify-center items-center">
       <header className="fixed top-0 left-0 right-0 z-50 glass-header flex items-center justify-between px-6 h-16">
          <button onClick={goBack} className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
       </header>
       <div className="text-on-surface-variant font-medium">A carregar anúncio...</div>
    </div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-background flex flex-col items-center pt-24 text-center">
       <header className="fixed top-0 left-0 right-0 z-50 glass-header flex items-center justify-between px-6 h-16">
          <button onClick={goBack} className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
       </header>
       <h2 className="text-2xl font-black font-headline text-primary mb-4">Anúncio não encontrado</h2>
       <p className="text-on-surface-variant mb-6">Este anúncio pode ter sido removido ou já não está disponível.</p>
       <button onClick={() => navigate('/')} className="px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:-translate-y-1 transition-transform">Voltar à Home</button>
    </div>;
  }

  const handleSendEmail = (customMessage?: string | any) => {
    const subject = encodeURIComponent(`Interesse em: ${product.title}`);
    let messageBody = `Olá! Vi o seu anúncio "${product.title}" na Vendifree e gostaria de obter mais informações.\n\nLink: ${window.location.href}`;
    if (typeof customMessage === 'string' && customMessage.trim() !== '') {
       messageBody = customMessage;
    }
    const body = encodeURIComponent(messageBody);
    window.location.href = `mailto:${product.email}?subject=${subject}&body=${body}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: product.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copiado para a área de transferência!');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  const navigateToSeller = () => {
    navigate(`/seller/${product.seller_id || 1}`);
  };

  const isCar = product.category?.toLowerCase() === 'cars' || product.category?.toLowerCase() === 'automóveis';
  const isRealEstate = product.category?.toLowerCase() === 'real estate' || product.category?.toLowerCase() === 'imóveis';

  // If the product comes from state and has a single 'image' property instead of 'images' array
  if (product.image && !product.images) {
    product.images = [product.image];
  }
  
  if (!product.seller) {
    product.seller = {
      name: 'Vendedor Teste',
      rating: 4.5,
      reviews: 12,
      avatar: 'https://picsum.photos/seed/seller/100/100',
      joined: 'Membro desde 2024'
    };
  }

  return (
    <div className="bg-background min-h-screen pb-24">
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex justify-between items-center px-6 h-16">
        <button 
          onClick={() => goBack()}
          className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handleShare}
            className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors"
          >
            <Share2 size={24} />
          </button>
          <button 
            onClick={() => toggleFavorite(product.id)}
            className={`p-2 rounded-full transition-colors ${isFavorite(product.id) ? 'text-error hover:bg-error/10' : 'text-primary hover:bg-surface-container-high/50'}`}
          >
            <Heart size={24} fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </header>

      <main className="pt-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:p-8">
          {/* Image Gallery */}
          <div className="relative aspect-square md:aspect-[4/3] lg:rounded-3xl overflow-hidden bg-surface-container-low">
            <img 
              src={product.images[0]} 
              alt={product.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary w-6' : 'bg-white/50'} transition-all`} />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="px-6 lg:px-0 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary-container/30 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
                  {product.condition}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black font-headline text-on-surface mb-2 tracking-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 text-on-surface-variant mb-4">
                <MapPin size={16} />
                <span className="text-sm font-medium">{product.location}</span>
              </div>
              <div className="text-4xl font-black text-primary mb-2">
                {formatPrice(product.price)}
              </div>

              {/* Fair Price Indicator */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  product.fairPrice === 'below' ? 'bg-success/10 text-success' :
                  product.fairPrice === 'above' ? 'bg-error/10 text-error' :
                  'bg-primary/10 text-primary'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    product.fairPrice === 'below' ? 'bg-success' :
                    product.fairPrice === 'above' ? 'bg-error' :
                    'bg-primary'
                  }`} />
                  {t(`product.priceIndicator.${product.fairPrice === 'below' ? 'below' : product.fairPrice === 'above' ? 'above' : 'within'}`)}
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
                  <ShieldCheck size={10} />
                  {t('product.aiVerified')}
                </span>
              </div>
            </div>

            {/* Category Specific Specs */}
            {isCar && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex flex-col items-center justify-center text-center">
                  <Calendar size={18} className="text-primary mb-2" />
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Ano</span>
                  <span className="text-sm font-black">2021</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex flex-col items-center justify-center text-center">
                  <Gauge size={18} className="text-primary mb-2" />
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">KMS</span>
                  <span className="text-sm font-black">45.000 km</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex flex-col items-center justify-center text-center">
                  <Fuel size={18} className="text-primary mb-2" />
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Combustível</span>
                  <span className="text-sm font-black">Gasolina</span>
                </div>
              </div>
            )}

            {isRealEstate && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex flex-col items-center justify-center text-center">
                  <Home size={18} className="text-primary mb-2" />
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('listing.type')}</span>
                  <span className="text-sm font-black">{t(`listing.propertyTypes.${product.property_type || 't0'}`)}</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex flex-col items-center justify-center text-center">
                  <Ruler size={18} className="text-primary mb-2" />
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{t('listing.area')}</span>
                  <span className="text-sm font-black">{product.area || '0'} m²</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex flex-col items-center justify-center text-center">
                  <BedDouble size={18} className="text-primary mb-2" />
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Rooms</span>
                  <span className="text-sm font-black">{product.property_type ? product.property_type.charAt(1) : '–'}</span>
                </div>
              </div>
            )}

            <div className="bg-surface-container-low rounded-2xl p-6 mb-8 border border-outline-variant/10">
              <h3 className="font-bold font-headline mb-3">{t('product.description')}</h3>
              <p className="text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-6 mb-8 border border-outline-variant/10 shadow-sm">
              <h3 className="font-black font-headline text-lg mb-4">{t('product.contactSeller')}</h3>
              <form 
                className="space-y-4" 
                onSubmit={(e: any) => { 
                  e.preventDefault(); 
                  const message = e.target.elements[2].value;
                  handleSendEmail(message); 
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">{t('product.yourName')}</label>
                    <input type="text" placeholder={t('product.yourNamePlaceholder')} className="w-full bg-surface-container-low/50 border border-outline-variant/20 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary transition-all" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">{t('product.contactInfo')}</label>
                    <input type="text" placeholder={t('product.contactInfoPlaceholder')} className="w-full bg-surface-container-low/50 border border-outline-variant/20 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary transition-all" required />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">{t('product.message')}</label>
                  <textarea placeholder={t('common.postContent')} rows={3} className="w-full bg-surface-container-low/50 border border-outline-variant/20 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary transition-all resize-none" required></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-lg hover:bg-primary/90 transition-all active:scale-[0.98]">
                  {t('product.message')}
                </button>
              </form>
            </div>

            {/* Seller Info */}
            <div 
              onClick={navigateToSeller}
              className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 mb-8 cursor-pointer hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-4">
                <img src={product.seller.avatar} alt={product.seller.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold font-headline">{product.seller.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                    <Star size={12} className="fill-tertiary text-tertiary" />
                    <span className="font-bold">{product.seller.rating}</span>
                    <span>({product.seller.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); navigateToSeller(); }}
                className="text-primary font-bold text-sm hover:underline"
              >
                {t('common.viewAll')}
              </button>
            </div>

            {/* Safety Tip */}
            <div className="flex items-start gap-3 p-4 bg-tertiary-container/10 rounded-xl border border-tertiary-container/20 mb-8">
              <ShieldCheck className="text-tertiary shrink-0" size={20} />
              <p className="text-xs text-on-surface-variant leading-tight">
                <span className="font-bold text-tertiary">{t('product.protection')}:</span> {t('product.protectionDesc')}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-background/80 backdrop-blur-xl border-t border-outline-variant/10 p-4 z-50">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button 
                onClick={handleSendEmail}
                disabled={product.sold}
                className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-all active:scale-95 disabled:opacity-50"
              >
                <Mail size={18} />
                <span className="text-sm">Email</span>
              </button>
              <button 
                onClick={() => setShowPhone(!showPhone)}
                disabled={product.sold || !product.phone}
                className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold rounded-full border-2 transition-all active:scale-95 disabled:opacity-50 ${
                  showPhone ? 'bg-primary text-white border-primary' : 'border-primary text-primary hover:bg-primary/5'
                }`}
              >
                <Phone size={18} />
                <span className="text-sm">{showPhone ? product.phone : 'Telefone'}</span>
              </button>
            </div>
            {product.phone && (
              <button 
                onClick={() => {
                  const num = product.phone.replace(/\D/g, '');
                  window.open(`https://wa.me/${num}?text=${encodeURIComponent(`Olá! Vi o seu anúncio "${product.title}" na Vendifree e gostaria de saber mais.`)}`);
                }}
                disabled={product.sold}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#128C7E] transition-all active:scale-95 disabled:opacity-50"
              >
                <MessageCircle size={18} />
                <span className="text-sm">Contactar no WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
