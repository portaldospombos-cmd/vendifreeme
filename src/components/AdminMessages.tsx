import React, { useState } from 'react';
import { ContactMessage } from '../types';
import { CONTACT_MESSAGES } from '../data';

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>(CONTACT_MESSAGES);

  const toggleReadStatus = (id: string) => {
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, status: m.status === 'unread' ? 'read' : m.status } : m
    ));
  };

  return (
    <div className="admin-messages-page">
      <div className="admin-page-title">Mensagens & Contactos</div>
      <div className="admin-page-sub">Gestão centralizada de pedidos de informação e propostas de parceria</div>

      <div className="dash-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Remetente</th>
                <th>Assunto</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <React.Fragment key={m.id}>
                  <tr>
                    <td style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.4)' }}>
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{m.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)' }}>{m.email}</div>
                    </td>
                    <td>{m.subject}</td>
                    <td>
                      <span className={`booking-status ${
                        m.status === 'unread' ? 'status-pending' : m.status === 'read' ? 'status-confirmed' : 'status-completed'
                      }`}>
                        {m.status === 'unread' ? 'Nova' : m.status === 'read' ? 'Lida' : 'Respondida'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-luxury-outline" 
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.65rem' }}
                        onClick={() => toggleReadStatus(m.id)}
                      >
                        {m.status === 'unread' ? 'Marcar Lida' : 'Ver Detalhes'}
                      </button>
                    </td>
                  </tr>
                  {m.status !== 'unread' && (
                    <tr>
                      <td colSpan={5} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(248,250,252,0.6)', fontStyle: 'italic' }}>
                          "{m.message}"
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                          <button className="btn-luxury" style={{ padding: '0.4rem 1rem', fontSize: '0.7rem' }}>Responder via E-mail</button>
                          <button className="btn-luxury-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.7rem' }}>Arquivar</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
