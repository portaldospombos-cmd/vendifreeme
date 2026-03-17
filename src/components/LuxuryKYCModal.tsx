import React, { useState } from 'react';

interface LuxuryKYCModalProps {
  onClose: () => void;
  onVerify: (proofUrl: string) => void;
}

export const LuxuryKYCModal: React.FC<LuxuryKYCModalProps> = ({ onClose, onVerify }) => {
  const [method, setMethod] = useState<'pof' | 'bank_letter' | 'family_office'>('bank_letter');
  const [fileAttached, setFileAttached] = useState(false);

  const handleSubmit = () => {
    if (fileAttached) {
      onVerify('https://secure.vendifree.com/vault/verified_pof.pdf');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '650px', padding: '3rem', background: '#050b14', border: '1px solid var(--gold)' }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ color: 'var(--gold)', fontSize: '2rem', marginBottom: '1rem' }}>✧</div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--white-pearl)', marginBottom: '1rem' }}>Protocolo de Verificação VIP</h2>
          <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Para aceder aos ativos "Fantasma" (Off-Market) e serviços de concierge ilimitados, solicitamos uma validação de prestígio. Este processo é estritamente confidencial e gerido pela nossa Direção de Operações.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div 
            onClick={() => setMethod('bank_letter')}
            style={{ 
              padding: '1.5rem', border: '1px solid', 
              borderColor: method === 'bank_letter' ? 'var(--gold)' : 'rgba(248,250,252,0.1)',
              background: method === 'bank_letter' ? 'rgba(201,168,76,0.05)' : 'transparent',
              cursor: 'pointer', borderRadius: '8px', transition: '0.3s'
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--white-pearl)', marginBottom: '0.3rem' }}>Carta de Recomendação Bancária</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.4)' }}>Documento emitido pelo seu Banco de Investimento confirmando o estatuto de cliente Private.</div>
          </div>

          <div 
            onClick={() => setMethod('pof')}
            style={{ 
              padding: '1.5rem', border: '1px solid', 
              borderColor: method === 'pof' ? 'var(--gold)' : 'rgba(248,250,252,0.1)',
              background: method === 'pof' ? 'rgba(201,168,76,0.05)' : 'transparent',
              cursor: 'pointer', borderRadius: '8px', transition: '0.3s'
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--white-pearl)', marginBottom: '0.3rem' }}>Proof of Funds (PoF)</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.4)' }}>Extrato ou certificado de liquidez para transações superiores a €5M.</div>
          </div>

          <div 
            onClick={() => setMethod('family_office')}
            style={{ 
              padding: '1.5rem', border: '1px solid', 
              borderColor: method === 'family_office' ? 'var(--gold)' : 'rgba(248,250,252,0.1)',
              background: method === 'family_office' ? 'rgba(201,168,76,0.05)' : 'transparent',
              cursor: 'pointer', borderRadius: '8px', transition: '0.3s'
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--white-pearl)', marginBottom: '0.3rem' }}>Family Office Validation</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.4)' }}>Certificação discreta através do seu gestor de património.</div>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(248,250,252,0.03)', border: '1px dashed rgba(248,250,252,0.1)', 
          padding: '2rem', borderRadius: '8px', textAlign: 'center', marginBottom: '2rem'
        }}>
          {!fileAttached ? (
            <div onClick={() => setFileAttached(true)} style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📁</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>Anexar Documento Confidencial</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.3)', marginTop: '0.4rem' }}>PDF ou Imagem Protegida (Max 10MB)</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Documento Pronto para Envio 🔒</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.5)', marginTop: '0.2rem' }}>verified_credentials.pdf</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-luxury" style={{ flex: 1, padding: '1rem' }} onClick={onClose}>Cancelar</button>
          <button 
            className="btn-luxury" 
            style={{ flex: 2, padding: '1rem', opacity: fileAttached ? 1 : 0.5 }} 
            disabled={!fileAttached}
            onClick={handleSubmit}
          >
            Solicitar Acesso VIP ✦
          </button>
        </div>
        
        <p style={{ fontSize: '0.6rem', color: 'rgba(248,250,252,0.2)', textAlign: 'center', marginTop: '1.5rem' }}>
          Todos os dados são encriptados de ponta-a-ponta e eliminados após a validação física.
        </p>
      </div>
    </div>
  );
};
