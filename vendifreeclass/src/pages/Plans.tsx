import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { ArrowLeft, CheckCircle2, Rocket, Sparkles, Trophy, Lock, HelpCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

export default function Plans() {
  const goBack = useBackNavigation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      icon: Rocket,
      price: 9.99,
      color: 'text-on-surface-variant',
      bgColor: 'bg-surface-container-high',
      borderColor: 'border-outline-variant/20',
      features: [
        'Até 20 anúncios ativos',
        '2 destaques manuais por mês',
        'Suporte por email'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Sparkles,
      price: 29.99,
      color: 'text-[#00f5ff]',
      bgColor: 'bg-primary-fixed',
      borderColor: 'border-[#00f5ff]',
      popular: true,
      features: [
        'Anúncios ilimitados',
        '5 destaques manuais por mês',
        'Prioridade nos resultados',
        'Suporte prioritário'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Trophy,
      price: 59.99,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      borderColor: 'border-amber-200',
      features: [
        'Anúncios ilimitados',
        'Destaques automáticos grátis',
        'Página de loja personalizada',
        'Máxima visibilidade',
        'Gestor de conta dedicado'
      ]
    }
  ];

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // In a real app we would integrate Stripe checkout here
      // For now, simulate payment and update plan directly

      const planExpiryDate = new Date();
      planExpiryDate.setMonth(planExpiryDate.getMonth() + 1);

      await supabase.from('profiles').update({
        plan_type: planId,
        is_professional: true,
        plan_expiry: planExpiryDate.toISOString()
      }).eq('id', user.id);

      // Force a reload to get new profile context, or navigate to success
      navigate('/profile');
      window.location.reload(); // Quick way to sync auth context
    } catch (err) {
      console.error('Error upgrading plan', err);
      // Fallback update local context if supabase profile update fails
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32">
      <SEO 
        title="Planos Profissionais" 
        description="Aumente as suas vendas com os nossos planos pensados para o seu negócio."
      />
      
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 rounded-full hover:bg-slate-100 transition-colors active:scale-95 duration-200">
            <ArrowLeft size={24} className="text-[#00f5ff]" />
          </button>
          <h1 className="font-headline font-bold tracking-tight text-xl text-slate-900">Planos Mensais</h1>
        </div>
        <button onClick={() => window.location.href='mailto:suporte@vendifree.pt'} className="p-2 rounded-full hover:bg-slate-100 transition-colors active:scale-95 duration-200">
          <HelpCircle size={24} className="text-slate-500" />
        </button>
      </header>

      <main className="pt-24 px-6 max-w-6xl mx-auto">
        <section className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tight text-on-surface mb-4">
            Aumente o seu volume de negócios
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto font-medium">
            Escolha o plano Profissional ideal e destaque os seus anúncios para vender mais rápido.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-stretch">
          {plans.map((plan) => {
            const isCurrentPlan = profile?.plan_type === plan.id;
            const Icon = plan.icon;

            return (
              <div
                key={plan.id}
                className={`relative rounded-[2rem] p-6 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular 
                    ? `bg-surface-container-lowest ring-2 ${plan.borderColor} shadow-2xl scale-100 md:scale-105 z-10` 
                    : 'bg-surface-container-lowest shadow-[0_4px_24px_rgba(0,0,0,0.02)]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
                    Mais Popular
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute top-4 right-4 bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Atual
                  </div>
                )}

                <div>
                  <div className={`w-12 h-12 rounded-2xl ${plan.bgColor} ${plan.color} flex items-center justify-center mb-6`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-black font-headline mb-2">{plan.name}</h3>
                  
                  <div className="text-3xl font-black mb-6 text-on-surface">
                    {plan.price}€ <span className="text-sm font-medium text-on-surface-variant">/mês</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                        <span className="text-xs font-bold text-on-surface/80 leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <button 
                    disabled={loading || isCurrentPlan}
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full py-3 rounded-full font-bold text-sm transition-all active:scale-95 duration-150 flex justify-center items-center gap-2 ${
                      isCurrentPlan 
                        ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed'
                        : plan.popular
                          ? 'signature-gradient text-white shadow-lg shadow-primary/20' 
                          : 'border border-outline-variant text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {loading && !isCurrentPlan ? <Loader2 size={16} className="animate-spin" /> : null}
                    {isCurrentPlan ? 'Plano Ativo' : 'Subscrever'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}
