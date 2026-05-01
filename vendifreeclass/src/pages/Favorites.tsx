import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { ArrowLeft, Heart, MapPin } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useSettings } from '../contexts/SettingsContext';
import { useFavorites } from '../contexts/FavoritesContext';

const allItems = [
  {
    id: 1,
    title: 'Studio Master Pro-X',
    price: 299,
    location: 'San Francisco, CA',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmHKyTEC4d0SMZTDaSnHwE58JwpfWLScnTAZOMNVJw-Zfp3E_lGEqUBSxUps-HK66sysF7z8xvbYgTb5q1nyuMj__OfaipXshIvOvKCLdtrtglFWNQfUEXxybL8k96x-YaxmSiwugLWUK1FTtmG3m75CxIVQzYcFDQdU9o0vkfrXwngfH97vi3PaWiRADXZqAnOXHutmmyo1BAZiKK9ywzcIf5BRGtBw7KQteAohg3wm7_3B7CY9z_FyyYupefvPPRlXO2o6hT2Z8x',
  },
  {
    id: 2,
    title: 'SpeedRunner Red Edition',
    price: 85,
    location: 'Austin, TX',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClRaWQ6mdxHLGa168jLDEjRnfnonXxU-yyqbO6Fu_xrrjVI8H_2pNmikDqKA4SkwP-ITv8zXLGIytLu6jXtNH90N6f9aPbfLBClYukfdd08hd9vW0lMo18puXgY2YwryS9jzZFXfQnvXV-8O7Q_lbHPHoclQZJ52PuyTkQcDyKvfjB-gQxgsONH6dvUn4bhVluSnaBEa3o9H67bXHPl3o0bTRYonSP3kiZxzI6AmiUUBRgcj7jIUAqy4_2nOGnz8LSJRKTx7O-sTAe',
  },
  {
    id: 3,
    title: 'Aero Minimalist Watch',
    price: 120,
    location: 'New York, NY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD36mCSfHnIjtSgvvBVGHiBItEsSnp8CftJMHCZfAWZ2nxl1BoZrrg9j9j_5hcvE0Q7MNU5SIZ4y77-u_ZHxEvF5y1EQGBAJQ3g-Qu73N5z7HrSOxd10FwqYyetU49pi22NNjV1qzpyLr2QUZGBRxEaEYtYKcAVfOleRs6l5KpPwQFRc-A7VKcLUWSOyTVcKkrkuFweIwCGCyAUacye8Qz1VcJn58g2ntYDf-q_ku0Nypsh3xtj7VuxmMlrSFUPs4f-GF-EaqlL0bPG',
  },
  {
    id: 4,
    title: 'Sleek Phone 12',
    price: 450,
    location: 'Chicago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeGOdmBOkX3SeoB4_gfoTlkZnDyA7PbySdG6jee3hx2mhphq93P2lIoja4W7q16nArwagQUqsUt7RMSk7WXw4D_IaWxRcmxNMxMrQa53mKGXZoT5ccqFT_zunJuHLH7JnFN7mda1apmOo1z9h5jF4DL_qOUvkArKyDSnNiY-M0Hl3o_3VS_jOdaUNNerhHQlJf8p4z89I8A6CbNB0fkX0yQrgKSrYehJzbS2XbWmfDxdPDtyw_jDegcKYISap2dZmWtHYuyR3PLOBC',
  },
  {
    id: 5,
    title: 'Adventure Boots',
    price: 65,
    location: 'Portland',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOfPgXHlcFP__cqNZAaW0ETOy2fu-zAexKnedgGwO9P_EFhTHGfB-m9x_p0p7JcIO9WxR8KFsaIuFixaT5ULiVgLOpJM6HcrvmtS6D-F33G5p2C6aQj7e0OH0Or-DrO_RZzVMEO18aIVBe23h8Q6RqxYdyvYzMo7P2UZtALllO9E-AS9J7iLR3wN7Fz2O0XWeeNFxOBQyByO6GR6qjDBxlmlEmHN8yqJbfm0eSyScsP_Ye1w7dGGItPc2IMsrIIVVhpm_crxVosJpJ',
  }
];

export default function Favorites() {
  const goBack = useBackNavigation();
  const navigate = useNavigate();
  const { t, formatPrice } = useSettings();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const favoriteItems = allItems.filter(item => favorites.includes(item.id));

  return (
    <div className="bg-background min-h-screen pb-32">
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center px-6 h-16 gap-4">
        <button onClick={() => goBack()} className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black font-headline text-primary tracking-tight">{t('profile.favorites')}</h1>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {favoriteItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {favoriteItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/product/${item.id}`)}
                className="bg-surface-container-low/50 rounded-2xl p-2 group cursor-pointer hover:bg-surface-container-low transition-colors"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-3 relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                    className={`absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center active:scale-90 transition-transform ${isFavorite(item.id) ? 'text-error' : 'text-primary'}`}
                  >
                    <Heart size={14} fill={isFavorite(item.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="px-1">
                  <span className="text-primary font-black">{formatPrice(item.price)}</span>
                  <h5 className="text-sm font-bold font-headline truncate">{item.title}</h5>
                  <p className="text-[10px] text-on-surface-variant">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center text-outline-variant mb-4">
              <Heart size={40} />
            </div>
            <h2 className="text-xl font-bold font-headline text-on-surface mb-2">Ainda não tens favoritos</h2>
            <p className="text-on-surface-variant text-sm max-w-xs">Guarda os artigos que mais gostas para os encontrares facilmente mais tarde.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-8 px-8 py-3 signature-gradient text-white font-bold rounded-full shadow-lg active:scale-95 transition-transform"
            >
              Explorar Artigos
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
