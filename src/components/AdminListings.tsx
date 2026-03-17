import React, { useState } from 'react';
import { Property, Category } from '../types';
import { AssetUpload } from './AssetUpload';

interface AdminListingsProps {
  properties: Property[];
}

const CATEGORY_LABELS: Record<Category, string> = {
  villas: 'Villas',
  realestate: 'Imobiliário',
  hotels: 'Hotéis',
  cars: 'Viaturas',
  yachts: 'Iates',
  jets: 'Jatos',
  experiences: 'Experiências',
};

function formatPrice(price: number, unit: string): string {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M€`;
  return `${price.toLocaleString()}€`;
}

export const AdminListings: React.FC<AdminListingsProps> = ({ properties }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [tab, setTab] = useState<Category>('villas');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [marketFilter, setMarketFilter] = useState<string>('all');

  const handleUploadSuccess = (newAsset: any) => {
    alert(`Sucesso! Administrador carregou "${newAsset.title}". Ativo disponível imediatamente.`);
    setShowUpload(false);
  };

  const filtered = properties
    .filter(p => p.category === tab)
    .filter(p => marketFilter === 'all' || p.market === marketFilter)
    .filter(p => statusFilter === 'all' || p.status === statusFilter);

  const statusLabels: Record<string, string> = {
    'disponível': 'Disponível',
    'reservado': 'Reservado',
    'negociação': 'Negociação',
    'vendido': 'Vendido',
    'alugado': 'Alugado'
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div className="admin-page-title">Gestão de Inventário Vendifree</div>
          <div className="admin-page-sub">Controlo total sobre ativos ativos, pendentes e histórico de vendas</div>
        </div>
        <button 
          className="btn-luxury" 
          onClick={() => setShowUpload(true)}
          style={{ whiteSpace: 'nowrap' }}
        >
          Publicar Novo Ativo
        </button>
      </div>

      {showUpload ? (
        <div style={{ marginTop: '1rem' }}>
          <AssetUpload role="admin" onCancel={() => setShowUpload(false)} onSuccess={handleUploadSuccess} />
        </div>
      ) : (
        <>
          <div className="filter-bar" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${tab === cat ? 'active' : ''}`}
                  onClick={() => setTab(cat)}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select className="filter-select" value={marketFilter} onChange={e => setMarketFilter(e.target.value)}>
                <option value="all">Filtro de Mercado</option>
                <option value="usvi">US Virgin Islands</option>
                <option value="polynesia">French Polynesia</option>
              </select>
              <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">Todos os Status</option>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem', fontSize: '0.72rem', color: 'rgba(248,250,252,0.35)', letterSpacing: '0.08em' }}>
            {filtered.length} ativos encontrados
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ativo</th>
                  <th>Mercado</th>
                  <th>Categoria</th>
                  <th>Ilha</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Featured</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div 
                          style={{ 
                            width: '32px', height: '32px', borderRadius: '4px', 
                            backgroundImage: `url(${p.images[0]})`, backgroundSize: 'cover' 
                          }} 
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: 'rgba(248,250,252,0.9)' }}>{p.title}</div>
                          <div style={{ fontSize: '0.68rem', color: 'rgba(248,250,252,0.35)' }}>{p.location}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                       <span style={{ fontSize: '0.72rem', color: 'rgba(248,250,252,0.5)' }}>{p.market.toUpperCase()}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(248,250,252,0.5)' }}>
                        {CATEGORY_LABELS[p.category]}
                      </span>
                    </td>
                    <td style={{ color: 'rgba(6,182,212,1)', fontSize: '0.78rem' }}>{p.island}</td>
                    <td style={{ color: 'var(--gold)', fontWeight: 600 }}>
                      {formatPrice(p.price, p.priceUnit)}
                    </td>
                    <td>
                      <span className={`booking-status pill-${p.status}`} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem' }}>
                        {statusLabels[p.status] || p.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', color: p.featured ? 'var(--gold)' : 'rgba(248,250,252,0.2)' }}>
                      {p.featured ? '✦' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
