import React from 'react';
import { Property } from '../types';

interface MysteryListingCardProps {
  property: Property;
  onBook: (property: Property) => void;
  onRequestAccess: (property: Property) => void;
}

export const MysteryListingCard: React.FC<MysteryListingCardProps> = ({ property, onBook, onRequestAccess }) => {
  return (
    <div className="property-card mystery-card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* BLURRED IMAGE SECTION */}
      <div 
        className={`card-image ${property.cardClass}`} 
        style={{ 
          filter: 'blur(15px)', 
          backgroundImage: property.images[0] ? `url(${property.images[0]})` : undefined, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          transform: 'scale(1.1)',
          opacity: 0.6
        }}
      >
        <div className="card-price-tag" style={{ filter: 'none', zIndex: 5 }}>
          <div className="card-price-amount">??.? M€</div>
          <div className="card-price-unit">Pacote Expedição</div>
        </div>
      </div>

      {/* OVERLAY WITH MYSTERY MASK */}
      <div style={{ 
        position: 'absolute', top: 0, left: 0, width: '100%', height: '220px', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(180deg, rgba(5,11,20,0) 0%, rgba(5,11,20,0.8) 100%)',
        zIndex: 2
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.5 }}>🧭</div>
        <div style={{ color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.2em', fontSize: '0.7rem' }}>OFF-THE-RADAR</div>
      </div>

      <div className="card-body">
        <div className="card-location">📍 Coordenadas: {property.location}</div>
        <div className="card-title">Ativo Sob Sigilo: {property.island}</div>
        
        <p style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.4)', margin: '1rem 0', lineHeight: 1.5 }}>
          Este ativo de ultra-luxo primitivo requer validação VIP para visualização de portefólio e detalhes logísticos.
        </p>

        <div className="card-amenities" style={{ filter: 'blur(4px)', opacity: 0.4 }}>
          {property.amenities.slice(0, 3).map(a => (
            <span key={a} className="amenity-tag">{a}</span>
          ))}
        </div>

        <button
          className="card-book-btn"
          style={{ background: 'var(--gold)', color: 'var(--dark-bg)', fontWeight: 700 }}
          onClick={() => onRequestAccess(property)}
        >
          Solicitar Acesso ao Segredo ✦
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span style={{ fontSize: '0.6rem', color: 'rgba(248,250,252,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Acesso Restrito ao Grupo Elite 20
          </span>
        </div>
      </div>
    </div>
  );
};
