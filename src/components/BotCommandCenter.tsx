import React, { useState } from 'react';
import { BotSystemStatus, BotMessage } from '../types';
import { BOT_SYSTEM_DATA } from '../data';

export const BotCommandCenter: React.FC = () => {
  const [system, setSystem] = useState<BotSystemStatus>(BOT_SYSTEM_DATA);
  const [chatMode, setChatMode] = useState(true);
  const [adminCommand, setAdminCommand] = useState('');
  const [isSupervised, setIsSupervised] = useState(false);
  const [tokenEfficiency, setTokenEfficiency] = useState(true);
  const [isBotsEnabled, setIsBotsEnabled] = useState(true);

  const handleAdvance = (msgId: string) => {
    setSystem(prev => ({
      ...prev,
      messages: prev.messages.map(m => m.id === msgId ? { ...m, requiresAction: false } : m)
    }));
    alert('Comando "Avançar" enviado aos Bots. Ação em processamento...');
  };

  const copyToClaude = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('Mensagem do Bot copiada! Cole no Claude para obter a resposta estratégica.');
  };

  const sendMasterCommand = () => {
    if (!adminCommand.trim()) return;
    const newMsg: BotMessage = {
      id: `cmd-${Date.now()}`,
      sender: 'Admin',
      content: `[COMMAND]: ${adminCommand}`,
      timestamp: new Date().toISOString(),
      requiresAction: false
    };
    setSystem(prev => ({ ...prev, messages: [...prev.messages, newMsg] }));
    setAdminCommand('');
    alert('Comando Mestre enviado ao Tri-Bot. O sistema ajustará a operação imediatamente.');
  };

  return (
    <div className="admin-bot-center">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="admin-page-title">Centro de Sinergia Bot-Arquiteto</div>
          <div className="admin-page-sub">Supervisão estratégica de Versus, Vénus e o Arquiteto de Skills</div>
        </div>
        <button 
          className={isBotsEnabled ? "btn-luxury" : "btn-luxury-outline"}
          style={{ 
            background: isBotsEnabled ? 'rgba(201,168,76,0.2)' : 'rgba(239, 68, 68, 0.1)',
            borderColor: isBotsEnabled ? 'var(--gold)' : '#ef4444',
            color: isBotsEnabled ? 'var(--gold)' : '#ef4444'
          }}
          onClick={() => setIsBotsEnabled(!isBotsEnabled)}
        >
          {isBotsEnabled ? '✦ BOTS ONLINE' : '○ BOTS OFFLINE'}
        </button>
      </div>

      <div style={{ opacity: isBotsEnabled ? 1 : 0.3, pointerEvents: isBotsEnabled ? 'all' : 'none', transition: '0.3s' }}>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-label">Barómetro de Escalabilidade</div>
          <div className="stat-value" style={{ color: 'var(--gold)' }}>{system.scalability.current}%</div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)' }}>Orientação: {system.scalability.orientation}</div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ width: `${system.scalability.current}%`, height: '100%', background: 'var(--gold)' }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Poupança de Tokens (Skills)</div>
          <div className="stat-value">94.2%</div>
          <div className="stat-sub">Eficiência de Custo Local</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Modo Operacional</div>
          <div className="stat-value" style={{ fontSize: '1rem', color: isSupervised ? 'var(--gold)' : 'var(--white-pearl)' }}>
            {isSupervised ? 'Admin Supervised' : 'Autonomous Shadow'}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button 
              className="btn-luxury-outline" 
              style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', flex: 1 }}
              onClick={() => setIsSupervised(!isSupervised)}
            >
              {isSupervised ? 'Liberar Bots' : 'Intervir'}
            </button>
            <button 
              className={`btn-luxury-outline ${tokenEfficiency ? 'active' : ''}`}
              style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', flex: 1, borderColor: tokenEfficiency ? 'var(--gold)' : 'inherit' }}
              onClick={() => setTokenEfficiency(!tokenEfficiency)}
            >
              Skill: {tokenEfficiency ? 'Minimalist' : 'Normal'}
            </button>
          </div>
        </div>
      </div>

      <div className="dash-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* BOT CHAT & CLAUDE WORKFLOW */}
        <div className="dash-card">
          <div className="dash-card-title">Comunicação Bot-Humano</div>
          <div className="bot-chat-container" style={{ height: '400px', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            {system.messages.map(msg => (
              <div key={msg.id} style={{ 
                alignSelf: 'flex-start', 
                maxWidth: '85%', 
                padding: '1rem', 
                background: msg.sender === 'Architect' ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.03)', 
                borderLeft: `4px solid ${msg.sender === 'Architect' ? 'var(--gold)' : '#3b82f6'}`,
                borderRadius: '0 8px 8px 8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.7rem', color: msg.sender === 'Architect' ? 'var(--gold)' : '#3b82f6' }}>{msg.sender.toUpperCase()}</span>
                  <span style={{ fontSize: '0.6rem', color: 'rgba(248,250,252,0.3)' }}>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--white-pearl)' }}>{msg.content}</div>
                
                {msg.requiresAction && (
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-luxury" style={{ fontSize: '0.65rem', padding: '0.3rem 0.8rem' }} onClick={() => copyToClaude(msg.content)}>
                      Copiar para Claude
                    </button>
                    <button className="btn-luxury-outline" style={{ fontSize: '0.65rem', padding: '0.3rem 0.8rem' }} onClick={() => handleAdvance(msg.id)}>
                      Avançar Projeto
                    </button>
                    <button className="btn-luxury-outline" style={{ fontSize: '0.65rem', padding: '0.3rem 0.8rem', opacity: 0.5 }}>
                      Pausar / Rever
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="filter-select-adv" 
              placeholder="Enviar comando mestre aos bots..." 
              value={adminCommand}
              onChange={e => setAdminCommand(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMasterCommand()}
              style={{ flex: 1, background: 'rgba(0,0,0,0.3)' }}
            />
            <button className="btn-luxury" onClick={sendMasterCommand}>Comandar</button>
          </div>
        </div>

        {/* SKILL BUILDER & PROGRESS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="dash-card">
            <div className="dash-card-title">Arquiteto: Evolução de Skills</div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {[
                { name: 'Auto-Vetting 2.1', progress: 100, status: 'Active' },
                { name: 'Conversion Matrix', progress: 65, status: 'Building...' },
                { name: 'Fraud Sentinel', progress: 90, status: 'Refining' },
              ].map(skill => (
                <div key={skill.name} style={{ padding: '0.75rem', background: 'rgba(248,250,252,0.03)', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600 }}>{skill.name}</span>
                    <span style={{ color: 'var(--gold)' }}>{skill.status}</span>
                  </div>
                  <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', borderRadius: '1px' }}>
                    <div style={{ width: `${skill.progress}%`, height: '100%', background: 'var(--gold)' }} />
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', marginTop: '1rem', fontStyle: 'italic' }}>
              O Arquiteto converte padrões de uso em "Local Skills" para eliminar latência e custos de API.
            </p>
          </div>

          <div className="dash-card" style={{ background: 'rgba(201,168,76,0.05)' }}>
            <div className="dash-card-title">Ações Recentes (Ledger)</div>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {system.lastDecisions.map(dec => (
                <div key={dec.id} style={{ fontSize: '0.7rem', display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ color: 'rgba(248,250,252,0.6)' }}>{dec.botName}: {dec.action}</span>
                  <span style={{ color: 'var(--gold)' }}>{dec.tokenSavings} Safe</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
