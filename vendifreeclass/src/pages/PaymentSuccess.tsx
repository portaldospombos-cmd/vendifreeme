import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Layout, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="mb-8"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
          <CheckCircle2 size={64} />
        </div>
        <h1 className="text-4xl font-black font-headline text-on-surface mb-3 tracking-tight">Destaque Ativado!</h1>
        <p className="text-on-surface-variant text-lg max-w-sm mx-auto font-medium">O seu anúncio foi promovido com sucesso e terá agora mais visibilidade.</p>
      </motion.div>

      <div className="w-full max-w-sm space-y-4">
        <button 
          onClick={() => navigate('/my-listings')}
          className="w-full flex items-center justify-center gap-3 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl font-bold font-headline text-on-surface hover:bg-surface-container-high transition-colors active:scale-95"
        >
          <Layout size={20} className="text-primary" />
          Ver Meus Anúncios
        </button>
        
        <button 
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-3 py-4 signature-gradient text-white rounded-2xl font-bold font-headline shadow-lg active:scale-95 transition-all"
        >
          <Sparkles size={20} />
          Voltar ao Início
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="mt-12 p-8 bg-surface-container-low/50 rounded-[2.5rem] border border-outline-variant/10 max-w-sm">
        <h4 className="font-bold font-headline text-sm mb-3">Vantagens do Destaque</h4>
        <ul className="text-left text-xs text-on-surface-variant space-y-4">
          <li className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-black text-[10px]">1</div>
            <span className="font-bold leading-tight">Aparece no topo das pesquisas da categoria.</span>
          </li>
          <li className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-black text-[10px]">2</div>
            <span className="font-bold leading-tight">Badge Premium visual para atrair cliques.</span>
          </li>
          <li className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-black text-[10px]">3</div>
            <span className="font-bold leading-tight">Até 10x mais visualizações diárias.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
