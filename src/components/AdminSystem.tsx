import React from 'react';

export const AdminSystem: React.FC = () => {
  const stacks = [
    {
      group: 'Frontend & Mobile',
      techs: [
        { name: 'React / Next.js', status: 'Recomendado', desc: 'Performance SEO e SSR.' },
        { name: 'React Native', status: 'Planeado', desc: 'App nativa iOS/Android.' }
      ]
    },
    {
      group: 'Backend & Data',
      techs: [
        { name: 'Node.js (Express)', status: 'Recomendado', desc: 'Microserviços real-time.' },
        { name: 'PostgreSQL / MongoDB', status: 'Recomendado', desc: 'Persistência híbrida.' }
      ]
    },
    {
      group: 'Infraestrutura Cloud',
      techs: [
        { name: 'AWS S3 + Cloudfront', status: 'Configuração', desc: 'CDN Global para Media HD.' },
        { name: 'Vercel / AWS Amplify', status: 'Deploy', desc: 'Hospedagem de alto tráfego.' }
      ]
    },
    {
      group: 'Segurança & Compliance',
      techs: [
        { name: 'SSL/TLS & 2FA', status: 'Obrigatório', desc: 'Criptografia e login seguro.' },
        { name: 'GDPR / RGPD', status: 'Ativo', desc: 'Conformidade legal europeia.' }
      ]
    }
  ];

  return (
    <div>
      <div className="admin-page-title">Configuração de Infraestrutura Digital</div>
      <div className="admin-page-sub">Stack tecnológico recomendado para operação global 100% digital</div>

      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-label">Conformidade GDPR</div>
          <div className="stat-value" style={{ color: '#10b981' }}>100%</div>
          <div className="stat-sub">Regras EU ativas</div>
        </div>
        <div className="stat-card">
           <div className="stat-label">Latência Global</div>
           <div className="stat-value">24ms</div>
           <div className="stat-sub">Via AWS Cloudfront</div>
        </div>
        <div className="stat-card">
           <div className="stat-label">Uptime</div>
           <div className="stat-value">99.9%</div>
           <div className="stat-sub">Cloud-native design</div>
        </div>
      </div>

      <div className="dash-grid">
        {stacks.map(group => (
          <div key={group.group} className="dash-card">
            <div className="dash-card-title">{group.group}</div>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              {group.techs.map(t => (
                <div key={t.name} style={{ padding: '1rem', background: 'rgba(248,250,252,0.03)', borderRadius: '6px', border: '1px solid rgba(248,250,252,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--white-pearl)' }}>{t.name}</span>
                    <span style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', background: 'rgba(201,168,76,0.1)', color: 'var(--gold)', borderRadius: '4px' }}>{t.status}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.45)' }}>{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="dash-card" style={{ gridColumn: '1 / -1' }}>
          <div className="dash-card-title">Integração de Pagamentos Internacionais</div>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', alignItems: 'center', opacity: 0.8 }}>
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" style={{ height: '30px', filter: 'grayscale(1) invert(1)' }} />
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: '25px', filter: 'grayscale(1) invert(1)' }} />
             <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#37517e' }}>Wise</div>
             <p style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'rgba(248,250,252,0.5)', maxWidth: '400px' }}>
                Conectividade garantida para comissões automáticas de embaixadores e subscrições premium.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
