import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { ArrowLeft, Camera, X, MapPin, ChevronRight, CheckCircle2, Loader2, Zap, Star, ShieldCheck, Car, Home, TrendingUp } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import RegionSelector from '../components/RegionSelector';
import { analyzePrice } from '../services/geminiService';

export default function CreateListing() {
  const { showToast } = useToast();
  const goBack = useBackNavigation();
  const navigate = useNavigate();
  const { t, currency, formatPrice } = useSettings();
  const { user, profile } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  
  // Specific Fields
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [km, setKm] = useState('');
  const [fuel, setFuel] = useState('');
  const [gearbox, setGearbox] = useState('');
  
  const [propertyType, setPropertyType] = useState('');
  const [area, setArea] = useState('');
  const [rooms, setRooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Automatic category suggestion based on title
  useEffect(() => {
    const lowTitle = title.toLowerCase();
    if (lowTitle.includes('carro') || lowTitle.includes('mota') || lowTitle.includes('bmw') || lowTitle.includes('audi') || lowTitle.includes('mercedes') || lowTitle.includes('volkswagen') || lowTitle.includes('pneu')) {
      if (category !== 'cars') setCategory('cars');
    } else if (lowTitle.includes('casa') || lowTitle.includes('apartamento') || lowTitle.includes('quarto') || lowTitle.includes('t1') || lowTitle.includes('t2') || lowTitle.includes('t3')) {
      if (category !== 'property') setCategory('property');
    } else if (lowTitle.includes('iphone') || lowTitle.includes('samsung') || lowTitle.includes('portátil') || lowTitle.includes('telemóvel') || lowTitle.includes('pc') || lowTitle.includes('computador')) {
      if (category !== 'electronics') setCategory('electronics');
    } else if (lowTitle.includes('camisola') || lowTitle.includes('sapato') || lowTitle.includes('calça') || lowTitle.includes('ténis') || lowTitle.includes('vestido')) {
      if (category !== 'fashion') setCategory('fashion');
    }
  }, [title]);
  const [adCount, setAdCount] = useState(0);
  const [promotion, setPromotion] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const highlights = [
    { id: 'top', label: t('promotions.top'), price: 4.99, icon: ArrowLeft, desc: t('promotions.topDesc'), color: 'bg-primary' },
    { id: 'urgent', label: t('promotions.urgent'), price: 2.99, icon: Zap, desc: t('promotions.urgentDesc'), color: 'bg-error' },
    { id: 'premium', label: t('promotions.premium'), price: 9.99, icon: Star, desc: t('promotions.premiumDesc'), color: 'bg-tertiary' },
    { id: 'bump', label: t('promotions.bump'), price: 0.99, icon: TrendingUp, desc: t('promotions.bumpDesc'), color: 'bg-on-surface' }
  ];

  useEffect(() => {
    if (user) {
      // Mock ad count check
      setAdCount(1); // User has 1 ad
    }
  }, [user]);

  const categoryKeys = [
    'cars', 'property', 'electronics', 'fashion', 
    'home', 'gaming', 'automotive', 'hobbies', 
    'sports', 'services', 'others'
  ];

  const categoryIcons: Record<string, string> = {
    cars: '🚗',
    property: '🏠',
    electronics: '💻',
    fashion: '👕',
    home: '🛋️',
    gaming: '🎮',
    automotive: '🔧',
    hobbies: '🎨',
    sports: '⚽',
    services: '🛠️',
    others: '📦'
  };

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'EUR': return '€';
      case 'BRL': return 'R$';
      default: return '$';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      filesArray.forEach((file: File) => {
        if (images.length < 10) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImages(prev => {
              if (prev.length < 10) {
                return [...prev, reader.result as string];
              }
              return prev;
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleGeolocation = () => {
    setGettingLocation(true);
    if (!navigator.geolocation) {
      showToast(t('error.geolocationNotSupported') || 'Geolocalização não suportada', 'error');
      setGettingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationName(`Local(${latitude.toFixed(2)}, ${longitude.toFixed(2)})`);
        setGettingLocation(false);
        setIsRegionModalOpen(false);
        showToast('Localização obtida!');
      },
      (error) => {
        showToast(t('error.obtainingLocation') || 'Erro ao obter localização', 'error');
        setGettingLocation(false);
      }
    );
  };

  const isFormValid = title && price && description && images.length > 0 && category;

  const [fairPriceStatus, setFairPriceStatus] = useState<'below' | 'within' | 'above' | ''>('');
  const [fairPriceReason, setFairPriceReason] = useState('');

  const handlePriceBlur = async () => {
    if (!price || !title || !category) return;
    try {
      const data = await analyzePrice(title, category, parseFloat(price), { brand, model, year, km, area, propertyType });
      setFairPriceStatus(data.status);
      setFairPriceReason(data.reasoning);
    } catch (err) {
      console.error('Price analysis error', err);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const planType = profile?.plan_type || 'free';
    const limits = { free: 2, basic: 20, pro: Infinity, premium: Infinity };
    const maxAds = limits[planType as keyof typeof limits] || 2;

    if (adCount >= maxAds) {
      const confirmUpgrade = window.confirm(t('listing.limitReached', { max: maxAds, plan: planType }));
      if (confirmUpgrade) {
        navigate('/plans');
      }
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert({
          title,
          description,
          price: parseFloat(price),
          category,
          location: locationName || 'Portugal',
          images,
          user_id: user.id,
          category_data: { brand, model, year, km, fuel, gearbox, propertyType, area, rooms, bathrooms },
          fair_price_status: fairPriceStatus,
          promotion_type: promotion || 'normal'
        })
        .select();

      if (error) throw error;
      
      if (promotion) {
        // Redirect to payment if needed
        navigate('/promote', { state: { listingId: data[0].id, type: promotion } });
      } else {
        navigate('/my-listings');
      }
    } catch (err) {
      console.error('Error creating listing:', err);
      showToast('Erro ao criar o anúncio.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-32">
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center px-6 h-16 border-b border-outline-variant/10">
        <button 
          onClick={() => goBack()}
          className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black font-headline text-primary tracking-tight">{t('common.sell')}</h1>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <form className="space-y-8">
          {/* Photo Upload Section */}
          <section>
            <h3 className="text-lg font-bold font-headline mb-4">{t('listing.photos')}</h3>
            <div className="grid grid-cols-3 gap-3">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <button 
                id="btn_add_photo"
                type="button"
                onClick={triggerFileInput}
                disabled={images.length >= 10}
                className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:border-primary hover:text-primary transition-all bg-surface-container-low/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera size={28} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{t('listing.addPhoto')}</span>
              </button>
              
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* Placeholders if less than 3 items to maintain grid structure */}
              {images.length < 2 && Array.from({ length: 2 - images.length }).map((_, i) => (
                <div key={`placeholder-${i}`} className="aspect-square rounded-2xl bg-surface-container-high/20 border border-outline-variant/5"></div>
              ))}
            </div>
            <p className="text-[10px] text-on-surface-variant mt-3 ml-1 uppercase tracking-widest font-bold opacity-60">
              {t('listing.photoLimit')}
            </p>
          </section>

          {/* Details Section */}
          <section className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold font-headline text-on-surface-variant ml-1">{t('listing.title')}</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('listing.titlePlaceholder')} 
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold font-headline text-on-surface-variant ml-1">{t('listing.price')}</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-primary">{getCurrencySymbol()}</span>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onBlur={handlePriceBlur}
                    placeholder="0.00" 
                    className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl py-4 pl-10 pr-5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold font-headline text-on-surface-variant ml-1">{t('listing.category')}</label>
                <button 
                  type="button" 
                  onClick={() => setShowCategoryModal(true)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl py-4 px-5 flex justify-between items-center text-on-surface-variant"
                >
                  <span>{category ? t(`categories.${category}`) : t('listing.select')}</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Category Specific Fields */}
            {category === 'cars' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-4 p-6 bg-surface-container-low/30 rounded-[2rem] border border-outline-variant/10"
              >
                <div className="col-span-2 flex items-center gap-2 mb-2">
                  <Car size={18} className="text-primary" />
                  <h4 className="font-black text-sm uppercase tracking-widest text-primary">{t('listing.vehicleDetails')}</h4>
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">{t('listing.brand')}</label>
                  <input type="text" value={brand} onChange={e => setBrand(e.target.value)} placeholder="Ex: BMW" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">{t('listing.model')}</label>
                  <input type="text" value={model} onChange={e => setModel(e.target.value)} placeholder="Ex: Serie 3" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">{t('listing.year')}</label>
                  <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="2024" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">{t('listing.kms')}</label>
                  <input type="number" value={km} onChange={e => setKm(e.target.value)} placeholder="0" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary transition-all" />
                </div>
              </motion.div>
            )}

            {category === 'property' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-4 p-6 bg-surface-container-low/30 rounded-[2rem] border border-outline-variant/10"
              >
                <div className="col-span-2 flex items-center gap-2 mb-2">
                  <Home size={18} className="text-primary" />
                  <h4 className="font-black text-sm uppercase tracking-widest text-primary">{t('listing.propertyDetails')}</h4>
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">{t('listing.type')}</label>
                  <select value={propertyType} onChange={e => setPropertyType(e.target.value)} className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary transition-all">
                    <option value="">{t('listing.select')}</option>
                    <option value="t0">{t('listing.propertyTypes.t0')}</option>
                    <option value="t1">{t('listing.propertyTypes.t1')}</option>
                    <option value="t2">{t('listing.propertyTypes.t2')}</option>
                    <option value="t3">{t('listing.propertyTypes.t3')}</option>
                    <option value="t4">{t('listing.propertyTypes.t4')}</option>
                  </select>
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">{t('listing.area')}</label>
                  <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="0" className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary transition-all" />
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold font-headline text-on-surface-variant ml-1">{t('listing.description')}</label>
              <textarea 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('listing.descriptionPlaceholder')} 
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
              />
            </div>
          </section>

          {/* Highlights Selection */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold font-headline">{t('listing.promotionHighlights')}</h3>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tighter">{t('listing.sellFaster')}</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {highlights.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setPromotion(promotion === h.id ? '' : h.id)}
                  className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all text-left ${
                    promotion === h.id ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10' : 'bg-surface-container-low/30 border-transparent hover:border-outline-variant/30'
                  }`}
                >
                  <div className={`w-12 h-12 ${h.color} text-white rounded-2xl flex items-center justify-center shrink-0`}>
                    <h.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{h.label}</p>
                    <p className="text-[10px] text-on-surface-variant font-medium leading-tight">{h.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-primary">{formatPrice(h.price)}</p>
                    <div className={`w-5 h-5 rounded-full border-2 mt-1 ml-auto flex items-center justify-center ${promotion === h.id ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
                      {promotion === h.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Location Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold font-headline">{t('listing.location')}</h3>
            <button 
              type="button" 
              onClick={() => setIsRegionModalOpen(true)}
              className="w-full bg-surface-container-low/50 rounded-2xl p-4 flex items-center gap-4 border border-outline-variant/10 hover:bg-surface-container-low transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {gettingLocation ? <Loader2 className="animate-spin" size={20} /> : <MapPin size={20} />}
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-sm">{locationName || t('listing.selectRegion')}</p>
                <p className="text-xs text-on-surface-variant font-medium">{t('listing.changeLocation')}</p>
              </div>
              <ChevronRight size={18} className="text-on-surface-variant" />
            </button>
          </section>

          {/* Submit Button */}
          <div className="pt-8">
            <button 
              id="btn_post_listing"
              type="button"
              disabled={!isFormValid || loading}
              onClick={handleSubmit}
              className={`w-full py-5 rounded-full font-headline font-bold text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                isFormValid 
                  ? 'signature-gradient text-white shadow-primary/20' 
                  : 'bg-surface-container-high text-on-surface-variant opacity-50 cursor-not-allowed'
              }`}
            >
              {loading && <Loader2 className="animate-spin" size={24} />}
              {loading ? t('listing.publishing') : t('listing.post')}
            </button>
            <p className="text-center text-xs text-on-surface-variant mt-4 px-8">
              {t('listing.guidelines', { 
                guidelines: t('listing.sellerGuidelines'), 
                terms: t('listing.termsOfService') 
              }).split('{guidelines}').map((part: string, i: number, arr: string[]) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <span className="text-primary font-bold">{t('listing.sellerGuidelines')}</span>}
                </span>
              )).flatMap((el: any, i: number) => {
                if (typeof el.props.children[0] === 'string' && el.props.children[0].includes('{terms}')) {
                  const parts = el.props.children[0].split('{terms}');
                  return [
                    <span key={`${i}-0`}>{parts[0]}</span>,
                    <span key={`${i}-1`} className="text-primary font-bold">{t('listing.termsOfService')}</span>,
                    <span key={`${i}-2`}>{parts[1]}</span>
                  ];
                }
                return el;
              })}
            </p>
          </div>
        </form>
      </main>

      {/* Category Selection Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowCategoryModal(false)}
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="relative w-full max-w-lg bg-surface rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="text-xl font-black font-headline text-primary">{t('listing.category')}</h3>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-6 grid grid-cols-2 gap-3">
              {categoryKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setCategory(key);
                    setShowCategoryModal(false);
                  }}
                  className={`p-4 rounded-3xl text-left transition-all flex flex-col items-center justify-center gap-2 border-2 ${
                    category === key 
                      ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/10' 
                      : 'bg-surface-container-low/50 border-transparent text-on-surface-variant hover:border-outline-variant/30'
                  }`}
                >
                  <span className="text-3xl mb-1">{categoryIcons[key] || '📦'}</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-center leading-tight">{t(`categories.${key}`)}</span>
                </button>
              ))}
            </div>
            <div className="p-6 bg-surface-container-low/30">
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="w-full py-4 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20"
              >
                {t('common.save')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <RegionSelector 
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        selectedRegion={locationName}
        onSelectRegion={(reg) => {
          setLocationName(reg);
        }}
        onGeolocate={handleGeolocation}
        isLocating={gettingLocation}
      />
    </div>
  );
}
