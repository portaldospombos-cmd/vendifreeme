import React, { useState } from 'react';

interface Plan {
  id: string;
  name: string;
  price: string;
  priceDetail: string;
  badge: string | null;
  features: string[];
  cta: string;
  highlight: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Grátis',
    price: '0€',
    priceDetail: 'para sempre',
    badge: null,
    features: [
      'Publicação de anúncio padrão',
      'Visível em todas as categorias',
      'Contacto direto com interessados',
      'Gestão básica do ativo',
    ],
    cta: 'Publicar Agora',
    highlight: false,
  },
  {
    id: 'weekly',
    name: 'Destaque Semanal',
    price: '19€',
    priceDetail: '/ 7 dias',
    badge: 'Popular',
    features: [
      'Posição destacada na busca',
      'Etiqueta "Premium" no anúncio',
      'Aparece no topo por 7 dias',
      'Suporte prioritário via chat',
    ],
    cta: 'Destacar Ativo',
    highlight: false,
  },
  {
    id: 'premium_sub',
    name: 'Membro Premium',
    price: '49€',
    priceDetail: '/ mês',
    badge: 'Recomendado',
    features: [
      'Acesso antecipado a novos ativos',
      'Destaques mensais incluídos (2)',
      'Relatórios detalhados de mercado',
      'Marketing em portais parceiros',
    ],
    cta: 'Ser Premium',
    highlight: true,
  },
  {
    id: 'urgent',
    name: 'Marketing Global',
    price: '199€',
    priceDetail: 'sob consulta',
    badge: 'Resultados Rápidos',
    features: [
      'Campanhas em Redes Sociais',
      'Anúncios internacionais (Ads)',
      'Aparece em portais especializados',
      'Consultoria focada em vendas',
    ],
    cta: 'Solicitar Campanha',
    highlight: false,
  },
];

const PREMIUM_SERVICES = [
  {
    title: 'Consultoria de Vendas Personalizada',
    desc: 'Ajuda profissional em toda a fase de negociação, documentação legal e fecho do negócio.',
    icon: '💼'
  },
  {
    title: 'Tours Virtuais 3D (Matterport)',
    desc: 'Criação de experiências imersivas 360° para ativos de luxo com alta resolução.',
    icon: '📸'
  },
  {
    title: 'Marketing Internacional',
    desc: 'Campanhas em portais internacionais e gestão de tráfego pago para audiências de elite.',
    icon: '🌍'
  }
];

interface PricingPlansProps {
  onPlanSelect?: (planId: string) => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ onPlanSelect }) => {
  const [activeTab, setActiveTab] = useState<'planos' | 'servicos'>('planos');

  return (
    <div className="pricing-section">
      <div className="pricing-header">
        <div className="why-us-badge">Serviços Premium & Monetização</div>
        <div className="why-us-title">Otimize o seu Negócio na Vendifree</div>
        <p className="pricing-subtitle">
          Alavanque as suas vendas com ferramentas de marketing avançadas, destaques globais e consultoria especializada.
        </p>
        <div className="pricing-tab-switcher">
          <button
            className={`pricing-tab ${activeTab === 'planos' ? 'active' : ''}`}
            onClick={() => setActiveTab('planos')}
          >
            Planos de Assinatura
          </button>
          <button
            className={`pricing-tab ${activeTab === 'servicos' ? 'active' : ''}`}
            onClick={() => setActiveTab('servicos')}
          >
            Serviços Adicionais
          </button>
        </div>
      </div>

      {activeTab === 'planos' && (
        <div className="plans-grid">
          {PLANS.map(plan => (
            <div key={plan.id} className={`plan-card ${plan.highlight ? 'plan-card-highlight' : ''}`}>
              {plan.badge && (
                <div className={`plan-badge ${plan.id === 'urgent' ? 'plan-badge-urgent' : 'plan-badge-gold'}`}>
                  {plan.badge}
                </div>
              )}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">
                {plan.price}
                <span className="plan-price-detail">{plan.priceDetail}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map(f => (
                  <li key={f}>
                    <span className="plan-check">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                className={`plan-cta ${plan.highlight ? 'plan-cta-primary' : 'plan-cta-ghost'}`}
                onClick={() => onPlanSelect?.(plan.id)}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'servicos' && (
        <div className="business-phases">
          <div className="phases-grid">
            {PREMIUM_SERVICES.map(service => (
              <div key={service.title} className="phase-card">
                <div className="phase-number" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{service.icon}</div>
                <div className="phase-name">{service.title}</div>
                <div className="phase-desc" style={{ marginTop: '0.5rem' }}>{service.desc}</div>
                <button className="btn-luxury" style={{ marginTop: '1.5rem', width: '100%', fontSize: '0.7rem' }}>Solicitar Orçamento</button>
              </div>
            ))}
          </div>
          <div className="business-contact">
            <p>Comissões de Intermediação: 25% a 30% sobre o valor gerado para embaixadores parceiros.</p>
          </div>
        </div>
      )}
    </div>
  );
};
