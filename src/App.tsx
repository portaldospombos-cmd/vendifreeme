import React, { useState } from 'react';
import { AppMode, PublicTab, AdminTab, Category, Market, LoginTarget, UserRole } from './types';
import { PROPERTIES, BOOKINGS, AMBASSADORS, ADMIN_STATS } from './data';
import { useAuth } from './components/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ListingsView } from './components/ListingsView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminListings } from './components/AdminListings';
import { AdminBookings } from './components/AdminBookings';
import { AmbassadorOS } from './components/AmbassadorOS';
import { LegalDoc } from './components/LegalDoc';
import { AmbassadorLanding } from './components/AmbassadorLanding';
import { LoginScreen } from './components/LoginScreen';
import { AmbassadorPanel } from './components/AmbassadorPanel';
import { UserPanel } from './components/UserPanel';
import { PricingPlans } from './components/PricingPlans';
import { AdminSystem } from './components/AdminSystem';
import { StrategicIntelligence } from './components/StrategicIntelligence';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { ContactModal } from './components/ContactModal';
import { AdminMessages } from './components/AdminMessages';
import { BotCommandCenter } from './components/BotCommandCenter';

const CATEGORY_TABS: PublicTab[] = ['villas', 'realestate', 'hotels', 'cars', 'yachts', 'jets', 'experiences'];

