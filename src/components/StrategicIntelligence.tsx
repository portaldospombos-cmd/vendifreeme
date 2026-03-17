import React from 'react';

interface AgentProfile {
  id: string;
  name: string;
  codename: string;
  role: string;
  personality: string[];
  focus: string[];
  color: string;
}

const AGENTS: AgentProfile[] = [
  {
    id: 'versus',
    name: 'Versus',
    codename: 'Super CEO',
    role: 'Empreendedor & Visão Global',
    personality: ['Ambicioso', 'Visionário', 'Orientado à Ação', 'Focado em Escala'],
    focus: [
      'Expansão em mercados de luxo (África, Oceania)',
      'Otimização de fluxos de receita premium',
      'Criação de rede de embaixadores de alto impacto'
    ],
    color: 'var(--gold)'
  },
  {
    id: 'venus',
    name: 'Vénus',
    codename: 'Strategist',
    role: 'Estrategista de Mercados & Tendências',
    personality: ['Analítica', 'Precisa', 'Caçadora de Nichos', 'Adaptável'],
    focus: [
      'Procura de nichos globais inexplorados',
      'Monitorização de tendências de mercado em tempo real',
      'Análise de dados para alavancagem de negócio'
    ],
    color: '#3b82f6'
  }
];

export const StrategicIntelligence: React.FC = () => {
  return (
    <div className="strategic-intelligence">
      <div className="admin-page-title">Inteligência Estratégica & Comando</div>
      <div className="admin-page-sub">Monitorização de agentes autónomos e estado global da operação</div>

      <div className="dash-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
        {AGENTS.map(agent => (
          <div key={agent.id} className="dash-card" style={{ borderTop: `4px solid ${agent.color}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '5rem', opacity: 0.05, fontWeight: 900, pointerEvents: 'none' }}>
              {agent.id.toUpperCase()}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: agent.color, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                   {agent.codename}
                </div>
                <div className="dash-card-title" style={{ margin: 0, fontSize: '1.5rem' }}>{agent.name}</div>
              </div>
              <div style={{ padding: '0.4rem 0.8rem', background: 'rgba(248,250,252,0.05)', borderRadius: '20px', fontSize: '0.65rem', border: '1px solid rgba(248,250,252,0.1)' }}>
                Status: Ativo
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
               <div style={{ fontSize: '0.8rem', color: 'rgba(248,250,252,0.6)', marginBottom: '0.75rem', fontWeight: 600 }}>Perfil: {agent.role}</div>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                 {agent.personality.map(p => (
                   <span key={p} style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', background: 'rgba(248,250,252,0.03)', borderRadius: '4px', border: '1px solid rgba(248,250,252,0.05)' }}>
                     {p}
                   </span>
                 ))}
               </div>
            </div>

            <div className="sidebar-divider" style={{ opacity: 0.1, margin: '1rem 0' }} />

            <div>
               <div style={{ fontSize: '0.75rem', color: agent.color, fontWeight: 600, marginBottom: '0.75rem' }}>Foco Operacional</div>
               <div style={{ display: 'grid', gap: '0.75rem' }}>
                 {agent.focus.map(f => (
                   <div key={f} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                     <div style={{ width: '4px', height: '4px', background: agent.color, borderRadius: '50%', marginTop: '6px', flexShrink: 0 }} />
                     <div style={{ fontSize: '0.8rem', color: 'rgba(248,250,252,0.7)', lineHeight: 1.4 }}>{f}</div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        ))}

        <div className="dash-card" style={{ gridColumn: '1 / -1' }}>
          <div className="dash-card-title">Estado do Projeto: Vendifree Global</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(248,250,252,0.8)', lineHeight: 1.6 }}>
                O projeto encontra-se em fase de <strong>alavancagem global</strong>. A infraestrutura está 100% operacional e o foco mudou para a captura de nichos de mercado em ilhas e regiões costeiras premium.
              </div>
              
              <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(34,197,94,0.05)', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.1)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#4ade80' }}>✓ Expansão AmbassadorOS</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(74,222,128,0.6)' }}>Completo</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(201,168,76,0.05)', borderRadius: '6px', border: '1px solid rgba(201,168,76,0.1)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>↻ Lançamento em Mercados Africanos</span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(201,168,76,0.6)' }}>Em curso</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(248,250,252,0.02)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(248,250,252,0.05)' }}>
               <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(248,250,252,0.4)', letterSpacing: '0.1em', marginBottom: '1rem' }}>Métricas Operativas</div>
               <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--white-pearl)' }}>2</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)' }}>Mercados Consolidados</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold)' }}>82.5%</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)' }}>Eficiência de Fecho</div>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ height: '4px', background: 'rgba(248,250,252,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, var(--gold), #4ade80)' }} />
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(248,250,252,0.3)', marginTop: '0.4rem', textAlign: 'right' }}>Progresso Goal Q1: 65%</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
