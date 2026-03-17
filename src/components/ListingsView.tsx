import React, { useState } from 'react';
import { Property, Category } from '../types';
import { PropertyCard } from './PropertyCard';
import { PropertyDetailModal } from './PropertyDetailModal';
import { MysteryListingCard } from './MysteryListingCard';
import { LuxuryKYCModal } from './LuxuryKYCModal';

interface ListingsViewProps {
  properties: Property[];
  category?: Category;
}

const CATEGORY_CONFIG: Record<Category, { title: string; subtitle: string; icon: string }> = {
  villas: { title: 'Luxury Villas', subtitle: 'Private paradise awaits you', icon: '🏝️' },
  realestate: { title: 'Premium Real Estate', subtitle: 'Invest in island paradise', icon: '🏰' },
  hotels: { title: 'Luxury Hotels & Resorts', subtitle: 'World-class hospitality', icon: '✨' },
  cars: { title: 'Prestige Car Rentals', subtitle: 'Drive the extraordinary', icon: '🏎️' },
  yachts: { title: 'Yacht Charters', subtitle: 'Sail the crystalline waters', icon: '🛥️' },
  jets: { title: 'Private Aviation', subtitle: 'Reach the unreachable', icon: '🛩️' },
  experiences: { title: 'Elite Experiences', subtitle: 'Curated island adventures', icon: '⭐' },
};

export const ListingsView: React.FC<ListingsViewProps> = ({ properties, category }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [islandFilter, setIslandFilter] = useState<string>('all');
  const [assetType, setAssetType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(50000000);
  const [minSpecs, setMinSpecs] = useState({ pool: false, marina: false, helipad: false });
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showLuxuryKYC, setShowLuxuryKYC] = useState(false);
  const [targetProperty, setTargetProperty] = useState<Property | null>(null);

  const islands = ['all', ...Array.from(new Set(properties.map(p => p.island)))];

  let filtered = properties
    .filter(p => !category || p.category === category)
    .filter(p => islandFilter === 'all' || p.island === islandFilter)
    .filter(p => assetType === 'all' || p.category === assetType)
    .filter(p => p.price <= maxPrice)
    .filter(p => !minSpecs.pool || p.specs.piscinas > 0)
    .filter(p => !minSpecs.marina || p.specs.marina)
    .filter(p => !minSpecs.helipad || p.specs.heliporto);

  if (sortBy === 'featured') filtered = [...filtered].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  else if (sortBy === 'price_asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price);

  const config = category ? CATEGORY_CONFIG[category] : null;

  return (
    <div className="listings-section">
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <div className="section-title">{category ? config?.title : 'Catálogo Vendifree'}</div>
        <div style={{ fontSize: '0.85rem', color: 'rgba(248,250,252,0.4)', marginTop: '0.5rem' }}>
          Explore os ativos mais exclusivos do mercado global com transparência total.
        </div>
      </div>

      <div className="advanced-filters">
        <div className="filter-group">
          <label>Localização</label>
          <select className="filter-select-adv" value={islandFilter} onChange={e => setIslandFilter(e.target.value)}>
            {islands.map(i => (
              <option key={i} value={i}>{i === 'all' ? 'Todas as Localizações' : i}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Preço Máximo</label>
          <input 
            type="range" 
            min={1000} 
            max={50000000} 
            step={10000} 
            value={maxPrice} 
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="price-slider"
          />
          <div style={{ fontSize: '0.7rem', marginTop: '0.4rem', color: 'var(--gold)' }}>
            Até {maxPrice >= 1000000 ? `${(maxPrice/1000000).toFixed(1)}M€` : `${maxPrice.toLocaleString()}€`}
          </div>
        </div>

        <div className="filter-group">
          <label>Características</label>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button 
              className={`mini-filter-btn ${minSpecs.pool ? 'active' : ''}`}
              onClick={() => setMinSpecs({...minSpecs, pool: !minSpecs.pool})}
            >Piscina</button>
            <button 
              className={`mini-filter-btn ${minSpecs.marina ? 'active' : ''}`}
              onClick={() => setMinSpecs({...minSpecs, marina: !minSpecs.marina})}
            >Marina</button>
            <button 
              className={`mini-filter-btn ${minSpecs.helipad ? 'active' : ''}`}
              onClick={() => setMinSpecs({...minSpecs, helipad: !minSpecs.helipad})}
            >Heliporto</button>
          </div>
        </div>

        <div className="filter-group">
          <label>Ordenar por</label>
          <select className="filter-select-adv" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="featured">Destaques</option>
            <option value="price_desc">Preço: Maior → Menor</option>
            <option value="price_asc">Preço: Menor → Maior</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(248,250,252,0.02)', borderRadius: '12px', border: '1px dashed rgba(248,250,252,0.1)' }}>
          <div style={{ fontSize: '0.9rem', color: 'rgba(248,250,252,0.4)' }}>Nenhum ativo corresponde aos seus filtros.</div>
          <button className="btn-luxury" style={{ marginTop: '1rem', fontSize: '0.7rem' }} onClick={() => {
            setIslandFilter('all');
            setMaxPrice(50000000);
            setMinSpecs({ pool: false, marina: false, helipad: false });
          }}>Limpar Filtros</button>
        </div>
      ) : (
        <div className="properties-grid">
          {filtered.map(p => (
            p.isMystery ? (
              <MysteryListingCard 
                key={p.id} 
                property={p} 
                onBook={setSelectedProperty} 
                onRequestAccess={(prop) => {
                  setTargetProperty(prop);
                  setShowLuxuryKYC(true);
                }}
              />
            ) : (
              <PropertyCard key={p.id} property={p} onBook={setSelectedProperty} />
            )
          ))}
        </div>
      )}

      {showLuxuryKYC && (
        <LuxuryKYCModal 
          onClose={() => setShowLuxuryKYC(false)}
          onVerify={(url) => {
            setShowLuxuryKYC(false);
            alert('Acesso VIP Solicitado. A nossa Direção de Operações entrará em contacto discretamente sobre este ativo "Off-the-Radar".');
          }}
        />
      )}

      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};
