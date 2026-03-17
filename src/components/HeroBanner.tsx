import React from 'react';
import { PublicTab } from '../types';

interface HeroBannerProps {
  onTabChange: (tab: PublicTab) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onTabChange }) => {
  return (
    <div className="hero-section">
      <div className="hero-ocean-overlay" />
      <div className="hero-wave" />

      {/* Decorative geometric accents */}
      <div style={{
        position: 'absolute', right: '6%', top: '12%',
        width: '180px', height: '180px',
        border: '1px solid rgba(201,168,76,0.08)',
        borderRadius: '50%',
        opacity: 0.5,
      }} />
      <div style={{
        position: 'absolute', right: '9%', top: '15%',
        width: '120px', height: '120px',
        border: '1px solid rgba(201,168,76,0.12)',
        borderRadius: '50%',
      }} />

      <div className="hero-content">
        <div className="hero-badge">Marketplace Global de Classificados Grátis</div>
        <h1 className="hero-title">
          Anuncie Grátis,
          <span className="hero-title-gold">Alcance o Mundo</span>
        </h1>
        <p className="hero-subtitle">
          Vendifree é o portal intermediário de classificados premium para imobiliário, 
          alugueres e viaturas. Publicação gratuita com opções de destaque para maior visibilidade.
        </p>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">150+</span>
            <span className="hero-stat-label">Anúncios Ativos</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">40+</span>
            <span className="hero-stat-label">Países</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">100%</span>
            <span className="hero-stat-label">Grátis</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">24/7</span>
            <span className="hero-stat-label">Disponível</span>
          </div>
        </div>

        <div className="hero-cta-row">
          <button className="btn-luxury" onClick={() => onTabChange('villas')}>
            Ver Anúncios
          </button>
          <button className="btn-luxury-outline" onClick={() => onTabChange('realestate')}>
            Publicar Anúncio
          </button>
        </div>
      </div>

      {/* Feature pills — no emojis */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', right: '2rem',
        display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end'
      }}>
        {[
          { label: 'Publicação Gratuita' },
          { label: 'Plataforma Intermediária' },
          { label: 'Conformidade RGPD' },
        ].map(f => (
          <div key={f.label} style={{
            background: 'rgba(10,31,61,0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '4px',
            padding: '0.35rem 0.8rem',
            fontSize: '0.72rem',
            color: 'rgba(248,250,252,0.7)',
            letterSpacing: '0.05em',
          }}>
            {f.label}
          </div>
        ))}
      </div>
    </div>
  );
};
