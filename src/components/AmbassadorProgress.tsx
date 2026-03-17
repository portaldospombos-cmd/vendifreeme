import React from 'react';
import { AmbassadorTier } from '../types';

interface AmbassadorProgressProps {
  tier: AmbassadorTier;
  totalVolume: number;
}

const TIER_REQUIREMENTS = {
  Starter: { next: 'Silver', target: 100000, commission: '10%' },
  Silver: { next: 'Gold', target: 500000, commission: '15%' },
  Gold: { next: 'Platinum', target: 1000000, commission: '20%' },
  Platinum: { next: 'Elite', target: 2000000, commission: '25%' },
  Elite: { next: null, target: Infinity, commission: '30%' },
};

export const AmbassadorProgress: React.FC<AmbassadorProgressProps> = ({ tier, totalVolume }) => {
  const current = TIER_REQUIREMENTS[tier];
  const progress = current.next ? Math.min((totalVolume / current.target) * 100, 100) : 100;

  return (
    <div className="dash-card" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(10,31,61,0.5) 100%)', border: '1px solid rgba(201,168,76,0.3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <div className="stat-label" style={{ color: 'var(--gold)', fontWeight: 700 }}>Nível {tier}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.5)' }}>Comissão Atual: {current.commission}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="stat-value" style={{ fontSize: '1.2rem' }}>€{totalVolume.toLocaleString()}</div>
          <div className="stat-label">Volume Total</div>
        </div>
      </div>

      <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
        <div style={{ 
          height: '100%', 
          width: `${progress}%`, 
          background: 'linear-gradient(90deg, var(--gold-dark), var(--gold))',
          transition: 'width 1s ease-in-out'
        }} />
      </div>

      {current.next && (
        <div style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Faltam €{(current.target - totalVolume).toLocaleString()} para {current.next}</span>
          <span>Próximo nível: {TIER_REQUIREMENTS[current.next as AmbassadorTier].commission} Comis.</span>
        </div>
      )}
      {!current.next && (
        <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 700, textAlign: 'center' }}>
          ✦ NÍVEL MÁXIMO ATINGIDO: ELITE PARTNER ✦
        </div>
      )}
    </div>
  );
};
