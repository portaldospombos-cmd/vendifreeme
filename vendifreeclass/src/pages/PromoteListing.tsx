import SEO from '../components/SEO';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { ArrowLeft, CheckCircle2, Rocket, Sparkles, Trophy, Lock, HelpCircle, Zap, Loader2 } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

export default function PromoteListing() {
  const goBack = useBackNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.productId || location.state?.listingId;
  const { t, formatPrice } = useSettings();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'bronze' | 'silver' | 'gold'>('free');
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'free',
      icon: Zap,
      color: 'text-on-surface-variant',
      bgColor: 'bg-surface-container-low',
      borderColor: 'border-outline-variant/10',
      key: 'free'
    },
    {
      id: 'bronze',
      icon: Rocket,
      color: 'text-on-surface-variant',
      bgColor: 'bg-surface-container-high',
      borderColor: 'border-outline-variant/20',
      key: 'bronze'
    },
    {
      id: 'silver',
      icon: Sparkles,
      color: 'text-[#00f5ff]',
      bgColor: 'bg-primary-fixed',
      borderColor: 'border-[#00f5ff]',
      key: 'silver',
      popular: true
    },
    {
      id: 'gold',
      icon: Trophy,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      borderColor: 'border-amber-200',
      key: 'gold'
    }
  ];

  const currentPlanData = (t('plans') as any)[selectedPlan];
  const isFree = selectedPlan === 'free';

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32">
      <SEO 
        title="Promover Anúncio" 
        description="Destaque o seu anúncio e venda mais rápido com Vendifree."
      />
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => goBack()}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors active:scale-95 duration-200"
            >
              <ArrowLeft size={24} className="text-[#00f5ff]" />
            </button>
            <h1 className="font-headline font-bold tracking-tight text-xl text-slate-900">{t('plans.title')}</h1>
          </div>
          <button onClick={() => window.location.href='mailto:suporte@vendifree.pt'} className="p-2 rounded-full hover:bg-slate-100 transition-colors active:scale-95 duration-200">
            <HelpCircle size={24} className="text-slate-500" />
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="mb-12 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-black font-headline tracking-tight text-on-surface mb-4">
            {t('plans.title')}
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl font-medium">
            {t('plans.subtitle')}
          </p>
        </section>

        {/* Pricing Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 items-stretch">
          {plans.map((plan) => {
            const planData = (t('plans') as any)[plan.key];
            const isSelected = selectedPlan === plan.id;
            const Icon = plan.icon;

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedPlan(plan.id as any)}
                className={`relative cursor-pointer rounded-[2rem] p-6 flex flex-col justify-between transition-all duration-300 ${
                  isSelected 
                    ? `bg-surface-container-lowest ring-2 ${plan.borderColor} shadow-2xl scale-105 z-10` 
                    : 'bg-surface-container-lowest shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-lg opacity-80 hover:opacity-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
                    {t('plans.popular')}
                  </div>
                )}

                <div>
                  <div className={`w-12 h-12 rounded-2xl ${plan.bgColor} ${plan.color} flex items-center justify-center mb-6`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-black font-headline mb-2">{planData.name}</h3>
                  <p className="text-on-surface-variant text-xs mb-6 font-medium leading-relaxed">{planData.tagline}</p>
                  
                  <div className="space-y-3 mb-8">
                    {planData.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-secondary shrink-0 mt-0.5" />
                        <span className="text-xs font-bold text-on-surface/80 leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-black mb-6 text-on-surface">
                    {planData.price === 0 ? t('plans.free.name') : formatPrice(planData.price)}
                  </div>
                  <button 
                    id={`btn_select_plan_${plan.id}`}
                    className={`w-full py-3 rounded-full font-bold text-sm transition-all active:scale-95 duration-150 ${
                      isSelected 
                        ? 'signature-gradient text-white shadow-lg shadow-primary/20' 
                        : 'border border-outline-variant text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {isSelected ? `${t('plans.select')} ${planData.name}` : t('plans.select')}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Order Summary & Trust */}
        <div className="bg-surface-container-low rounded-[2.5rem] p-8 md:p-12 mb-20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <h4 className="text-2xl font-black font-headline">{t('plans.summary')}</h4>
              <p className="text-on-surface-variant font-medium leading-relaxed">
                {t('plans.summaryDesc').split('{plan}').map((part: string, i: number, arr: string[]) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <span className="font-black text-primary">{currentPlanData.name}</span>}
                  </span>
                ))}
              </p>
              
              {!isFree && (
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 pt-4">
                  <img 
                    alt="Payment Methods" 
                    className="h-8 opacity-60 grayscale hover:grayscale-0 transition-all" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDij-RHQC2Di5sm6P6moeIHcvfOEHLEiQAwAXXT8dl1YQ59zlDQUw0miwwR4_TPF0vMlD86AAWb-_QMcr-F475CoZ6rnzjnL1Wg8RVSK5AEa6Kx9l9nrbP5wh45Yq_b99Qd2CBSgTo0FTteDQL8G8py3pVfCFafDJTZDaUSJHIdTJizEv--rPwdUtTo1V3nnR8ofrfWRidtogfRkUIt2InnQJyYQzkNN6a6thV-TNdkOl0IEKgmSGQInshysNoJakx-tB8k7GiRr7yw"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden sm:block h-6 w-[1px] bg-outline-variant"></div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-widest">
                    <Lock size={14} />
                    {t('plans.securePayment')}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-surface-container-lowest p-8 rounded-[2rem] w-full md:w-96 shadow-xl shadow-on-surface/5 text-center border border-outline-variant/10">
              <div className="text-xs font-black text-on-surface-variant uppercase tracking-widest mb-2">{t('plans.total')}</div>
              <div className="text-5xl font-black text-on-surface mb-8">
                {isFree ? t('plans.free.name') : formatPrice(currentPlanData.price)}
              </div>
              <button 
                id="btn_confirm_pay"
                disabled={loading}
                onClick={async () => {
                  if (!productId) {
                    navigate('/');
                    return;
                  }
                  
                  setLoading(true);
                  try {
                    // 1. Update listing status locally (demo)
                    const { error } = await supabase
                      .from('listings')
                      .update({ 
                        promotion_type: selectedPlan !== 'free' ? 'premium' : 'normal',
                        is_premium: selectedPlan !== 'free'
                      })
                      .eq('id', productId);
                      
                    if (error) throw error;

                    // 2. Trigger Backend Commission Simulation (For testing purposes)
                    // In a real app, this would be a webhook from Stripe
                    if (selectedPlan !== 'free') {
                      const planData = (t('plans') as any)[selectedPlan];
                      await fetch('/api/confirm-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          paymentIntentId: `sim_${Math.random().toString(36).substring(7)}`,
                          userId: user?.id,
                          amount: planData.price,
                          listingId: productId
                        })
                      });
                    }

                    navigate('/my-listings');
                  } catch (err) {
                    console.error('Error promoting listing:', err);
                    navigate('/my-listings'); // Fallback to success anyway for demo
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full signature-gradient text-white py-5 rounded-2xl font-black font-headline text-xl active:scale-95 transition-transform duration-200 shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={24} />}
                {isFree ? t('plans.finish') : t('plans.confirm')}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
