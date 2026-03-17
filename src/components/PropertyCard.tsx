import React from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onBook: (property: Property) => void;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  'disponível': { label: 'Disponível', color: '#10b981' },
  'reservado': { label: 'Reservado', color: '#f59e0b' },
  'negociação': { label: 'Em Negociação', color: '#c9a84c' },
  'vendido': { label: 'Vendido', color: '#ef4444' },
  'alugado': { label: 'Alugado', color: '#3b82f6' },
};

function formatPrice(price: number, unit: string): string {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M€`;
  return `${price.toLocaleString()}€`;
}

function formatUnit(unit: string): string {
  const map: Record<string, string> = {
    week: '/ semana',
    night: '/ noite',
    day: '/ dia',
    sale: 'Venda',
  };
  return map[unit] || unit;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onBook }) => {
  const metaParts: string[] = [];
  if (property.specs.metragem) metaParts.push(`${property.specs.metragem} m²`);
  if (property.specs.suites) metaParts.push(`${property.specs.suites} suites`);
  if (property.specs.piscinas) metaParts.push(`${property.specs.piscinas} piscina(s)`);
  if (property.specs.marina) metaParts.push(`Marina`);
  if (property.specs.heliporto) metaParts.push(`Heliporto`);

  const statusInfo = STATUS_MAP[property.status] || { label: property.status, color: 'gray' };

  return (
    <div className={`property-card status-${property.status}`}>
      <div className={`card-image ${property.cardClass}`} style={{ backgroundImage: property.images[0] ? `url(${property.images[0]})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <span className="card-emoji">{property.iconEmoji}</span>
        {property.featured && <span className="card-featured-badge">✦ Premium</span>}
        <span 
          className="card-status-badge" 
          style={{ backgroundColor: statusInfo.color }}
        >
          {statusInfo.label}
        </span>
        <div className="card-price-tag">
          <div className="card-price-amount">{formatPrice(property.price, property.priceUnit)}</div>
          <div className="card-price-unit">{formatUnit(property.priceUnit)}</div>
        </div>
      </div>

      <div className="card-body">
        <div className="card-location">📍 {property.location}</div>
        <div className="card-title">{property.title}</div>

        {metaParts.length > 0 && (
          <div className="card-meta">
            {metaParts.slice(0, 3).map((m, i) => <span key={i}>{m}</span>)}
          </div>
        )}

        <div className="card-rating">
          ★ {property.rating.toFixed(2)}
          <span style={{ color: 'rgba(248,250,252,0.35)', fontWeight: 400, marginLeft: '0.4rem' }}>
            ({property.reviews} reviews)
          </span>
        </div>

        <div className="card-amenities">
          {property.amenities.slice(0, 3).map(a => (
            <span key={a} className="amenity-tag">{a}</span>
          ))}
        </div>

        <button
          className="card-book-btn"
          onClick={() => onBook(property)}
        >
          {property.priceUnit === 'sale' ? 'Solicitar Proposta' : 'Reservar Visita'}
        </button>
      </div>
    </div>
  );
};
