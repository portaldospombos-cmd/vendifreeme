import React from 'react';
import { ServiceAddon, HNWLead } from '../types';

interface UpsellEngineProps {
  leads: HNWLead[];
  services: ServiceAddon[];
  onUpsell: (leadId: string, serviceId: string) => void;
}

export const UpsellEngine: React.FC<UpsellEngineProps> = ({ leads, services, onUpsell }) => {
  return (
    <div className="upsell-container">
      <div className="dash-card-title">Motor de Upsell (Cross-Selling HNW)</div>
      <div className="admin-page-sub" style={{ marginBottom: '1rem' }}>
        Identifique oportunidades para aumentar a comissão através de serviços complementares (6.5% Net).
      </div>

      <div className="dash-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {leads.map(lead => (
          <div key={lead.id} className="dash-card" style={{ borderLeft: '4px solid var(--gold)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--white-pearl)' }}>{lead.clientName}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)' }}>{lead.interestArea}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold)' }}>€{(lead.estimatedBudget / 1000).toFixed(0)}K</div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(34,197,94,0.6)' }}>Prob: {lead.conversionProbability}%</div>
              </div>
            </div>

            <div className="sidebar-divider" style={{ margin: '0.75rem 0' }} />
            
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(248,250,252,0.5)', marginBottom: '0.5rem' }}>
              Serviços Recomendados
            </div>

            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {services.map(svc => (
                <div key={svc.id} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '0.6rem', background: 'rgba(248,250,252,0.03)', borderRadius: '4px',
                  border: '1px solid rgba(248,250,252,0.05)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{svc.title}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--gold)' }}>Comissão: €{(svc.price * svc.commissionRate).toLocaleString()}</div>
                  </div>
                  <button 
                    className="btn-luxury" 
                    style={{ fontSize: '0.6rem', padding: '0.3rem 0.6rem' }}
                    onClick={() => onUpsell(lead.id, svc.id)}
                  >
                    Pitch Pitch
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
