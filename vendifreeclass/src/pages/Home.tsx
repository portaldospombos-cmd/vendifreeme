import { Search, ArrowRight, MapPin, Heart, Plus, X, SlidersHorizontal, Check, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import RegionSelector from '../components/RegionSelector';
import { useSettings } from '../contexts/SettingsContext';
import { useState, useMemo, useEffect, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import SEO from '../components/SEO';

export default function Home() {
  const { t, formatPrice, location, setLocation } = useSettings();
  const { showToast } = useToast();
  
  const categories = useMemo(() => [
    { id: 'all', icon: '✨', label: t('categories.all') },
    { id: 'cars', icon: '🚗', label: t('categories.cars') },
    { id: 'property', icon: '🏠', label: t('categories.property') },
    { id: 'electronics', icon: '💻', label: t('categories.electronics') },
    { id: 'fashion', icon: '👕', label: t('categories.fashion') },
    { id: 'home', icon: '🛋️', label: t('categories.home') },
    { id: 'gaming', icon: '🎮', label: t('categories.gaming') },
    { id: 'automotive', icon: '🔧', label: t('categories.automotive') },
    { id: 'sports', icon: '⚽', label: t('categories.sports') },
    { id: 'services', icon: '🛠️', label: t('categories.services') },
    { id: 'others', icon: '📦', label: t('categories.others') },
  ], [t]);

  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('recent');
  const [isLocating, setIsLocating] = useState(false);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          const formatted: Product[] = data.map(item => ({
            id: item.id,
            title: item.title,
            price: Number(item.price),
            location: item.location,
            description: item.description,
            image: item.images?.[0] || 'https://picsum.photos/seed/default/400/300',
            isPremium: item.promotion_type === 'premium' || item.is_premium,
            category: item.category,
            seller_id: item.user_id,
            sold: item.status === 'sold'
          }));
          setProducts(formatted);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching listings from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    if (import.meta.env.VITE_SUPABASE_URL) {
      fetchProducts();
    }
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // In a real app, we would reverse geocode this.
        setTimeout(() => {
          setLocation(`Localização Atual (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
          setIsLocating(false);
          setIsRegionModalOpen(false);
        }, 1000);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Não foi possível obter a sua localização.');
        setIsLocating(false);
      }
    );
  };

  const filteredItems = useMemo(() => {
    let result = products.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesPrice = item.price <= maxPrice;
      
      // Property type filter
      let matchesPropertyType = true;
      if (propertyTypeFilter && (selectedCategory === 'property' || selectedCategory === 'all')) {
        matchesPropertyType = item.property_type === propertyTypeFilter;
      }
      
      // Location matching logic
      let matchesLocation = true;
      if (location && location !== 'Portugal') {
        const selectedLocs = location.replace(', Portugal', '').split(', ').map(l => l.toLowerCase());
        matchesLocation = selectedLocs.some(loc => item.location.toLowerCase().includes(loc));
      }

      return matchesSearch && matchesCategory && matchesPrice && matchesLocation && matchesPropertyType;
    });

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'recent') {
      result = [...result].sort((a, b) => b.id - a.id);
    }

    return result;
  }, [searchQuery, selectedCategory, maxPrice, sortBy]);

  const featured = filteredItems.filter(item => item.isPremium || item.id <= 3);
  const justListed = filteredItems.filter(item => item.id > 3);

  const handleItemClick = (item: any) => {
    navigate(`/product/${item.id}`, { state: { item } });
  };

  const handleShare = async (e: MouseEvent, item: any) => {
    e.stopPropagation();
    const shareData = {
      title: item.title,
      text: item.description || `Confira este anúncio na Vendifree: ${item.title}`,
      url: `${window.location.origin}/product/${item.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/product/${item.id}`);
        alert('Link copiado!');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <SEO 
        title="Encontre Tesouros" 
        description="O melhor marketplace de produtos vintage e usados."
      />
      <Header searchQuery={searchQuery} onSearch={setSearchQuery} />
      
      <main className="pt-24 px-4 md:px-12 max-w-screen-2xl mx-auto">
        {/* Hero Search Section */}
        <section className="mb-16">
          <div className="relative rounded-[3rem] overflow-hidden p-8 md:p-20 min-h-[400px] flex flex-col justify-center bg-surface-container-low shadow-xl shadow-surface-container-high/20 border border-white/40">
            <div className="absolute inset-0 opacity-30 pointer-events-none group">
              <img 
                src="https://picsum.photos/seed/marketplace/1920/1080" 
                alt="" 
                className="w-full h-full object-cover grayscale mix-blend-overlay group-hover:scale-110 transition-transform duration-[10s]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-surface-container-low/80 to-transparent" />
            </div>
            <div className="relative z-10 max-w-3xl">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-7xl font-black font-headline text-on-surface mb-8 leading-[1.1] tracking-tighter"
              >
                Encontre o seu próximo <span className="text-primary italic">tesouro</span> hoje.
              </motion.h2>
              <div className="flex flex-col md:flex-row gap-2 bg-surface-container-lowest/80 backdrop-blur-md p-2 rounded-[2rem] shadow-2xl border border-white/50 shadow-[#00f5ff]/20 max-w-4xl">
                <div className="flex-[2] flex items-center px-6">
                  <Search className="text-[#00f5ff]" size={24} />
                  <input 
                    className="bg-transparent border-none focus:ring-0 w-full h-16 text-lg font-medium text-on-surface placeholder:text-on-surface-variant/40" 
                    placeholder="Procure por qualquer coisa..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="hidden md:block w-px h-10 bg-outline-variant/20 self-center" />
                <button 
                  onClick={() => setIsRegionModalOpen(true)}
                  disabled={isLocating}
                  className="flex-1 text-on-surface-variant px-6 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-surface-container-high transition-colors disabled:opacity-50 group"
                >
                  <MapPin size={22} className={`${isLocating ? 'animate-bounce text-primary' : 'text-primary/60 group-hover:text-primary'} transition-colors`} />
                  <span className="truncate text-sm font-headline tracking-tight">{isLocating ? 'A localizar...' : (location || 'Qualquer Região')}</span>
                </button>
                <button 
                  onClick={() => {
                    const resultsSection = document.getElementById('results-section');
                    if (resultsSection) {
                      resultsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`bg-[#00f5ff] hover:bg-[#00d1e0] text-black px-10 py-5 rounded-[1.5rem] font-black text-lg shadow-lg transition-all duration-300
                    ${searchQuery ? 'opacity-100 scale-100 shadow-[#00f5ff]/30' : 'opacity-50 scale-95 shadow-none cursor-not-allowed'}
                  `}
                >
                  Pesquisar
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="results-section" className="mb-20">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-3xl font-black font-headline tracking-tight mb-2">Explorar Categorias</h3>
              <p className="text-on-surface-variant text-sm font-medium">Descobre itens por coleções especializadas</p>
            </div>
            <button 
              onClick={() => setSelectedCategory('all')}
              className="bg-surface-container-low text-primary px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-surface-container-high transition-all"
            >
              {t('common.viewAll')} <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 lg:gap-8">
            {categories.map((cat) => (
              <motion.div 
                key={cat.id} 
                whileHover={{ y: -8 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-4 cursor-pointer p-4 rounded-3xl transition-all duration-300 border ${
                  selectedCategory === cat.id 
                    ? 'bg-secondary-container border-primary/20 shadow-xl shadow-primary/10' 
                    : 'bg-surface-container-lowest border-transparent hover:border-outline-variant/20 hover:shadow-lg'
                }`}
              >
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner transition-colors ${
                  selectedCategory === cat.id ? 'bg-white' : 'bg-surface-container-low'
                }`}>
                  {cat.icon}
                </div>
                <span className={`text-sm font-bold font-headline tracking-tight text-center ${
                  selectedCategory === cat.id ? 'text-primary' : 'text-on-surface-variant'
                }`}>{cat.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Treasures */}
        <section className="mb-24">
          <h3 className="text-3xl font-black font-headline tracking-tight mb-10">Anúncios Premium</h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full">
            {featured.length > 0 ? (
              <>
                {/* Large Main Feature */}
                {featured[0] && (
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    onClick={() => handleItemClick(featured[0])}
                    className="md:col-span-8 bg-surface-container-lowest rounded-[3rem] overflow-hidden shadow-2xl shadow-surface-container-high/40 group cursor-pointer border border-outline-variant/10 flex flex-col lg:flex-row h-[500px]"
                  >
                    <div className="lg:w-3/5 relative overflow-hidden h-full">
                      <img 
                        src={featured[0].image} 
                        alt={featured[0].title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <button 
                          onClick={(e) => handleShare(e, featured[0])}
                          className="w-14 h-14 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all text-primary"
                        >
                          <Share2 size={24} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(featured[0].id); }}
                          className={`w-14 h-14 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all ${isFavorite(featured[0].id) ? 'text-error animate-pulse' : 'text-primary'}`}
                        >
                          <Heart size={28} fill={isFavorite(featured[0].id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                    <div className="lg:w-2/5 p-10 flex flex-col justify-between items-start bg-white relative">
                      {featured[0].isPremium && (
                        <div className="mb-6 signature-gradient text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
                          Premium Verificado
                        </div>
                      )}
                      <div>
                        <h4 className="text-4xl font-black font-headline leading-none tracking-tighter mb-4 text-on-surface group-hover:text-primary transition-colors">{featured[0].title}</h4>
                        <div className="flex items-center gap-2 text-on-surface-variant font-bold text-sm mb-6">
                          <MapPin size={18} className="text-primary" />
                          <span>{featured[0].location}</span>
                        </div>
                        <p className="text-on-surface-variant text-lg leading-relaxed line-clamp-3 mb-8">{featured[0].description}</p>
                      </div>
                      <div className="w-full flex justify-between items-end">
                        <span className="text-5xl font-black text-primary tracking-tighter">{formatPrice(featured[0].price)}</span>
                        <div className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <ArrowRight size={24} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Vertical Sidebar Column for small features */}
                <div className="md:col-span-4 flex flex-col gap-8">
                  {featured.slice(1, 3).map((item) => (
                    <motion.div 
                      key={item.id} 
                      whileHover={{ x: 10 }}
                      onClick={() => handleItemClick(item)}
                      className="flex-1 bg-surface-container-lowest rounded-3xl overflow-hidden shadow-xl border border-outline-variant/10 group cursor-pointer flex p-4 gap-6"
                    >
                      <div className="w-32 h-full rounded-2xl overflow-hidden relative flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex flex-col justify-center py-2">
                        <span className="text-2xl font-black text-primary tracking-tighter">{formatPrice(item.price)}</span>
                        <h4 className="font-bold font-headline text-lg group-hover:text-primary transition-colors truncate max-w-[200px]">{item.title}</h4>
                        <div className="flex items-center gap-1 text-on-surface-variant font-bold text-[10px] mt-2 uppercase tracking-widest">
                          <MapPin size={12} />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="col-span-full py-12 text-center text-on-surface-variant font-headline font-bold text-2xl opacity-50">
                {t('home.noResults')}
              </div>
            )}
          </div>
        </section>

        {/* Just Listed */}
        <section className="mb-24">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-3xl font-black font-headline tracking-tight mb-2">{t('home.justListed')}</h3>
              <p className="text-on-surface-variant text-sm font-medium">{t('home.justListedDesc')}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsFilterModalOpen(true)}
                className="bg-surface-container-low text-on-surface-variant px-6 py-3 rounded-full flex items-center gap-2 hover:bg-surface-container-high transition-all font-bold text-sm"
              >
                <Search size={18} />
                <span>{t('common.filter')}</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 lg:gap-8">
            {justListed.length > 0 ? (
              justListed.map((item) => (
                <motion.div 
                  key={item.id} 
                  whileHover={{ y: -10 }}
                  onClick={() => handleItemClick(item)}
                  className="bg-surface-container-low/30 rounded-[2.5rem] p-3 group cursor-pointer hover:bg-surface-container-lowest hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border border-transparent hover:border-primary/10"
                >
                  <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-5 relative shadow-lg">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-4 right-4 flex gap-1.5 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={(e) => handleShare(e, item)}
                        className="w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all text-primary"
                      >
                        <Share2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                        className={`w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all ${isFavorite(item.id) ? 'text-error scale-110' : 'text-primary'}`}
                      >
                        <Heart size={18} fill={isFavorite(item.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-primary uppercase">
                      {t('common.new')}
                    </div>
                    {item.isNegotiable && (
                      <div className="absolute top-4 right-14 bg-tertiary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
                        {t('common.negotiable')}
                      </div>
                    )}
                    {item.sold && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-error text-white px-6 py-2 rounded-xl font-black font-headline uppercase tracking-widest text-sm shadow-xl rotate-[-10deg]">
                          {t('common.sold')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="px-3 pb-2">
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xl font-black text-primary tracking-tighter">{formatPrice(item.price)}</span>
                      {/* Fair Price Indicator */}
                      {item.fairPrice && (
                        <div className={`w-2 h-2 rounded-full ${
                          item.fairPrice === 'below' ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                          item.fairPrice === 'above' ? 'bg-error shadow-[0_0_8px_rgba(239,68,68,0.6)]' :
                          'bg-primary shadow-[0_0_8px_rgba(0,184,212,0.6)]'
                        }`} title={`Preço ${item.fairPrice === 'below' ? 'abaixo' : item.fairPrice === 'above' ? 'acima' : 'dentro'} da média`} />
                      )}
                    </div>
                    <h5 className="text-sm font-bold font-headline truncate text-on-surface group-hover:text-primary transition-colors">{item.title}</h5>
                    <div className="flex items-center gap-1 text-on-surface-variant font-medium text-[10px] mt-2">
                      <MapPin size={10} className="text-primary/60" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-surface-container-low/30 rounded-[2.5rem] border border-outline-variant/10">
                <Search size={48} className="mx-auto text-on-surface-variant/30 mb-4" />
                <h4 className="text-xl font-black font-headline text-on-surface mb-2">Nenhum anúncio comum</h4>
                <p className="text-on-surface-variant">Tente remover alguns filtros ou pesquisa.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FAB for Selling */}
      <button 
        onClick={() => navigate('/sell')}
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-16 h-16 rounded-full bg-tertiary text-white shadow-[0px_12px_32px_rgba(0,99,133,0.3)] flex items-center justify-center active:scale-90 duration-150 z-40 group"
      >
        <Plus size={32} className="transition-transform group-hover:rotate-90" />
      </button>

      <BottomNav />

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterModalOpen(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%', opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: '100%', opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-surface rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/40"
            >
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
                <div>
                  <h3 className="text-2xl font-black font-headline text-primary">{t('common.advancedFilters')}</h3>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">{t('common.refineSearch')}</p>
                </div>
                <button 
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-3 hover:bg-surface-container-high rounded-full transition-colors text-primary"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 space-y-10 overflow-y-auto max-h-[70vh]">
                {/* Price Range */}
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <label className="text-sm font-black font-headline text-on-surface uppercase tracking-tighter">{t('common.priceRange')}</label>
                    <span className="text-2xl font-black text-primary tracking-tighter">{t('common.upTo')} {formatPrice(maxPrice)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="50000" 
                    step={maxPrice > 1000 ? 500 : 50}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-2 bg-surface-container-low rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-4 text-[10px] font-black text-on-surface-variant/40 uppercase">
                    <span>{formatPrice(10)}</span>
                    <span>{formatPrice(50000)}</span>
                  </div>
                </div>

                {/* Property Type Filter (Only for realEstate or All) */}
                {(selectedCategory === 'all' || selectedCategory === 'property') && (
                  <div>
                    <label className="text-sm font-black font-headline text-on-surface uppercase tracking-tighter block mb-4">
                      {t('listing.type')}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setPropertyTypeFilter('')}
                        className={`px-4 py-2 rounded-full border-2 transition-all text-xs font-bold ${
                          propertyTypeFilter === ''
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-surface-container-low border-transparent text-on-surface-variant hover:border-outline-variant'
                        }`}
                      >
                        {t('common.all')}
                      </button>
                      {['t0', 't1', 't2', 't3', 't4'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setPropertyTypeFilter(type)}
                          className={`px-4 py-2 rounded-full border-2 transition-all text-xs font-bold ${
                            propertyTypeFilter === type
                              ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                              : 'bg-surface-container-low border-transparent text-on-surface-variant hover:border-outline-variant'
                          }`}
                        >
                          {t(`listing.propertyTypes.${type}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sort By */}
                <div>
                  <label className="text-sm font-black font-headline text-on-surface uppercase tracking-tighter block mb-6">{t('common.sortBy')}</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'recent', label: t('common.sortNewest'), icon: SlidersHorizontal },
                      { id: 'price-low', label: t('common.sortPriceLow'), icon: Check },
                      { id: 'price-high', label: t('common.sortPriceHigh'), icon: Plus },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id)}
                        className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                          sortBy === option.id 
                            ? 'bg-primary/5 border-primary text-primary shadow-inner' 
                            : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="font-bold text-sm tracking-tight">{option.label}</span>
                        {sortBy === option.id && <Check size={20} className="text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-full bg-primary hover:bg-on-surface text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all duration-300"
                >
                  {t('common.showResults')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <RegionSelector 
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        selectedRegion={location}
        onSelectRegion={(reg) => {
          setLocation(reg);
        }}
        onGeolocate={handleGetLocation}
        isLocating={isLocating}
      />
    </div>
  );
}
