import React, { useState } from 'react';
import { AmbassadorTab, SaaSTier, ServiceUnlock } from '../types';
import { useAuth } from './AuthContext';
import { AMBASSADORS, BOOKINGS, HNW_LEADS, SERVICE_ADDONS } from '../data';
import { UpsellEngine } from './UpsellEngine';

const TIER_COMMISSIONS = {
  Starter: 0.10,
  Silver: 0.15,
  Gold: 0.20,
  Platinum: 0.25,
  Elite: 0.30,
};

const PLATFORM_FEE = 0.02; // Global platform safety margin
const CONCIERGE_COMMISSION = 0.065; // 6.5% for Yachts, Jets, Experiences

const VENDIFREE_RATES = {
  ads: { avgValue: 30 },
  urgent: { avgValue: 39 },
  subscriptions: { avgValue: 199 },
  concierge: { avgValue: 5000 }, // Average commissionable volume per concierge lead
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Novo Lead',
  awaiting_bot_review: 'Em Análise (Bots)',
  awaiting_admin_approval: 'Aguardando Admin',
  contacted: 'Contactado',
  interested: 'Pendente Admissão',
  active: 'Parceiro Ativo',
  rejected: 'Recusado',
};

import { AssetUpload } from './AssetUpload';
import { AmbassadorProgress } from './AmbassadorProgress';
import { PROPERTIES } from '../data';

