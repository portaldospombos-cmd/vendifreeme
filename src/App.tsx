import React, { useState } from 'react';
// 1. Importa os componentes de controlo do Clerk
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

import { AppMode, PublicTab, Category, Market, LoginTarget } from './types';
import { PROPERTIES } from './data';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ListingsView } from './components/ListingsView';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { PricingPlans } from './components/PricingPlans';
import { AdminDashboard } from './components/AdminDashboard';

// NOTA: Removemos o useAuth antigo e o LoginScreen manual para evitar conflitos
const CATEGORY_TABS: PublicTab[] = ['villas', 'realestate', 'hotels', 'cars', 'yachts', 'jets', 'experiences'];

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('public');
  const [market, setMarket] = useState<Market>('usvi');
  const [publicTab, setPublicTab] = useState<PublicTab>('home');
  const [newsletterSubbed, setNewsletterSubbed] = useState(false);

  const marketProps = PROPERTIES.filter(p => p.market === market);
  const featuredProps = marketProps.filter(p => p.featured);

  function handleLogout() {
    setMode('public');
    setPublicTab('home');
  }

  return (
    <div className="usvi-app">
      {/* NAVBAR REFINADA COM CLERK */}
      <Navbar
        mode={mode}
        publicTab={publicTab}
        onModeChange={setMode}
        onTabChange={setPublicTab}
        onLogout={handleLogout}
      />

      {/* LOGIN VIA CLERK (Substitui o LoginScreen antigo) */}
      <SignedOut>
        {/* Se o modo não for público e não houver login, forçamos o botão ou modal */}
        {mode !== 'public' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
            <h2 className="text-2xl mb-4 font-serif">Acesso Restrito ao Paraíso</h2>
            <SignInButton mode="modal">
              <button className="btn-luxury px-8 py-3 bg-[#c9a84c] text-black font-bold rounded">
                Entrar com Google / Email
              </button>
            </SignInButton>
          </div>
        )}
      </SignedOut>

      {/* PUBLIC VIEW */}
      {mode === 'public' && (
        <>
          {publicTab === 'home' && (
            <>
              <HeroBanner onTabChange={setPublicTab} />
              <FeaturedCarousel properties={featuredProps} />

              {/* SELETOR DE MERCADO (USVI / POLINÉSIA) */}
              <div className="flex justify-center gap-4 mt-8 mb-8">
                <button
                  className={`btn-luxury ${market === 'usvi' ? 'active' : ''}`}
                  onClick={() => setMarket('usvi')}
                  style={{ opacity: market === 'usvi' ? 1 : 0.5 }}
                >
                  US Virgin Islands
                </button>
                <button
                  className={`btn-luxury ${market === 'polynesia' ? 'active' : ''}`}
                  onClick={() => setMarket('polynesia')}
                  style={{ opacity: market === 'polynesia' ? 1 : 0.5 }}
                >
                  French Polynesia (Taiti)
                </button>
              </div>

              {/* CATEGORIAS */}
              <div className="category-bar flex justify-center gap-2 overflow-x-auto p-4">
                {CATEGORY_TABS.map(tab => (
                  <button
                    key={tab}
                    className={`category-btn px-4 py-2 text-white border border-white/10 rounded ${publicTab === tab ? 'bg-white/20' : ''}`}
                    onClick={() => setPublicTab(tab)}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              <ListingsView properties={featuredProps} />
              
              <div className="my-20">
                <PricingPlans onPlanSelect={() => {}} />
              </div>
            </>
          )}

          {CATEGORY_TABS.includes(publicTab) && (
            <ListingsView
              properties={marketProps}
              category={publicTab as Category}
            />
          )}
        </>
      )}

      {/* ADMIN / SELLER VIEWS (Protegidas pelo Clerk) */}
      {mode !== 'public' && (
        <SignedIn>
          <div className="admin-container p-8">
            <h1 className="text-[#c9a84c] text-3xl font-serif mb-6 uppercase tracking-widest">
              Painel {mode === 'admin' ? 'Administrativo' : 'Vendedor'}
            </h1>
            {mode === 'admin' ? <AdminDashboard /> : <div className="text-white">Carregando Gestão de Imóveis...</div>}
          </div>
        </SignedIn>
      )}

      {/* FOOTER / NEWSLETTER SIMPLES */}
      <footer className="p-20 text-center border-t border-white/10 bg-black/50">
          <p className="text-white/40 text-xs tracking-widest uppercase">© 2024 Vendifree Luxury Marketplace</p>
      </footer>
    </div>
  );
};

export default App;

