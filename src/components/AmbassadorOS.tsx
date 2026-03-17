import React, { useState } from 'react';
import { Ambassador, AmbassadorStatus, AmbassadorPlatform, Continent } from '../types';
import { CONTINENT_DATA } from '../data';

interface AmbassadorOSProps {
  ambassadors: Ambassador[];
}

type AmbView = 'search' | 'pipeline' | 'calculator';

const PLATFORM_OPTIONS: { key: AmbassadorPlatform | 'all'; label: string }[] = [
  { key: 'all', label: 'Todas as Plataformas' },
  { key: 'usvi', label: 'USVI Luxury' },
  { key: 'vendifree', label: 'Vendifree' },
  { key: 'both', label: 'Ambas' },
];

const STATUS_LABELS: Record<AmbassadorStatus, string> = {
  new: 'Novo Lead',
  awaiting_bot_review: 'Em Análise (Bots)',
  awaiting_admin_approval: 'Aguardando Admin',
  contacted: 'Contactado',
  interested: 'Pendente Admissão',
  active: 'Parceiro Ativo',
  rejected: 'Recusado',
};

const STATUS_CLASSES: Record<AmbassadorStatus, string> = {
  new: 'status-pending',
  awaiting_bot_review: 'status-pending',
  awaiting_admin_approval: 'status-pending',
  contacted: 'status-pending',
  interested: 'status-completed',
  active: 'status-confirmed',
  rejected: 'status-cancelled',
};

function platformClass(p: AmbassadorPlatform): string {
  const map: Record<AmbassadorPlatform, string> = {
    usvi: 'amb-tag-platform-usvi',
    vendifree: 'amb-tag-platform-vendifree',
    both: 'amb-tag-platform-both',
  };
  return map[p];
}

const PIPELINE_COLS: AmbassadorStatus[] = ['new', 'awaiting_bot_review', 'awaiting_admin_approval', 'contacted', 'interested', 'active', 'rejected'];

// USVI commission rates (Refined for classifieds model)
const USVI_RATES = {
  villa: { avgValue: 12000, commission: 0.30 },
  realestate: { avgValue: 4000000, commission: 0.30 },
  hotel: { avgValue: 8000, commission: 0.30 },
  car: { avgValue: 2000, commission: 0.30 },
};

// Vendifree rates
const VENDIFREE_RATES = {
  pro: { price: 29, commission: 0.30 },
  business: { price: 79, commission: 0.30 },
};

