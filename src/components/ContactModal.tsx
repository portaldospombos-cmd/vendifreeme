import React, { useState } from 'react';

interface ContactModalProps {
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In a real app, this would send to an API. Here we simulate success.
    console.log('Mensagem de contacto enviada:', { name, email, subject, message });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 3000);
  }

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="modal-success-icon">✔️</div>
          <h2 className="modal-success-title">Mensagem Enviada!</h2>
          <p className="modal-success-text">
            Obrigado pelo seu contacto, {name}. A nossa equipa irá analisar o seu pedido e responder para {email} o mais breve possível.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Contacto Vendifree</h2>
        <p className="modal-subtitle">Envie-nos a sua dúvida ou proposta de parceria</p>
        
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Nome Completo</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Ex: João Silva" 
              required 
            />
          </div>
          
          <div className="modal-field">
            <label>E-mail</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="exemplo@email.com" 
              required 
            />
          </div>

          <div className="modal-field">
            <label>Assunto</label>
            <input 
              type="text" 
              value={subject} 
              onChange={e => setSubject(e.target.value)} 
              placeholder="Ex: Dúvida sobre planos premium" 
              required 
            />
          </div>

          <div className="modal-field">
            <label>Mensagem</label>
            <textarea 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              placeholder="Escreva aqui a sua mensagem..." 
              style={{
                width: '100%',
                minHeight: '120px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201, 168, 76, 0.2)',
                borderRadius: '4px',
                color: 'var(--white-pearl)',
                padding: '0.7rem',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
              required 
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="modal-confirm">✦ Enviar Mensagem</button>
          </div>
        </form>
      </div>
    </div>
  );
};
