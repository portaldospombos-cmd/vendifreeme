import React, { useState } from 'react';
import { GiftCard } from '../types';

interface GiftCardStoreProps {
  onPurchase: (card: GiftCard) => void;
  onCancel: () => void;
}

const GIFT_OPTIONS = [
  { id: 'stay-500', title: 'Estadia Boutique', value: 500, type: 'stay', desc: 'Voucher para estadia em villas boutique selecionadas.' },
  { id: 'trip-1500', title: 'Viagem Luxury St. John', value: 1500, type: 'trip', desc: 'Experiência completa em St. John com passeios exclusivos.' },
  { id: 'trip-5000', title: 'Private Island Escape', value: 5000, type: 'trip', desc: 'Fuga exclusiva para ilha privada na Polinésia.' },
  { id: 'credits-100', title: 'Créditos Vendifree', value: 100, type: 'credits', desc: 'Créditos para descontos em qualquer reserva ou serviço.' },
];

export const GiftCardStore: React.FC<GiftCardStoreProps> = ({ onPurchase, onCancel }) => {
  const [selected, setSelected] = useState(GIFT_OPTIONS[0]);

  const handleBuy = () => {
    const newCard: GiftCard = {
      id: `gc-${Math.random().toString(36).substr(2, 9)}`,
      code: `LUXE-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${new Date().getFullYear()}`,
      value: selected.value,
      buyerName: 'Usuário Ativo',
      status: 'valid',
      type: selected.type as any,
      createdAt: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    onPurchase(newCard);
  };

  return (
    <div className="dash-card">
      <div className="admin-page-title">Loja de Gift Cards Luxury</div>
      <div className="admin-page-sub">Ofereça experiências inesquecíveis ou subscreva créditos para viagens futuras</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        {GIFT_OPTIONS.map(opt => (
          <div 
            key={opt.id} 
            onClick={() => setSelected(opt)}
            style={{ 
              padding: '1.5rem', 
              background: selected.id === opt.id ? 'rgba(201,168,76,0.15)' : 'rgba(248,250,252,0.03)', 
              border: selected.id === opt.id ? '2px solid var(--gold)' : '1px solid rgba(248,250,252,0.08)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              {opt.type === 'stay' ? '🏨' : opt.type === 'trip' ? '✈️' : '💎'}
            </div>
            <div style={{ fontWeight: 700, color: 'var(--white-pearl)', fontSize: '1rem', marginBottom: '0.4rem' }}>{opt.title}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(248,250,252,0.5)', marginBottom: '1rem', height: '40px' }}>{opt.desc}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold)' }}>€{opt.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        <button className="btn-luxury-outline" onClick={onCancel}>Voltar</button>
        <button className="btn-luxury" onClick={handleBuy}>Confirmar & Gerar Cartão ✦</button>
      </div>
    </div>
  );
};
