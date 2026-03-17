import React, { useState, useEffect } from 'react';
import { Property } from '../types';

interface FeaturedCarouselProps {
  properties: Property[];
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ properties }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (properties.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % properties.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [properties.length]);

  if (properties.length === 0) return null;

  const current = properties[currentIndex];

  const getCardClass = (category: string) => {
    switch (category) {
      case 'villas': return 'card-villa-1';
      case 'realestate': return 'card-re-1';
      case 'hotels': return 'card-hotel-1';
      case 'cars': return 'card-car-1';
      default: return 'card-villa-1';
    }
  };

  return (
    <div className="carousel-container">
      <div className="carousel-badge">Destaques Premium</div>
      
      <div className="carousel-slide-wrapper">
        {properties.map((prop, index) => (
          <div 
            key={prop.id} 
            className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
            style={{ display: index === currentIndex ? 'flex' : 'none' }}
          >
            <div className={`carousel-image ${getCardClass(prop.category)}`}>
              <div className="card-emoji">{prop.category === 'cars' ? '🏎️' : prop.category === 'hotels' ? '🏨' : '🏡'}</div>
              <div className="carousel-price-tag">
                <div className="carousel-price-amount">€{prop.price.toLocaleString()}</div>
                <div className="carousel-price-unit">{prop.category === 'villas' || prop.category === 'cars' ? '/ semana' : 'valor total'}</div>
              </div>
            </div>
            
            <div className="carousel-info">
              <div className="carousel-location">{prop.location}</div>
              <h2 className="carousel-title">{prop.title}</h2>
              <p className="carousel-description">
                Este ativo de elite foi selecionado pela nossa equipa estratégica para máxima visibilidade global. 
                Aproveite esta oportunidade única de investimento ou lazer.
              </p>
              <div className="carousel-meta">
                {prop.category === 'villas' && (
                  <>
                    <span>{prop.bedrooms || prop.specs.suites} Quartos</span>
                    <span>•</span>
                    <span>{prop.bathrooms || prop.specs.suites} Banhos</span>
                  </>
                )}
                {prop.category === 'cars' && prop.specs.extras && (
                  <>
                    <span>{prop.specs.extras[0] || 'Premium'}</span>
                    <span>•</span>
                    <span>{prop.specs.metragem ? `${prop.specs.metragem} cv` : 'Performance'}</span>
                  </>
                )}
                {prop.category === 'realestate' && (
                  <>
                    <span>{prop.specs.metragem} m²</span>
                    <span>•</span>
                    <span>{prop.specs.suites} Suites</span>
                  </>
                )}
              </div>
              <button className="btn-luxury">Ver Detalhes ✦</button>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel-dots">
        {properties.map((_, index) => (
          <button 
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};
