import React from 'react';
import { AmbassadorWaitlist } from './AmbassadorWaitlist';

interface AmbassadorLandingProps {
  onClose: () => void;
}

export const AmbassadorLanding: React.FC<AmbassadorLandingProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '1000px', padding: 0, background: '#050b14', border: '1px solid rgba(201,168,76,0.2)', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <div 
          style={{ 
            position: 'absolute', 
            top: '1.5rem', 
            right: '1.5rem', 
            zIndex: 10, 
            cursor: 'pointer', 
            fontSize: '1.5rem', 
            color: 'rgba(255,255,255,0.3)',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)'
          }} 
          onClick={onClose}
        >
          ×
        </div>
        <AmbassadorWaitlist onCancel={onClose} />
      </div>
    </div>
  );
};
