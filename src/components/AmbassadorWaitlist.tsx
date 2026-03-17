import React, { useState } from 'react';

export const AmbassadorWaitlist: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    specialty: '',
    volume: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="waitlist-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--gold)' }}>✦</div>
        <h2 style={{ color: 'var(--white-pearl)', marginBottom: '1rem' }}>Candidatura em Análise</h2>
        <p style={{ color: 'rgba(248,250,252,0.6)', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
          Agradecemos o seu interesse no Círculo de Elite de 20 Embaixadores. O seu perfil será avaliado com base no "Mana" e no volume operacional. Entraremos em contacto via canais discretos se houver uma vaga disponível.
        </p>
        <button className="btn-luxury" onClick={onCancel}>Voltar ao Início</button>
      </div>
    );
  }

  return (
    <div className="waitlist-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 2rem' }}>
      {/* HEADER SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ color: 'var(--gold)', letterSpacing: '0.3em', fontSize: '0.8rem', marginBottom: '1.5rem', fontWeight: 700 }}>ACESSO POR CONVITE</div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--white-pearl)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
          O Ecossistema de Elite da Polinésia Francesa ✦
        </h1>
        <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--gold)', marginBottom: '1.5rem' }}>
          Uma infraestrutura tecnológica reservada aos 20 principais curadores do mercado de luxo no Taiti.
        </p>
        <p style={{ fontSize: '1rem', color: 'rgba(248,250,252,0.7)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
          O mercado de ultra-luxo na Polinésia não admite amadorismo. Para o turista de alto padrão e o investidor internacional, a confiança é o ativo mais valioso.
          <br /><br />
          A nossa plataforma de classificados foi desenhada para ser a ferramenta definitiva dos 20 Embaixadores que dominam as transações de prestígio no arquipélago. Unimos a tradição do serviço personalizado à eficiência da tecnologia financeira moderna.
        </p>
      </div>

      <div className="dash-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'start' }}>
        {/* VALUE PROPOSITION */}
        <div style={{ color: 'var(--white-pearl)' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '2rem', color: 'var(--white-pearl)' }}>Porquê candidatar-me ao Grupo dos 20?</h2>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: 'var(--gold)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>Rentabilidade Superior</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(248,250,252,0.5)', lineHeight: 1.6 }}>
              Uma estrutura de comissões otimizada de apenas **6,5%**, garantindo que o valor gerado permanece com quem detém o conhecimento: você.
            </p>
          </div>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: 'var(--gold)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>Liquidez Instantânea</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(248,250,252,0.5)', lineHeight: 1.6 }}>
              Sistema de *split payment* automatizado. Receba os seus honorários no momento da transação, sem burocracias ou esperas.
            </p>
          </div>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: 'var(--gold)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>Exclusividade Garantida</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(248,250,252,0.5)', lineHeight: 1.6 }}>
              Operamos num modelo de *numerus clausus*. Apenas 20 vagas disponíveis para garantir a integridade e o valor da rede.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ color: 'var(--gold)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>Segurança Jurídica</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(248,250,252,0.5)', lineHeight: 1.6 }}>
              Contratos blindados e processos de KYC (*Know Your Customer*) rigorosos, adaptados às exigências das propriedades e serviços de elite.
            </p>
          </div>
        </div>

        {/* APPLICATION FORM */}
        <div className="dash-card" style={{ padding: '2.5rem', background: 'rgba(10,31,61,0.4)', border: '1px solid rgba(201,168,76,0.3)' }}>
          <h4 style={{ marginBottom: '0.5rem', textAlign: 'center', fontSize: '1.2rem' }}>Candidatura de Elite</h4>
          <p style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.4)', textAlign: 'center', marginBottom: '2rem' }}>
            Acesso por Convite ou Candidatura Selecionada.
          </p>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.2rem' }}>
            <div>
              <label style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block', fontWeight: 600 }}>Nome e Título Profissional</label>
              <input 
                required type="text" className="booking-input" placeholder="Ex: Real Estate Broker, Yacht Agent, VIP Concierge"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block', fontWeight: 600 }}>Área de Influência Principal</label>
              <input 
                required type="text" className="booking-input" placeholder="Ex: Bora Bora, Moorea, Atóis Privados"
                value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block', fontWeight: 600 }}>Histórico de Ativos (Volume Anual)</label>
              <select 
                required className="booking-input" style={{ appearance: 'none' }}
                value={form.volume} onChange={e => setForm({...form, volume: e.target.value})}
              >
                <option value="">Selecionar Valor Médio...</option>
                <option value="1m-5m">€1M - €5M</option>
                <option value="5m-15m">€5M - €15M</option>
                <option value="15m+">€15M+</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block', fontWeight: 600 }}>Carta de Intenção</label>
              <textarea 
                required className="booking-input" style={{ minHeight: '120px', resize: 'none' }}
                placeholder="Por que razão a sua rede de contactos deve ocupar uma das 20 vagas oficiais?"
                value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-luxury" style={{ width: '100%', padding: '1rem', marginTop: '1rem', letterSpacing: '0.1em' }}>
              CANDIDATAR-ME AO GRUPO DOS 20 ✦
            </button>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.3)', fontStyle: 'italic', margin: 0 }}>
                Discreção absoluta garantida. Processo de seleção contínuo até ao preenchimento das vagas.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
