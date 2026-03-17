import React, { useState } from 'react';
import { Property } from '../types';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, onClose }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [step, setStep] = useState<'details' | 'proposal' | 'success'>('details');
  const [proposalAmount, setProposalAmount] = useState(property.price);
  const [message, setMessage] = useState('');

  const handleProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  const statusLabels: Record<string, string> = {
    'disponível': 'Disponível para Negócio',
    'reservado': 'Ativo Reservado',
    'negociação': 'Em Fase de Negociação',
    'vendido': 'Ativo Vendido',
    'alugado': 'Ativo Alugado'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box property-detail-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close-x" onClick={onClose}>&times;</button>
        
        {step === 'details' && (
          <div className="detail-layout">
            <div className="detail-gallery">
              <div className="main-image" style={{ backgroundImage: `url(${property.images[activeImage]})` }}>
                <div className="tour-badge" onClick={() => property.virtualTourUrl && window.open(property.virtualTourUrl, '_blank')}>
                  {property.virtualTourUrl ? '🎥 Tour Virtual 360° Disponível' : '📸 Fotos em Alta Resolução'}
                </div>
              </div>
              <div className="thumb-strip">
                {property.images.map((img, i) => (
                  <div 
                    key={i} 
                    className={`thumb ${i === activeImage ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${img})` }}
                    onClick={() => setActiveImage(i)}
                  />
                ))}
              </div>
            </div>

            <div className="detail-info">
              <div className="detail-header">
                <div className={`status-pill pill-${property.status}`}>{statusLabels[property.status]}</div>
                <h2 className="detail-title">{property.title}</h2>
                <p className="detail-location">📍 {property.location}</p>
              </div>

              <div className="detail-specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Área</span>
                  <span className="spec-value">{property.specs.metragem} m²</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Suites</span>
                  <span className="spec-value">{property.specs.suites}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Piscinas</span>
                  <span className="spec-value">{property.specs.piscinas}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Marina</span>
                  <span className="spec-value">{property.specs.marina ? 'Sim' : 'Não'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Heliporto</span>
                  <span className="spec-value">{property.specs.heliporto ? 'Sim' : 'Não'}</span>
                </div>
              </div>

              <div className="detail-description">
                <h3>Descrição</h3>
                <p>{property.description}</p>
              </div>

              <div className="detail-extras">
                {property.specs.extras.map(ex => (
                  <span key={ex} className="extra-tag">✦ {ex}</span>
                ))}
              </div>

              <div className="detail-actions">
                <div className="detail-price">
                  <span className="price-val">{property.price.toLocaleString()}€</span>
                  <span className="price-unit">{property.priceUnit === 'sale' ? 'Preço de Venda' : 'Preço Base'}</span>
                </div>
                <button className="btn-luxury action-btn" onClick={() => setStep('proposal')}>
                  {property.priceUnit === 'sale' ? 'Enviar Proposta' : 'Agendar Visita'}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'proposal' && (
          <div className="proposal-form-container">
            <h2 className="modal-title">{property.priceUnit === 'sale' ? 'Enviar Proposta Formal' : 'Solicitar Visita'}</h2>
            <p style={{ color: 'rgba(248,250,252,0.5)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              A sua proposta será enviada diretamente ao embaixador responsável por este ativo.
            </p>
            
            <form onSubmit={handleProposal}>
              {property.priceUnit === 'sale' && (
                <div className="modal-field">
                  <label>Valor da Proposta (€)</label>
                  <input 
                    type="number" 
                    value={proposalAmount} 
                    onChange={e => setProposalAmount(Number(e.target.value))}
                    className="booking-input"
                  />
                </div>
              )}
              <div className="modal-field">
                <label>Mensagem ou Requisitos Especiais</label>
                <textarea 
                  rows={4} 
                  value={message} 
                  onChange={e => setMessage(e.target.value)}
                  className="booking-input"
                  placeholder="Ex: Gostaria de agendar para o próximo fim de semana..."
                />
              </div>
              <div className="modal-actions" style={{ marginTop: '2rem' }}>
                <button type="button" className="btn-ghost" onClick={() => setStep('details')}>Voltar</button>
                <button type="submit" className="btn-luxury">Confirmar Envio</button>
              </div>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="modal-success" style={{ padding: '3rem 0', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
            <h2 style={{ color: 'var(--gold)' }}>Solicitação Enviada!</h2>
            <p style={{ color: 'rgba(248,250,252,0.6)', maxWidth: '400px', margin: '1rem auto' }}>
              O embaixador responsável entrará em contacto consigo nas próximas 24 horas para dar seguimento ao negócio.
            </p>
            <button className="btn-luxury" style={{ marginTop: '2rem' }} onClick={onClose}>Fechar</button>
          </div>
        )}
      </div>
    </div>
  );
};
