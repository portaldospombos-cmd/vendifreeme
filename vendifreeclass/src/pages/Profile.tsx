import React, { useRef } from 'react';
import { Settings, ChevronRight, Package, Heart, Star, Shield, LogOut, CreditCard, Globe, Coins, Share2, Users } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';

export default function Profile() {
  const navigate = useNavigate();
  const { language, setLanguage, currency, setCurrency, t } = useSettings();
  const { user, profile, logout } = useAuth();
  const { showToast } = useAdmin();
  const settingsRef = useRef<HTMLElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const scrollToSettings = () => {
    settingsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const menuItems = [
    { icon: Package, label: t('profile.myListings'), count: user ? 12 : 0, path: '/my-listings', requiresAuth: true },
    { icon: Users, label: 'Embaixador Vendifree', path: '/ambassador', requiresAuth: false },
    { icon: Heart, label: t('profile.favorites'), count: user ? 24 : 0, path: '/favorites', requiresAuth: true },
    { icon: Shield, label: t('profile.security'), path: '/privacy', requiresAuth: false },
    ...(profile?.plan_type === 'premium' ? [{ icon: Star, label: 'A Minha Loja', path: `/store/${user?.id}`, requiresAuth: true }] : [])
  ];

  return (
    <div className="bg-background min-h-screen pb-32">
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex justify-between items-center px-6 h-16">
        <h1 className="text-xl font-black font-headline text-primary tracking-tight">{t('common.profile')}</h1>
        <button 
          onClick={scrollToSettings}
          className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors"
        >
          <Settings size={24} />
        </button>
      </header>
      
      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Profile Header */}
        <section className="flex flex-col items-center mb-10">
          <div className="relative mb-4 group">
            <div className="absolute inset-0 signature-gradient rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img 
              src={user?.user_metadata?.avatar_url || "https://picsum.photos/seed/user/200/200"} 
              alt="User" 
              className="relative z-10 w-28 h-28 rounded-full border-4 border-surface-container-lowest object-cover shadow-lg" 
            />
            {user && (
              <button className="absolute bottom-0 right-0 z-20 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform">
                <Star size={16} fill="currentColor" />
              </button>
            )}
          </div>
          
          {user ? (
            <>
              <h2 className="text-2xl font-black font-headline text-on-surface mb-1">{user?.user_metadata?.full_name || "Utilizador Vendifree"}</h2>
              <p className="text-on-surface-variant text-sm font-medium mb-4">{user?.email}</p>
              
              <button 
                onClick={() => navigate('/profile/edit')}
                className="mb-8 px-6 py-2 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-colors active:scale-95"
              >
                {t('profile.editProfile')}
              </button>

              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-xl font-black text-primary">4.9</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Rating</p>
                </div>
                <div className="h-8 w-[1px] bg-outline-variant/30 self-center"></div>
                <div className="text-center">
                  <p className="text-xl font-black text-primary">12</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Sales</p>
                </div>
                <div className="h-8 w-[1px] bg-outline-variant/30 self-center"></div>
                <div className="text-center">
                  <p className="text-xl font-black text-primary">156</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Followers</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-black font-headline text-on-surface mb-4">Bem-vindo à Vendifree</h2>
              <button 
                onClick={() => navigate('/login')}
                className="mb-8 px-10 py-3 bg-primary text-white font-black rounded-full hover:bg-primary/90 shadow-lg active:scale-95 transition-all"
              >
                Fazer Login / Registar
              </button>
            </>
          )}
        </section>

        {/* Professional Plans Card */}
        <section className="mb-10">
          <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-6 relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Shield className="text-primary" size={24} />
                  <h3 className="text-lg font-black font-headline text-primary">
                    {profile?.plan_type && profile.plan_type !== 'free' ? `Conta Profissional: ${profile.plan_type.toUpperCase()}` : 'Conta Profissional'}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant font-medium mb-6 leading-relaxed">
                Stands, Imobiliárias e Empresas: tenham anúncios ilimitados, destaques automáticos e uma página de loja personalizada.
              </p>
              <button 
                onClick={() => navigate('/plans')}
                className="w-full py-4 signature-gradient text-white font-black rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-transform"
              >
                Ver Planos Mensais
              </button>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section className="space-y-3">
          {menuItems.map((item, i) => (
            <button 
              key={i}
              onClick={() => {
                if (!user && item.requiresAuth) {
                  navigate('/login');
                } else {
                  navigate(item.path);
                }
              }}
              className="w-full bg-surface-container-lowest rounded-2xl p-4 flex items-center gap-4 border border-outline-variant/10 hover:bg-surface-container-low transition-all active:scale-[0.99] group shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <item.icon size={20} />
              </div>
              <span className="flex-1 text-left font-bold font-headline text-on-surface">{item.label}</span>
              {user && item.count !== undefined && (
                <span className="bg-surface-container-high text-on-surface-variant text-[10px] font-black px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
              <ChevronRight size={18} className="text-outline-variant" />
            </button>
          ))}
        </section>

        {/* Settings Section */}
        <section ref={settingsRef} className="mt-10 space-y-6">
          <h3 className="text-sm font-black font-headline uppercase tracking-widest text-on-surface-variant px-1">{t('profile.settings')}</h3>
          
          <div className="space-y-3">
            {/* Language Selector */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 flex items-center gap-4 border border-outline-variant/10 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-tertiary/5 flex items-center justify-center text-tertiary">
                <Globe size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold font-headline text-on-surface text-sm">{t('profile.language')}</p>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-surface-container-low border-none rounded-lg text-xs font-bold px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>

            {/* Currency Selector */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 flex items-center gap-4 border border-outline-variant/10 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-secondary-container/10 text-on-secondary-container flex items-center justify-center">
                <Coins size={20} />
              </div>
              <div className="flex-1">
                <p className="font-bold font-headline text-on-surface text-sm">{t('profile.currency')}</p>
              </div>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="bg-surface-container-low border-none rounded-lg text-xs font-bold px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="BRL">BRL (R$)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Logout Button */}
        {user && (
          <section className="mt-12">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-4 text-error font-bold font-headline hover:bg-error/5 rounded-2xl transition-colors"
            >
              <LogOut size={20} />
              {t('profile.logout')}
            </button>
          </section>
        )}
        
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 mt-8">
          Vendifree v1.0.4 • Made with love
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