export const AmbassadorPanel: React.FC = () => {
  const { currentUser } = useAuth();
  const [tab, setTab] = useState<AmbassadorTab>('amb-dashboard');
  const [showUpload, setShowUpload] = useState(false);

  const myEarnings = 12500;
  
  const handleUploadSuccess = (newAsset: any) => {
    alert(`Sucesso! O embaixador carregou "${newAsset.title}". O ativo será revisto pela Vendifree.`);
    setTab('amb-listings');
    setShowUpload(false);
  };

  const [properties, setProperties] = useState(PROPERTIES);

  const activateHighlight = (id: string) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, featured: true } : p));
    alert('Destaque ativado com sucesso!');
  };

  const ambassador = AMBASSADORS.find(a => a.id === currentUser?.ambassadorId);
  const myProperties = properties.filter(p => p.ambassadorId === currentUser?.ambassadorId);
  const myReferrals = BOOKINGS.filter(b => b.ambassadorId === currentUser?.ambassadorId);

  const [saasTier, setSaasTier] = useState<SaaSTier>('Explorer');
  const [unlocks, setUnlocks] = useState<ServiceUnlock[]>([
    { id: 'pof1', title: 'PoF as a Service', description: 'Validação de liquidez para lead VIP', fee: 250, status: 'locked' },
    { id: 'hidden1', title: 'Unlock Secret Villa', description: 'Acesso a ativo Off-Market', fee: 500, status: 'locked' }
  ]);
  const [hnwLeads, setHnwLeads] = useState(HNW_LEADS);

  // Calc state - we use these generic states for the simulation sliders
  const [villas, setVillas] = useState(2);        // Used for "Destaques" slider
  const [hotelBookings, setHotelBookings] = useState(3); // Used for "Urgentes" slider
  const [carRentals, setCarRentals] = useState(5);    // Used for "Empresa" slider
  const [conciergeLeads, setConciergeLeads] = useState(2); // New slider for Yachts/Jets/Exp

  const currentCommission = TIER_COMMISSIONS[ambassador?.tier || 'Starter'];

  const usviMonthly =
    ((villas * VENDIFREE_RATES.ads.avgValue +
    hotelBookings * VENDIFREE_RATES.urgent.avgValue +
    carRentals * VENDIFREE_RATES.subscriptions.avgValue) * (currentCommission - PLATFORM_FEE)) +
    (conciergeLeads * VENDIFREE_RATES.concierge.avgValue * CONCIERGE_COMMISSION);

  const isElite = ambassador?.status === 'active';

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-title">Vendifree Work</div>
        {[
          { key: 'amb-dashboard', label: 'Dashboard' },
          { key: 'amb-earnings', label: 'Calculadora de Ganhos' },
          { key: 'amb-listings', label: '✦ Publicar Anúncio' },
          { key: 'amb-services', label: 'Planos & Serviços' },
          { key: 'amb-highlights', label: 'Destaques' },
          { key: 'amb-saas', label: 'SaaS & Performance' },
          { key: 'amb-manifesto', label: 'O Manifesto' },
          { key: 'amb-profile', label: 'O Meu Perfil' },
        ].map(item => (
          <button
            key={item.key}
            className={`admin-nav-item ${tab === item.key ? 'active' : ''}`}
            onClick={() => setTab(item.key as AmbassadorTab)}
          >
            <span>{item.label}</span>
          </button>
        ))}
        {/* ... existing sidebar stats ... */}
      </div>

      <div className="admin-content">
        {!isElite && (
          <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⏳</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.85rem' }}>Candidatura em Avaliação Estratégica</div>
              <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: '0.75rem', margin: '0.2rem 0' }}>
                Pode começar a publicar livremente. Os nossos agentes (Versus e Vénus) estão a avaliar o seu perfil para o programa **Elite Partner (30% comissão)**.
              </p>
            </div>
            <div style={{ background: 'rgba(201,168,76,0.2)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.65rem', color: 'var(--gold)', fontWeight: 700 }}>
              ESTADO: {ambassador?.status ? STATUS_LABELS[ambassador.status] : 'Candidato'}
            </div>
          </div>
        )}

        {ambassador && (
          <>
            <div className="sidebar-divider" />
            <div className="admin-sidebar-title">Resumo</div>
            <div className="sidebar-stats">
              <div className="sidebar-stat-item">
                <div className="sidebar-stat-label">Ganhos/Mês</div>
                <div className="sidebar-stat-value">€{ambassador.monthlyEarnings?.toLocaleString() || '0'}</div>
              </div>
              <div className="sidebar-stat-item">
                <div className="sidebar-stat-label">Score</div>
                <div className="sidebar-stat-value">{ambassador.fitScore}</div>
              </div>
              <div className="sidebar-stat-item">
                <div className="sidebar-stat-label">Referências</div>
                <div className="sidebar-stat-value">{myReferrals.length}</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="admin-content">
        {/* DASHBOARD */}
        {tab === 'amb-dashboard' && (
          <div>
            <div className="admin-page-title">Bem-vindo, {currentUser?.name}</div>
            <div className="admin-page-sub">O seu painel pessoal Vendifree</div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Ganhos Mensais</div>
                <div className="stat-value">€{ambassador?.monthlyEarnings?.toLocaleString() || '0'}</div>
                <div className="stat-sub">Comissão até 30%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Referências</div>
                <div className="stat-value">{myReferrals.length}</div>
                <div className="stat-sub">Volume total</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Performance</div>
                <div className="stat-value">{ambassador?.tier || 'Starter'}</div>
                <div className="stat-sub">Ranking atual</div>
              </div>
              <div className="stat-card" style={{ gridColumn: 'span 2' }}>
                <AmbassadorProgress 
                  tier={ambassador?.tier || 'Starter'} 
                  totalVolume={ambassador?.totalVolumeGenerated || 0} 
                />
              </div>
              <div className="stat-card">
                <div className="stat-label">Território</div>
                <div className="stat-value" style={{ fontSize: '1rem' }}>{ambassador?.territory || '—'}</div>
                <div className="stat-sub">{ambassador?.niche}</div>
              </div>
            </div>

            {/* My Referrals */}
            <div className="dash-card" style={{ marginTop: '1.5rem' }}>
              <div className="dash-card-title">Atividade Recente</div>
              {myReferrals.length === 0 ? (
                <div style={{ color: 'rgba(248,250,252,0.4)', fontSize: '0.85rem', padding: '1rem 0' }}>
                  Ainda não tem referências ativas. Partilhe o seu link para começar a ganhar.
                </div>
              ) : (
                myReferrals.map(booking => (
                  <div key={booking.id} className="booking-item">
                    <div>
                      <div className="booking-guest">{booking.guestName}</div>
                      <div className="booking-prop">{booking.propertyTitle} · {booking.checkIn}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="booking-amount">
                        €{(booking.totalPrice * currentCommission).toLocaleString()}
                        <span style={{ fontSize: '0.6rem', color: 'rgba(248,250,252,0.4)' }}> comissão ({Math.round(currentCommission * 100)}%)</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* EARNINGS CALCULATOR */}
        {tab === 'amb-earnings' && (
          <div>
            <div className="admin-page-title">Calculadora Vendifree</div>
            <div className="admin-page-sub">Simule os seus ganhos mensais com a venda de publicidade premium</div>

            <div className="calc-section">
              <div className="calc-card">
                <div className="calc-title">Volume Mensal Estimado</div>
                {[
                  { label: 'Anúncios com Destaque', value: villas, set: setVillas, max: 100, hint: `${Math.round((currentCommission - PLATFORM_FEE) * 100)}% líq.` },
                  { label: 'Anúncios Urgentes', value: hotelBookings, set: setHotelBookings, max: 50, hint: `${Math.round((currentCommission - PLATFORM_FEE) * 100)}% líq.` },
                  { label: 'Subscrições Empresa', value: carRentals, set: setCarRentals, max: 20, hint: `${Math.round((currentCommission - PLATFORM_FEE) * 100)}% líq.` },
                  { label: 'Serviços Concierge (Iates/Jets)', value: conciergeLeads, set: setConciergeLeads, max: 20, hint: `6.5% concierge` },
                ].map(s => (
                  <div key={s.label} className="calc-slider-row">
                    <div className="calc-slider-label">
                      <span>{s.label}</span>
                      <span className="calc-slider-value">{s.value} <span style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)', fontWeight: 400 }}>{s.hint}</span></span>
                    </div>
                    <input type="range" className="calc-slider" min={0} max={s.max} value={s.value} onChange={e => s.set(Number(e.target.value))} />
                  </div>
                ))}
              </div>

              <div className="calc-card">
                <div className="calc-title">Projeção de Rendimentos</div>
                <div className="calc-result-grid">
                  <div className="calc-result-item">
                    <div className="calc-result-value">
                      €{usviMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="calc-result-label">Mensal Estimado</div>
                  </div>
                  <div className="calc-result-item">
                    <div className="calc-result-value">
                      €{(usviMonthly * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="calc-result-label">Anual Estimado</div>
                  </div>
                </div>
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '4px', fontSize: '0.72rem', color: 'rgba(248,250,252,0.5)', lineHeight: 1.5 }}>
                  A Vendifree garante um modelo sustentável: retemos a margem necessária para custos de infraestrutura e marketing global, entregando margens de lucro elevadas aos parceiros de rede.
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'amb-services' && (
          <div>
            <div className="admin-page-title">Serviços Premium para Ativos</div>
            <div className="admin-page-sub">Impulsione os seus ativos listados com o poder de marketing da Vendifree</div>

            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              {[
                { label: 'Saldo de Marketing', value: '€1.250', sub: 'Créditos disponíveis' },
                { label: 'Campanhas Ativas', value: '3', sub: 'Redes Sociais + Portais' },
                { label: 'Destaques Restantes', value: '5', sub: 'Válidos por 7 dias' },
                { label: 'Acesso Antecipado', value: 'Ativo', sub: 'Early Access a leads' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-sub">Vendas globais</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
               <button className="login-submit-btn" style={{ maxWidth: '300px' }} onClick={() => setTab('amb-listings')}>
                 ✦ Publicar Novo Ativo
               </button>
            </div>
            <div className="dash-card">
              <div className="dash-card-title">Solicitar Novos Serviços</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                {[
                  { title: 'Destaque de Ativo', price: '19€ / semana', desc: 'O seu imóvel no topo absoluto das buscas globais.' },
                  { title: 'Marketing Internacional', price: 'Desde 199€', desc: 'Campanhas pagas em Facebook, Instagram e portais parceiros.' },
                  { title: 'Consultoria de Vendas', price: 'Sob consulta', desc: 'Apoio jurídico e negocial especializado para fechar o negócio.' },
                  { title: 'Tour Virtual 3D', price: '99€', desc: 'Sessão profissional para criação de tour Matterport 360°.' },
                ].map(s => (
                  <div key={s.title} style={{ padding: '1.25rem', background: 'rgba(248,250,252,0.03)', border: '1px solid rgba(248,250,252,0.08)', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--white-pearl)', marginBottom: '0.4rem' }}>{s.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gold)', marginBottom: '0.6rem' }}>{s.price}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.5)', lineHeight: 1.5, marginBottom: '1.25rem' }}>{s.desc}</div>
                    <button className="btn-luxury" style={{ width: '100%', fontSize: '0.7rem' }}>Ativar Agora</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {tab === 'amb-highlights' && (
          <div>
            <div className="admin-page-title">Gestão de Destaques Vendifree</div>
            <div className="admin-page-sub">Aumente a visibilidade e o potencial de comissão dos seus ativos</div>

            <div className="dash-card">
              <div className="dash-card-title">Ativos com Potencial de Boost</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {myProperties.length > 0 ? myProperties.map(prop => (
                  <div key={prop.id} style={{ padding: '1rem', background: 'rgba(248,250,252,0.03)', border: '1px solid rgba(248,250,252,0.08)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: prop.featured ? '3px solid var(--gold)' : '1px solid rgba(248,250,252,0.08)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--white-pearl)', fontSize: '0.85rem' }}>{prop.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.4)' }}>{prop.location}</div>
                      {prop.featured && <div style={{ fontSize: '0.6rem', color: 'var(--gold)', marginTop: '0.2rem' }}>✦ ATIVO</div>}
                    </div>
                    <button 
                      className="btn-luxury" 
                      style={{ fontSize: '0.65rem', padding: '0.4rem 0.8rem', opacity: prop.featured ? 0.5 : 1 }}
                      disabled={prop.featured}
                      onClick={() => activateHighlight(prop.id)}
                    >
                      {prop.featured ? 'Destacado' : 'Ativar Destaque'}
                    </button>
                  </div>
                )) : (
                  <div style={{ color: 'rgba(248,250,252,0.4)', fontSize: '0.8rem' }}>Ainda não tem ativos associados para destacar.</div>
                )}
              </div>
            </div>

            <div className="dash-card" style={{ marginTop: '1.5rem', background: 'rgba(201,168,76,0.03)' }}>
              <div className="dash-card-title">Impacto Estimado (MTD)</div>
              <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="stat-card">
                  <div className="stat-label">Views Adicionais</div>
                  <div className="stat-value">+85%</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Comissão Estimada</div>
                  <div className="stat-value">€3.400</div>
                </div>
              </div>
            </div>
          </div>
        )}
          {/* MANIFESTO TAB */}
          {tab === 'amb-manifesto' && (
            <div className="dash-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3.5rem', background: '#050b14', border: '1px solid var(--gold)' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ color: 'var(--gold)', letterSpacing: '0.4em', fontSize: '0.7rem', marginBottom: '1.5rem', fontWeight: 700 }}>ESCRITURA DE ELITE</div>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--white-pearl)', fontWeight: 800 }}>O Manifesto Vendifree</h2>
                <div style={{ width: '60px', height: '1px', background: 'var(--gold)', margin: '1.5rem auto' }}></div>
              </div>

              <div style={{ lineHeight: 1.8, fontSize: '1.05rem', color: 'rgba(248,250,252,0.85)', textAlign: 'justify' }}>
                <p style={{ marginBottom: '2rem' }}>
                  <strong style={{ color: 'var(--gold)', display: 'block', marginBottom: '0.5rem', fontSize: '1.2rem' }}>I. A Liberdade do Invisível</strong>
                  Na Vendifree, acreditamos que o verdadeiro luxo começa onde o sinal termina. O nosso ecossistema foi desenhado para quem procura a liberdade absoluta de transação e o acesso a coordenadas que simplesmente não existem no Google Maps. No Taiti, a sofisticação não se mede pelo que é visto, mas pelo que é preservado; o verdadeiro privilégio é a imunidade ao olhar comum, garantindo que a sua presença na Polinésia seja sentida apenas pela natureza e pelo silêncio.
                </p>

                <p style={{ marginBottom: '2rem' }}>
                  <strong style={{ color: 'var(--gold)', display: 'block', marginBottom: '0.5rem', fontSize: '1.2rem' }}>II. Um Ecossistema Sem Fronteiras</strong>
                  A Vendifree não é um diretório de anúncios; é um organismo vivo e fechado de curadoria seletiva. Aqui, cada um dos nossos 20 Embaixadores detém a autonomia total para arquitetar experiências "Off-the-Radar" que desafiam o convencional. De atóis privados intocados a frotas de jatos sob demanda e staff treinado na discrição absoluta, não oferecemos propriedades, mas o controlo total sobre um mundo onde a sua vontade é a única bússola.
                </p>

                <p style={{ marginBottom: '2rem' }}>
                  <strong style={{ color: 'var(--gold)', display: 'block', marginBottom: '0.5rem', fontSize: '1.2rem' }}>III. Investimento com Propósito</strong>
                  A nossa infraestrutura financeira foi blindada para honrar quem gera o valor. Garantimos que 93,5% de cada transação de prestígio flua diretamente para os especialistas locais e para a conservação dos destinos que tornam estas experiências possíveis. Operamos com uma taxa fixa de gestão de 6,5%, um valor dedicado exclusivamente a manter a nossa rede fechada, a sua privacidade inviolável e a tecnologia da plataforma num nível de segurança militar.
                </p>
              </div>

              <div style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.5 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold)', letterSpacing: '0.2em' }}>DOCUMENTO RESERVADO AOS 20 EMBAIXADORES ✦ TAHITI</span>
              </div>
            </div>
          )}

          {/* SAAS & PERFORMANCE TAB */}
          {tab === 'amb-saas' && (
            <div className="dash-grid" style={{ gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
              <div>
                <div className="dash-card" style={{ marginBottom: '2rem', border: '1px solid var(--gold)' }}>
                  <h4 style={{ color: 'var(--gold)', marginBottom: '1.5rem' }}>O Seu Nível SaaS</h4>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {(['Explorer', 'Curator', 'Mana Royal'] as SaaSTier[]).map(t => (
                      <div 
                        key={t}
                        onClick={() => setSaasTier(t)}
                        style={{ 
                          padding: '1.2rem', border: '1px solid', 
                          borderColor: saasTier === t ? 'var(--gold)' : 'rgba(248,250,252,0.1)',
                          background: saasTier === t ? 'rgba(201,168,76,0.1)' : 'transparent',
                          borderRadius: '8px', cursor: 'pointer', transition: '0.3s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, color: saasTier === t ? 'var(--gold)' : 'var(--white-pearl)' }}>{t}</span>
                          <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{t === 'Explorer' ? 'Taxa: 6,5%' : t === 'Curator' ? 'Taxa: 15%' : 'Taxa: 30%'}</span>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>
                          {t === 'Explorer' ? 'Infraestrutura básica de checkout.' : t === 'Curator' ? 'Inclui Lead Qualifying (PoF verificada).' : 'Suporte Jurídico, Escrow e Marketing Elite.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dash-card">
                  <h4 style={{ marginBottom: '1.5rem' }}>Serviços de Desbloqueio (Unlocking)</h4>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {unlocks.map(u => (
                      <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(248,250,252,0.03)', borderRadius: '6px' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{u.title}</div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)' }}>{u.description}</div>
                        </div>
                        <button 
                          className="btn-luxury" 
                          style={{ fontSize: '0.65rem', padding: '0.4rem 0.8rem' }}
                          onClick={() => alert(`Desbloqueando ${u.title} por €${u.fee}...`)}
                        >
                          Unlock (€{u.fee})
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="dash-card" style={{ height: '100%', background: 'linear-gradient(135deg, rgba(5,11,20,1) 0%, rgba(10,31,61,1) 100%)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h4 style={{ margin: 0 }}>The Elite 20 League</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gold)' }}>Atualizado Online ✦</span>
                  </div>
                  
                  <div style={{ display: 'grid', gap: '0.8rem' }}>
                    {[
                      { rank: 1, name: 'Jean-Luc B.', score: 98, status: 'Mana Royal', trend: 'up' },
                      { rank: 2, name: 'Marc-Antoine', score: 92, status: 'Curator', trend: 'stable' },
                      { rank: 3, name: 'Sophie L.', score: 89, status: 'Curator', trend: 'up' },
                      { rank: 4, name: 'Você', score: 85, status: 'Explorer', trend: 'stable', isMe: true },
                      { rank: 5, name: 'Pierre M.', score: 82, status: 'Explorer', trend: 'down' },
                    ].map(player => (
                      <div 
                        key={player.rank}
                        style={{ 
                          display: 'flex', alignItems: 'center', padding: '1rem', 
                          background: player.isMe ? 'rgba(201,168,76,0.15)' : 'rgba(248,250,252,0.03)',
                          borderLeft: player.isMe ? '3px solid var(--gold)' : '3px solid transparent',
                          borderRadius: '4px'
                        }}
                      >
                        <span style={{ width: '30px', fontWeight: 800, color: player.rank <= 3 ? 'var(--gold)' : 'inherit' }}>#{player.rank}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{player.name}</div>
                          <div style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)' }}>{player.status}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold)' }}>{player.score}</div>
                          <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>SCORE</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(201,168,76,0.05)', border: '1px dashed var(--gold)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gold)', lineHeight: 1.6, margin: 0 }}>
                      <strong>Performance Note:</strong> Suba para o Top 3 para desbloquear redução de 5% nas taxas Mana Royal e acesso prioritário a solicitações PoF.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <UpsellEngine 
                  leads={hnwLeads} 
                  services={SERVICE_ADDONS} 
                  onUpsell={(lid, sid) => alert(`Proposta de Upsell enviada para ${hnwLeads.find(l=>l.id===lid)?.clientName}. Comissão de 6.5% reservada.`)} 
                />
              </div>
            </div>
          )}

          {tab === 'amb-profile' && (
          <div>
            <div className="admin-page-title">O Meu Perfil</div>
            <div className="admin-page-sub">Informações da sua conta de embaixador</div>

            <div className="dash-card" style={{ maxWidth: '500px' }}>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                {[
                  { label: 'Nome', value: currentUser?.name },
                  { label: 'E-mail', value: currentUser?.email },
                  { label: 'Território', value: ambassador?.territory },
                  { label: 'Nicho', value: ambassador?.niche },
                  { label: 'Seguidores', value: ambassador?.followers?.toLocaleString() },
                ].map(field => (
                  <div key={field.label}>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(248,250,252,0.35)', marginBottom: '0.3rem' }}>{field.label}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--white-pearl)' }}>{field.value || '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LISTINGS / UPLOAD */}
        {tab === 'amb-listings' && (
          <div>
            <div className="admin-page-title">Gerir Ativos & Media</div>
            <div className="admin-page-sub">Carregue fotos e detalhes de novos ativos para a rede Vendifree</div>
            
            <div style={{ marginTop: '2rem' }}>
              <AssetUpload role="ambassador" onCancel={() => setTab('amb-dashboard')} onSuccess={handleUploadSuccess} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
