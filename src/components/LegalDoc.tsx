import React from 'react';

interface LegalDocProps {
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

export const LegalDoc: React.FC<LegalDocProps> = ({ onClose, title, content }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(201,168,76,0.2)', paddingBottom: '1rem' }}>
          <div className="modal-title" style={{ margin: 0 }}>{title}</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(248,250,252,0.5)', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'rgba(248,250,252,0.7)', lineHeight: '1.6', maxHeight: '60vh', overflowY: 'auto', paddingRight: '1rem' }}>
          {content}
        </div>
        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
          <button className="btn-luxury" onClick={onClose}>Compreendo</button>
        </div>
      </div>
    </div>
  );
};