export const AmbassadorOS: React.FC<AmbassadorOSProps> = ({ ambassadors: initialAmb }) => {
  const [view, setView] = useState<AmbView>('search');
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>(initialAmb);
  const [platformFilter, setPlatformFilter] = useState<AmbassadorPlatform | 'all'>('all');
  const [minScore, setMinScore] = useState(0);
  const [territoryFilter, setTerritoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScouting, setIsScouting] = useState(false);
  const [scoutedNiches, setScoutedNiches] = useState<string[]>([]);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [botInsights, setBotInsights] = useState<Record<string, { versus: string, venus: string }>>({});

  // Calculator state
  const [calcPlatform, setCalcPlatform] = useState<'usvi' | 'vendifree'>('usvi');
  const [villas, setVillas] = useState(2);
  const [realEstate, setRealEstate] = useState(0);
  const [hotelBookings, setHotelBookings] = useState(3);
  const [carRentals, setCarRentals] = useState(5);
  const [proSubs, setProSubs] = useState(10);
  const [bizSubs, setBizSubs] = useState(5);

  // Global Balancing state
  const [selectedContinent, setSelectedContinent] = useState<Continent>('Europa');
  const [targetAds, setTargetAds] = useState(100);


  function updateStatus(id: string, status: AmbassadorStatus) {
    setAmbassadors((prev: Ambassador[]) => prev.map((a: Ambassador) => a.id === id ? { ...a, status } : a));
  }

  function handleBotReview(id: string) {
    setReviewingId(id);
    setTimeout(() => {
      setBotInsights(prev => ({
        ...prev,
        [id]: {
          versus: "Potencial de escala internacional validado. O nicho e a audiência alinham-se com a nossa visão de crescimento 2026. APROVAÇÃO AUTÓNOMA CONCEDIDA.",
          venus: "Tendências de mercado indicam alta procura neste segmento. O candidato possui autoridade orgânica. ROI projetado positivo. ATIVAÇÃO ELITE IMEDIATA."
        }
      }));
      updateStatus(id, 'active');
      setReviewingId(null);
    }, 2000);
  }

  const territories = ['all', ...Array.from(new Set(ambassadors.map((a: Ambassador) => a.territory)))];

  const filtered = ambassadors
    .filter((a: Ambassador) => platformFilter === 'all' || a.platform === platformFilter || a.platform === 'both')
    .filter((a: Ambassador) => a.fitScore >= minScore)
    .filter((a: Ambassador) => territoryFilter === 'all' || a.territory === territoryFilter)
    .filter((a: Ambassador) => 
      searchTerm === '' || 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.niche.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((a: Ambassador) => 
      scoutedNiches.length === 0 || 
      scoutedNiches.some(n => a.niche.toLowerCase().includes(n.toLowerCase()))
    );

  // USVI earnings calculation
  const usviMonthly =
    villas * USVI_RATES.villa.avgValue * USVI_RATES.villa.commission +
    realEstate * USVI_RATES.realestate.avgValue * USVI_RATES.realestate.commission +
    hotelBookings * USVI_RATES.hotel.avgValue * USVI_RATES.hotel.commission +
    carRentals * USVI_RATES.car.avgValue * USVI_RATES.car.commission;

  // Vendifree earnings calculation
  const vendifreeMonthly =
    proSubs * VENDIFREE_RATES.pro.price * VENDIFREE_RATES.pro.commission +
    bizSubs * VENDIFREE_RATES.business.price * VENDIFREE_RATES.business.commission;

  const activeMonthly = calcPlatform === 'usvi' ? usviMonthly : vendifreeMonthly;

  return (
    <div>
      <div className="admin-page-title">AmbassadorOS</div>
      <div className="admin-page-sub">
        Automatic ambassador recruitment & management for USVI Luxury + Vendifree
      </div>

      {/* Sub-navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { key: 'search', label: 'Procurar Embaixadores' },
            { key: 'pipeline', label: 'Pipeline' },
            { key: 'calculator', label: 'Calculadora de Ganhos' },
          ].map(v => (
            <button
              key={v.key}
              onClick={() => setView(v.key as AmbView)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: view === v.key ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.1)',
                background: view === v.key ? 'rgba(201,168,76,0.15)' : 'transparent',
                color: view === v.key ? 'rgba(201,168,76,1)' : 'rgba(248,250,252,0.55)',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.3)' }}>Active:</span>
          <span style={{ color: 'rgba(201,168,76,1)', fontWeight: 700 }}>
            {ambassadors.filter((a: Ambassador) => a.status === 'active').length}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.3)', marginLeft: '0.5rem' }}>Pipeline:</span>
          <span style={{ color: '#06b6d4', fontWeight: 700 }}>
            {ambassadors.filter((a: Ambassador) => ['contacted', 'interested'].includes(a.status)).length}
          </span>
        </div>

        <button
          onClick={() => {
            setIsScouting(true);
            setTimeout(() => {
              setScoutedNiches(['Hotel', 'Hospitality', 'Rental', 'Aluguer']);
              setIsScouting(false);
              setView('search');
            }, 1500);
          }}
          disabled={isScouting}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: '1px solid var(--gold)',
            background: 'rgba(201,168,76,0.1)',
            color: 'var(--gold)',
            marginLeft: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: isScouting ? 'pulse 1s infinite' : 'none'
          }}
        >
          {isScouting ? '⏳ Scouting...' : '🔍 Auto-Scout Hotel & Rentals'}
        </button>
      </div>

      {/* SEARCH VIEW */}
      {view === 'search' && (
        <div>
          <div className="filter-bar">
            <select className="filter-select" value={platformFilter} onChange={e => setPlatformFilter(e.target.value as AmbassadorPlatform | 'all')}>
              {PLATFORM_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
            <select className="filter-select" value={territoryFilter} onChange={e => setTerritoryFilter(e.target.value)}>
              {territories.map(t => <option key={t} value={t}>{t === 'all' ? 'Territórios Globais' : t}</option>)}
            </select>
            <div className="search-box" style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', background: 'rgba(248,250,252,0.03)', border: '1px solid rgba(248,250,252,0.1)', borderRadius: '4px', padding: '0 0.75rem' }}>
              <span style={{ marginRight: '0.5rem', opacity: 0.4 }}>🔍</span>
              <input 
                type="text" 
                placeholder="Procurar por nome, local ou nicho..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.75rem', padding: '0.5rem 0', width: '100%', outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)' }}>Min Score: {minScore}</span>
              <input
                type="range" min={0} max={100} step={5}
                value={minScore}
                onChange={e => setMinScore(Number(e.target.value))}
                className="calc-slider"
                style={{ width: '100px' }}
              />
            </div>
          </div>
          
          {scoutedNiches.length > 0 && (
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(201,168,76,0.05)', padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid rgba(201,168,76,0.2)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--gold)' }}>✨ Resultados do Auto-Scout: <strong>{filtered.length} embaixadores encontrados</strong> para Nicho Hoteleiro/Aluguer.</span>
              <button 
                onClick={() => setScoutedNiches([])}
                style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'rgba(248,250,252,0.3)', cursor: 'pointer', fontSize: '0.7rem' }}
              >
                Limpar Resultados
              </button>
            </div>
          )}

          <div className="amb-grid">
            {filtered.sort((a: Ambassador, b: Ambassador) => b.fitScore - a.fitScore).map((amb: Ambassador) => (
              <div key={amb.id} className="amb-card">
                <div className="amb-header">
                  <div>
                    <div className="amb-name">{amb.name}</div>
                    <div className="amb-location">{amb.location}</div>
                  </div>
                  <div className="amb-score">{amb.fitScore}</div>
                </div>

                <div className="amb-meta">
                  <span className={`amb-tag ${platformClass(amb.platform)}`}>
                    {amb.platform === 'both' ? 'Plataforma Dupla' : amb.platform === 'usvi' ? 'USVI' : 'Vendifree'}
                  </span>
                  <span className={`booking-status ${STATUS_CLASSES[amb.status]}`}>
                    {STATUS_LABELS[amb.status]}
                  </span>
                </div>

                <div className="amb-niche">🎯 {amb.niche}</div>
                <div className="amb-followers">
                  👥 {amb.followers.toLocaleString()} followers · {amb.network}
                </div>

                {amb.monthlyEarnings && (
                  <div className="amb-earnings">
                    €{amb.monthlyEarnings.toLocaleString()}
                    <span> /mês (Ganhos)</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                   <div style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.6)' }}>⭐ <strong>{amb.rating || '—'}</strong> Rating</div>
                   <div style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.6)' }}>🤝 <strong>{amb.dealsCompleted || 0}</strong> Negócios</div>
                </div>

                {(amb.taxId || amb.linkedin || amb.experience) && (
                  <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', fontSize: '0.68rem', display: 'grid', gap: '0.3rem' }}>
                    {amb.taxId && <div style={{ color: 'rgba(248,250,252,0.4)' }}>🆔 NIF: <strong style={{ color: 'rgba(248,250,252,0.7)' }}>{amb.taxId}</strong></div>}
                    {amb.linkedin && <div style={{ color: 'rgba(248,250,252,0.4)' }}>🔗 Web: <a href="#" style={{ color: 'var(--gold)', textDecoration: 'none' }}>{amb.linkedin}</a></div>}
                    {amb.experience && <div style={{ color: 'rgba(248,250,252,0.4)' }}>⏳ Experiência: <strong style={{ color: 'rgba(248,250,252,0.7)' }}>{amb.experience} anos</strong></div>}
                  </div>
                )}

                {amb.notes && (
                  <div style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    💬 {amb.notes}
                  </div>
                )}

                <div className="amb-actions">
                  {amb.status !== 'active' && amb.status !== 'rejected' && (
                    <button
                      className="amb-btn-contact"
                      onClick={() => updateStatus(amb.id, 'contacted')}
                    >
                      📧 Contact
                    </button>
                  )}
                  {amb.status === 'interested' && (
                    <button
                      className="amb-btn-activate"
                      onClick={() => updateStatus(amb.id, 'active')}
                    >
                      ✦ Admitir Parceiro
                    </button>
                  )}
                  {amb.status === 'active' && (
                    <div style={{ flex: 1, textAlign: 'center', fontSize: '0.7rem', color: '#4ade80', padding: '0.4rem' }}>
                      ✅ Active Ambassador
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PIPELINE VIEW */}
      {view === 'pipeline' && (
        <div className="pipeline-board">
          {PIPELINE_COLS.map(status => {
            const colAmbs = ambassadors.filter((a: Ambassador) => a.status === status);
            return (
              <div key={status} className="pipeline-col">
                <div className="pipeline-col-header">
                  <span>{STATUS_LABELS[status].toUpperCase()}</span>
                  <span className="pipeline-col-count">{colAmbs.length}</span>
                </div>
                {colAmbs.map((amb: Ambassador) => (
                  <div key={amb.id} className="pipeline-item">
                    <div className="pipeline-item-name">{amb.name}</div>
                    <div className="pipeline-item-territory">{amb.territory}</div>
                    <div className="pipeline-item-score">Score: {amb.fitScore}</div>
                    <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {status === 'new' && (
                        <button
                          onClick={() => updateStatus(amb.id, 'awaiting_bot_review')}
                          style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', borderRadius: '3px', cursor: 'pointer' }}
                        >
                          Iniciar Avaliação →
                        </button>
                      )}
                      {status === 'awaiting_bot_review' && (
                        <button
                          onClick={() => handleBotReview(amb.id)}
                          disabled={reviewingId === amb.id}
                          style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: '3px', cursor: reviewingId === amb.id ? 'wait' : 'pointer' }}
                        >
                          {reviewingId === amb.id ? '🤖 A Analisar...' : '⚡ Bot Review (Versus & Venus)'}
                        </button>
                      )}
                      {status === 'awaiting_admin_approval' && (
                        <>
                          <button
                            onClick={() => updateStatus(amb.id, 'active')}
                            style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: '3px', cursor: 'pointer' }}
                          >
                            ✓ Admitir Elite
                          </button>
                          <button
                            onClick={() => updateStatus(amb.id, 'contacted')}
                            style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', borderRadius: '3px', cursor: 'pointer' }}
                          >
                            Degradar a Comum
                          </button>
                        </>
                      )}
                      {status === 'contacted' && (
                        <button
                          onClick={() => updateStatus(amb.id, 'interested')}
                          style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24', borderRadius: '3px', cursor: 'pointer' }}
                        >
                          Interested →
                        </button>
                      )}
                      {status === 'interested' && (
                        <button
                          onClick={() => updateStatus(amb.id, 'active')}
                          style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: '3px', cursor: 'pointer' }}
                        >
                          Admitir Parceiro ✦
                        </button>
                      )}
                      {status !== 'rejected' && status !== 'active' && (
                        <button
                          onClick={() => updateStatus(amb.id, 'rejected')}
                          style={{ fontSize: '0.6rem', padding: '0.2rem 0.4rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '3px', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {botInsights[amb.id] && (
                      <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: 'rgba(201,168,76,0.05)', borderRadius: '4px', border: '1px solid rgba(201,168,76,0.1)', fontSize: '0.65rem' }}>
                        <div style={{ marginBottom: '0.4rem' }}>
                          <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Versus:</span> <span style={{ color: 'rgba(248,250,252,0.7)' }}>{botInsights[amb.id].versus}</span>
                        </div>
                        <div>
                          <span style={{ color: '#06b6d4', fontWeight: 700 }}>Vénus:</span> <span style={{ color: 'rgba(248,250,252,0.7)' }}>{botInsights[amb.id].venus}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* CALCULATOR VIEW */}
      {view === 'calculator' && (
        <div className="calc-section">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {(['usvi', 'vendifree'] as const).map(p => (
              <button
                key={p}
                onClick={() => setCalcPlatform(p)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: calcPlatform === p ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.1)',
                  background: calcPlatform === p ? 'rgba(201,168,76,0.15)' : 'transparent',
                  color: calcPlatform === p ? 'rgba(201,168,76,1)' : 'rgba(248,250,252,0.55)',
                }}
              >
                {p === 'usvi' ? '🏝️ USVI Luxury' : '🏪 Vendifree'}
              </button>
            ))}
          </div>

          {calcPlatform === 'usvi' ? (
            <div className="calc-card">
              <div className="calc-title">USVI Luxury — Monthly Referrals</div>

              {[
                { label: 'Villa bookings/month', value: villas, set: setVillas, max: 10, hint: `~$${(villas * USVI_RATES.villa.avgValue * USVI_RATES.villa.commission).toLocaleString()} earned` },
                { label: 'Real estate sales/month', value: realEstate, set: setRealEstate, max: 3, hint: `~$${(realEstate * USVI_RATES.realestate.avgValue * USVI_RATES.realestate.commission).toLocaleString()} earned` },
                { label: 'Hotel bookings/month', value: hotelBookings, set: setHotelBookings, max: 20, hint: `~$${(hotelBookings * USVI_RATES.hotel.avgValue * USVI_RATES.hotel.commission).toLocaleString()} earned` },
                { label: 'Car rental days/month', value: carRentals, set: setCarRentals, max: 30, hint: `~$${(carRentals * USVI_RATES.car.avgValue * USVI_RATES.car.commission).toLocaleString()} earned` },
              ].map(s => (
                <div key={s.label} className="calc-slider-row">
                  <div className="calc-slider-label">
                    <span>{s.label}</span>
                    <span className="calc-slider-value">{s.value} <span style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)', fontWeight: 400 }}>({s.hint})</span></span>
                  </div>
                  <input type="range" className="calc-slider" min={0} max={s.max} value={s.value} onChange={e => s.set(Number(e.target.value))} />
                </div>
              ))}
            </div>
          ) : (
            <div className="calc-card">
              <div className="calc-title">Vendifree — Monthly Subscriptions Sold</div>

              {[
                { label: 'Pro plans sold (€29/mo)', value: proSubs, set: setProSubs, max: 50, hint: `~€${(proSubs * VENDIFREE_RATES.pro.price * VENDIFREE_RATES.pro.commission).toFixed(0)} earned` },
                { label: 'Business plans sold (€79/mo)', value: bizSubs, set: setBizSubs, max: 30, hint: `~€${(bizSubs * VENDIFREE_RATES.business.price * VENDIFREE_RATES.business.commission).toFixed(0)} earned` },
              ].map(s => (
                <div key={s.label} className="calc-slider-row">
                  <div className="calc-slider-label">
                    <span>{s.label}</span>
                    <span className="calc-slider-value">{s.value} <span style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)', fontWeight: 400 }}>({s.hint})</span></span>
                  </div>
                  <input type="range" className="calc-slider" min={0} max={s.max} value={s.value} onChange={e => s.set(Number(e.target.value))} />
                </div>
              ))}
            </div>
          )}

          <div className="calc-card">
            <div className="calc-title">💰 Projected Earnings</div>
            <div className="calc-result-grid">
              <div className="calc-result-item">
                <div className="calc-result-value">
                  {calcPlatform === 'usvi' ? '$' : '€'}{activeMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="calc-result-label">Monthly</div>
              </div>
              <div className="calc-result-item">
                <div className="calc-result-value">
                  {calcPlatform === 'usvi' ? '$' : '€'}{(activeMonthly * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="calc-result-label">Annual</div>
              </div>
            </div>

            {calcPlatform === 'usvi' && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '4px', fontSize: '0.72rem', color: 'rgba(248,250,252,0.5)' }}>
                💡 Taxa de Comissão: 30% fixo sobre todas as vendas, alugueres e publicidades pagas referenciadas.
              </div>
            )}
            {calcPlatform === 'vendifree' && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '4px', fontSize: '0.72rem', color: 'rgba(248,250,252,0.5)' }}>
                💡 30% de comissão recorrente — o embaixador ganha todos os meses enquanto as subscrições estiverem ativas.
              </div>
            )}
          </div>
        </div>
      )}
      {/* GLOBAL EQUITY CALCULATOR */}
      {view === 'calculator' && (
        <div className="calc-section" style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
          <div className="admin-page-title" style={{ fontSize: '1rem' }}>⚖️ Calculadora de Equidade Global</div>
          <p style={{ color: 'rgba(248,250,252,0.4)', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
            Ajuste de ganhos baseado na área geográfica (km²) e densidade de luxo para garantir equidade entre continentes.
          </p>

          <div className="calc-card" style={{ background: 'rgba(201,168,76,0.03)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--gold)', display: 'block', marginBottom: '0.5rem' }}>SELECIONAR CONTINENTE</label>
                <select 
                  className="filter-select" 
                  style={{ width: '100%', marginBottom: '1rem' }}
                  value={selectedContinent}
                  onChange={e => setSelectedContinent(e.target.value as Continent)}
                >
                  {(Object.keys(CONTINENT_DATA) as Continent[]).map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <div style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.6)', lineHeight: '1.4' }}>
                  Área: <strong>{CONTINENT_DATA[selectedContinent].area}M km²</strong><br/>
                  Índice de Luxo: <strong>{CONTINENT_DATA[selectedContinent].luxuryIndex}x</strong><br/>
                  Multiplicador de Equidade: <strong>{CONTINENT_DATA[selectedContinent].multiplier}x</strong>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--gold)', display: 'block', marginBottom: '0.5rem' }}>VOLUME DE ANÚNCIOS (ESCALA)</label>
                <input 
                  type="range" min={10} max={1000} step={10} 
                  value={targetAds} 
                  onChange={e => setTargetAds(Number(e.target.value))}
                  className="calc-slider"
                />
                <div style={{ textAlign: 'right', fontSize: '0.8rem', marginTop: '0.5rem' }}>{targetAds} Anúncios/Mês</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem' }}>Preço Sugerido p/ Destaque (Ajustado)</span>
                <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
                  ${(49 * CONTINENT_DATA[selectedContinent].multiplier * (1/CONTINENT_DATA[selectedContinent].luxuryIndex)).toFixed(2)} /sem
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem' }}>Potencial de Receita Embaixador (30%)</span>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>
                  ${(targetAds * 49 * 0.30 * CONTINENT_DATA[selectedContinent].multiplier).toLocaleString(undefined, { maximumFractionDigits: 0 })} /mês
                </span>
              </div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.3)', marginTop: '1rem', fontStyle: 'italic' }}>
                *O cálculo compensa a maior área geográfica com multiplicadores de volume, garantindo que o lucro por esforço seja equilibrado globalmente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
