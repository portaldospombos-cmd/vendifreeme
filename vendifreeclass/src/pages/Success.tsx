import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Home, ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="bg-surface min-h-screen flex items-center justify-center p-6">
      <SEO 
        title="Pagamento Confirmado" 
        description="O seu anúncio foi promovido com sucesso."
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-surface-container-lowest rounded-[3rem] p-8 md:p-12 shadow-2xl text-center border border-outline-variant/10"
      >
        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center text-success mx-auto mb-8">
          <CheckCircle2 size={56} className="animate-bounce" />
        </div>
        
        <h1 className="text-4xl font-black font-headline tracking-tighter text-on-surface mb-4">
          Sucesso Total!
        </h1>
        
        <p className="text-on-surface-variant font-medium leading-relaxed mb-10">
          O seu pagamento foi processado e o seu anúncio já está a brilhar no topo. Vende mais rápido agora!
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => navigate('/my-listings')}
            className="w-full signature-gradient text-white py-5 rounded-2xl font-black font-headline text-lg hover:shadow-xl hover:shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Ver Meus Anúncios</span>
            <ArrowRight size={20} />
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-surface-container-low text-on-surface py-5 rounded-2xl font-black font-headline text-lg hover:bg-surface-container-high active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Home size={20} />
            <span>Voltar à Home</span>
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-xs font-black text-secondary uppercase tracking-[0.2em] opacity-60">
          <Star size={16} fill="currentColor" />
          Vendifree Premium
        </div>
      </motion.div>
    </div>
  );
}
