import React from 'react';
import { GiftCard } from '../types';

interface GiftCardModalProps {
  card: GiftCard;
  onClose: () => void;
}

export const GiftCardModal: React.FC<GiftCardModalProps> = ({ card, onClose }) => {
  const shareLink = `https://vendifree.luxury/redeem/${card.code}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link de oferta copiado para a área de transferência!');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ padding: 0, overflow: 'hidden', borderRadius: '16px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #0a1f3d 0%, #1a3a5f 100%)', 
          padding: '2.5rem', 
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            padding: '1rem', 
            fontSize: '1.5rem', 
            cursor: 'pointer', 
            color: 'rgba(255,255,255,0.3)' 
          }} onClick={onClose}>×</div>
          
          <div style={{ 
            display: 'inline-block', 
            padding: '0.5rem 1rem', 
            border: '1px solid var(--gold)', 
            borderRadius: '20px', 
            color: 'var(--gold)', 
            fontSize: '0.7rem', 
            letterSpacing: '0.15em', 
            marginBottom: '1.5rem' 
          }}>LUXURY VOUCHER</div>
          
          <h2 style={{ color: 'var(--white-pearl)', fontSize: '2rem', marginBottom: '0.5rem' }}>€{card.value}</h2>
          <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: '0.9rem' }}>
            Válido para: {card.type === 'stay' ? 'Estadia Boutique' : card.type === 'trip' ? 'Viagem Luxury' : 'Créditos Vendifree'}
          </p>
        </div>

        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px dashed rgba(201,168,76,0.3)', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem' 
          }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Código de Ativação</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--white-pearl)' }}>{card.code}</div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'rgba(248,250,252,0.6)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Envie este link para o destinatário da oferta. Eles poderão resgatar o voucher diretamente no momento da reserva.
          </p>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <button className="btn-luxury" onClick={copyToClipboard} style={{ width: '100%' }}>
              Copiar Link de Oferta
            </button>
            <button className="btn-luxury-outline" style={{ width: '100%' }}>
              Enviar por E-mail
            </button>
          </div>
          
          <div style={{ marginTop: '1.5rem', fontSize: '0.65rem', color: 'rgba(248,250,252,0.3)' }}>
            Válido até: {new Date(card.expiryDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