const App: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const [mode, setMode] = useState<AppMode>('public');
  const [market, setMarket] = useState<Market>('usvi');
  const [publicTab, setPublicTab] = useState<PublicTab>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [showTerms, setShowTerms] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [showAmbLanding, setShowAmbLanding] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [loginTarget, setLoginTarget] = useState<LoginTarget>(null);
  const [newsletterSubbed, setNewsletterSubbed] = useState(false);

  const marketProps = PROPERTIES.filter(p => p.market === market);
  const featuredProps = marketProps.filter(p => p.featured);

  function handleLoginClick(target: LoginTarget) {
    setLoginTarget(target);
  }

  function handleLoginSuccess(role: UserRole) {
    setLoginTarget(null);
    setMode(role as AppMode);
    if (role === 'admin' || role === 'seller') setAdminTab(role === 'admin' ? 'dashboard' : 'listings');
  }

  function handleLogout() {
    logout();
    setMode('public');
    setPublicTab('home');
  }

  function handleModeChange(newMode: AppMode) {
    if (newMode === 'public') {
      handleLogout();
    } else {
      handleLoginClick(newMode as LoginTarget);
    }
  }

  return (
    <div className="usvi-app">
      <Navbar
        mode={mode}
        publicTab={publicTab}
        currentUser={currentUser}
        onModeChange={handleModeChange}
        onTabChange={setPublicTab}
        onLogout={handleLogout}
      />

      {/* LOGIN MODAL */}
      {loginTarget && (
        <LoginScreen
          target={loginTarget}
          onClose={() => setLoginTarget(null)}
          onSuccess={handleLoginSuccess}
        />
      )}

      {/* PUBLIC VIEW */}
      {mode === 'public' && (
        <>
          {publicTab === 'home' && (
            <>
              <HeroBanner onTabChange={setPublicTab} />

              {/* Featured Ads Carousel */}
              <FeaturedCarousel properties={featuredProps} />

              {/* Market Switcher */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button
                  className={`btn-luxury ${market === 'usvi' ? 'active' : ''}`}
                  style={{ opacity: market === 'usvi' ? 1 : 0.5 }}
                  onClick={() => setMarket('usvi')}
                >
                  US Virgin Islands
                </button>
                <button
                  className={`btn-luxury ${market === 'polynesia' ? 'active' : ''}`}
                  style={{ opacity: market === 'polynesia' ? 1 : 0.5 }}
                  onClick={() => setMarket('polynesia')}
                >
                  French Polynesia
                </button>
              </div>

              {/* Category shortcuts */}
              <div className="category-bar">
                {[
                  { key: 'villas', label: 'Villas de Luxo' },
                  { key: 'realestate', label: 'Imobiliário' },
                  { key: 'hotels', label: 'Hotéis e Resorts' },
                  { key: 'cars', label: 'Viaturas de Prestígio' },
                ].map(c => (
                  <button
                    key={c.key}
                    className="category-btn"
                    onClick={() => setPublicTab(c.key as PublicTab)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Featured properties */}
              <ListingsView properties={featuredProps} />

              {/* Why Vendifree section */}
              <div className="why-us-section">
                <div className="why-us-header">
                  <div className="why-us-badge">Porque Vendifree</div>
                  <div className="why-us-title">A Plataforma Intermediária Líder</div>
                </div>
                <div className="features-grid">
                  {[
                    { icon: 'I', title: 'Plataforma Intermediária', desc: 'A Vendifree atua como intermediária neutral, facilitando o contacto entre anunciantes e interessados.' },
                    { icon: 'II', title: 'Publicação Gratuita', desc: 'Qualquer utilizador pode publicar anúncios gratuitamente, sem comissões sobre transações.' },
                    { icon: 'III', title: 'Conformidade Legal', desc: 'Operada em Portugal, em conformidade com o RGPD e a legislação de comércio eletrónico vigente.' },
                    { icon: 'IV', title: 'Alcance Global', desc: 'Audiência internacional com especial enfoque em mercados premium de ilhas e zonas costeiras.' },
                  ].map(f => (
                    <div key={f.title} className="feature-card">
                      <span className="feature-icon" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', fontWeight: 700 }}>{f.icon}</span>
                      <div className="feature-title">{f.title}</div>
                      <div className="feature-desc">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Plans */}
              <PricingPlans onPlanSelect={() => setShowAmbLanding(true)} />
            </>
          )}

          {CATEGORY_TABS.includes(publicTab) && (
            <ListingsView
              properties={marketProps}
              category={publicTab as Category}
            />
          )}

          {/* Newsletter Section */}
          <div className="why-us-section" style={{ background: 'rgba(201,168,76,0.03)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
              <div className="why-us-badge">Newsletter</div>
              <div className="why-us-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Receba Novos Anúncios em Primeira Mão</div>
              <p style={{ color: 'rgba(248,250,252,0.4)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Subscreva a nossa newsletter e receba os anúncios mais recentes antes de serem publicados ao público geral.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {newsletterSubbed ? (
                  <div style={{ flex: 1, padding: '0.75rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80', borderRadius: '4px', fontSize: '0.85rem' }}>
                    ✨ Subscrição efetuada com sucesso! Bem-vindo à rede Vendifree.
                  </div>
                ) : (
                  <>
                    <input type="email" placeholder="O seu e-mail" className="booking-input" style={{ flex: 1, margin: 0 }} />
                    <button className="btn-luxury" style={{ whiteSpace: 'nowrap' }} onClick={() => setNewsletterSubbed(true)}>Subscrever</button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="luxury-footer">
            <div className="footer-copy">
              © 2026 Vendifree. Todos os direitos reservados. Plataforma intermediária operada em Portugal.
            </div>
            <div className="footer-links">
              <button className="footer-link" onClick={() => setShowTerms(true)}>Termos e Condições</button>
              <button className="footer-link" onClick={() => setShowCookies(true)}>Política de Cookies</button>
              <button className="footer-link" onClick={() => setShowContact(true)}>Contacto</button>
              <button
                className="footer-link"
                style={{ color: 'var(--gold)' }}
                onClick={() => setShowAmbLanding(true)}
              >
                Programa de Embaixadores
              </button>
            </div>
          </footer>

          {showAmbLanding && <AmbassadorLanding onClose={() => setShowAmbLanding(false)} />}
          {showContact && <ContactModal onClose={() => setShowContact(false)} />}

          {showTerms && (
            <LegalDoc
              title="Termos e Condições da Vendifree"
              onClose={() => setShowTerms(false)}
              content={
                <>
                  <h3>1. Identificação e Natureza do Serviço</h3>
                  <p>A <strong>Vendifree</strong> é uma plataforma de classificados online que atua exclusivamente como <strong>intermediária neutral</strong> entre anunciantes e potenciais interessados. A Vendifree não é parte das transações celebradas entre utilizadores, não garante a veracidade, legalidade ou qualidade dos bens e serviços anunciados, nem assume qualquer responsabilidade pelas negociações realizadas fora da plataforma.</p>

                  <h3>2. Serviço Gratuito e Serviços Opcionais Pagos</h3>
                  <p>A publicação de anúncios na Vendifree é <strong>gratuita</strong> para todos os utilizadores. A plataforma disponibiliza adicionalmente serviços de promoção pagos e facultativos — designadamente "Destaque Semanal", "Destaque Quinzenal" e "Urgente" — que aumentam a visibilidade do anúncio. Estes serviços não condicionam a publicação base, que permanece gratuita.</p>

                  <h3>3. Regime Legal Aplicável</h3>
                  <p>Estes Termos e Condições regem-se pela legislação portuguesa, nomeadamente:</p>
                  <ul>
                    <li>Decreto-Lei n.º 7/2004, de 7 de janeiro — Comércio eletrónico</li>
                    <li>Decreto-Lei n.º 24/2014, de 14 de fevereiro — Contratos celebrados à distância</li>
                    <li>Lei n.º 58/2019, de 8 de agosto — RGPD (Proteção de Dados)</li>
                    <li>Segurança Industrial: Encriptação SSL/TLS e 2FA para contas staff.</li>
                  </ul>

                  <h3>4. Responsabilidade do Anunciante</h3>
                  <p>O utilizador que publica um anúncio é o único e exclusivo responsável pelo seu conteúdo, pela exatidão das informações prestadas e pela conformidade legal dos bens ou serviços anunciados. A Vendifree reserva-se o direito de remover anúncios que violem a lei ou as normas da plataforma.</p>

                  <h3>5. Resolução de Litígios</h3>
                  <p>Em caso de litígio de consumo, o utilizador pode recorrer a uma Entidade de Resolução Alternativa de Litígios de Consumo (RAL), em conformidade com a Lei n.º 144/2015, de 8 de setembro. Consulte o portal <strong>www.consumidor.gov.pt</strong> para mais informações.</p>

                  <h3>6. Alterações aos Termos</h3>
                  <p>A Vendifree reserva-se o direito de atualizar estes Termos. As alterações serão publicadas nesta página com a respetiva data de entrada em vigor.</p>
                </>
              }
            />
          )}

          {showCookies && (
            <LegalDoc
              title="Política de Privacidade e Cookies — Vendifree"
              onClose={() => setShowCookies(false)}
              content={
                <>
                  <h3>1. Responsável pelo Tratamento</h3>
                  <p>A <strong>Vendifree</strong>, operada em Portugal, é responsável pelo tratamento de dados pessoais recolhidos nesta plataforma, em conformidade com o <strong>Regulamento (UE) 2016/679 (RGPD)</strong> e a Lei n.º 58/2019, de 8 de agosto.</p>

                  <h3>2. Dados Recolhidos e Finalidades</h3>
                  <p>Recolhemos apenas os dados estritamente necessários para a prestação do serviço (e.g., endereço de e-mail para subscrição de newsletter ou criação de conta). Os dados não são partilhados com terceiros para fins comerciais sem consentimento expresso.</p>

                  <h3>3. Cookies Utilizados</h3>
                  <p><strong>Cookies estritamente necessários</strong>: indispensáveis ao funcionamento técnico da plataforma (sessão, preferências de idioma). Não requerem consentimento.</p>
                  <p><strong>Cookies analíticos</strong>: utilizados para medir o tráfego e melhorar a experiência — apenas com o seu consentimento explícito.</p>

                  <h3>4. Direitos dos Titulares</h3>
                  <p>Ao abrigo do RGPD, tem direito a aceder, retificar, apagar, portar e opor-se ao tratamento dos seus dados. Para exercer estes direitos, contacte: <strong>privacidade@vendifree.com</strong>.</p>

                  <h3>5. Retenção de Dados</h3>
                  <p>Os dados são conservados pelo período mínimo necessário ao cumprimento das finalidades ou até ao exercício do direito de apagamento, salvo obrigação legal de conservação.</p>

                  <h3>6. Autoridade de Supervisão</h3>
                  <p>Tem direito a apresentar reclamação junto da <strong>Comissão Nacional de Proteção de Dados (CNPD)</strong> — www.cnpd.pt.</p>
                </>
              }
            />
          )}
        </>
      )}

      {/* ADMIN & SELLER VIEW */}
      {(mode === 'admin' || mode === 'seller') && (currentUser?.role === 'admin' || currentUser?.role === 'seller') && (
        <div className="admin-layout">
          <div className="admin-sidebar">
            <div className="admin-sidebar-title">Vendifree {currentUser.role === 'admin' ? 'Gestão' : 'Vendas'}</div>
            {[
              { key: 'dashboard', label: 'Dashboard', roles: ['admin'] },
              { key: 'listings', label: 'Anúncios', roles: ['admin', 'seller'] },
              { key: 'bookings', label: 'Reservas', roles: ['admin', 'seller'] },
              { key: 'ambassadors', label: 'AmbassadorOS', roles: ['admin'] },
              { key: 'messages', label: 'Mensagens', roles: ['admin'] },
              { key: 'synergy', label: 'Sinergia Bot', roles: ['admin'] },
              { key: 'system', label: 'Infraestrutura', roles: ['admin'] },
              { key: 'intelligence', label: 'Inteligência', roles: ['admin'] },
            ].filter(item => item.roles.includes(currentUser.role)).map(item => (
              <button
                key={item.key}
                className={`admin-nav-item ${adminTab === item.key ? 'active' : ''}`}
                onClick={() => setAdminTab(item.key as AdminTab)}
              >
                <span>{item.label}</span>
              </button>
            ))}

            <div className="sidebar-divider" />
            <div className="admin-sidebar-title">Resumo Mercado</div>
            <div className="sidebar-stats">
              <div className="sidebar-stat-item">
                <div className="sidebar-stat-label">Receita MTD</div>
                <div className="sidebar-stat-value">€{(ADMIN_STATS.monthlyRevenue / 1000).toFixed(0)}K</div>
              </div>
              <div className="sidebar-stat-item">
                <div className="sidebar-stat-label">Propostas Ativas</div>
                <div className="sidebar-stat-value">{ADMIN_STATS.pendingProposals}</div>
              </div>
              <div className="sidebar-stat-item">
                <div className="sidebar-stat-label">Embaixadores</div>
                <div className="sidebar-stat-value">{AMBASSADORS.length} ativos</div>
              </div>
            </div>
          </div>

          <div className="admin-content">
            {adminTab === 'dashboard' && currentUser.role === 'admin' && <AdminDashboard stats={ADMIN_STATS} recentBookings={BOOKINGS} />}
            {adminTab === 'listings' && <AdminListings properties={PROPERTIES} />}
            {adminTab === 'bookings' && <AdminBookings bookings={BOOKINGS} />}
            {adminTab === 'ambassadors' && currentUser.role === 'admin' && <AmbassadorOS ambassadors={AMBASSADORS} />}
            {adminTab === 'system' && currentUser.role === 'admin' && <AdminSystem />}
            {adminTab === 'intelligence' && currentUser.role === 'admin' && <StrategicIntelligence />}
            {adminTab === 'synergy' && currentUser.role === 'admin' && <BotCommandCenter />}
            {adminTab === 'messages' && currentUser.role === 'admin' && <AdminMessages />}
            {adminTab === 'dashboard' && currentUser.role === 'seller' && (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Seja bem-vindo, Vendedor</h2>
                <p>Utilize o menu lateral para gerir os seus ativos e propostas.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AMBASSADOR VIEW */}
      {mode === 'ambassador' && currentUser?.role === 'ambassador' && (
        <AmbassadorPanel />
      )}

      {/* USER VIEW */}
      {mode === 'user' && currentUser?.role === 'user' && (
        <UserPanel />
      )}
    </div>
  );
};
export default App;
