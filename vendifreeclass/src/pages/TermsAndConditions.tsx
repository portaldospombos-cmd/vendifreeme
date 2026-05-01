import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
  const goBack = useBackNavigation();
  const navigate = useNavigate();
  return (
    <div className="bg-background min-h-screen pb-20">
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center px-6 h-16 border-b border-outline-variant/10">
        <button onClick={() => goBack()} className="p-2 mr-4 text-primary"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-black font-headline text-primary">Termos e Condições</h1>
      </header>
      <main className="pt-24 px-6 max-w-3xl mx-auto prose prose-sm prose-primary">
        <h2>1. Objeto</h2>
        <p>A plataforma é um serviço de classificados online que permite a publicação de anúncios e o contacto direto entre utilizadores. A plataforma não intervém em transações entre utilizadores.</p>

        <h2>2. Conta de Utilizador</h2>
        <ul>
          <li>O utilizador deve fornecer informação verdadeira</li>
          <li>É responsável pela segurança da sua conta</li>
          <li>Não pode utilizar a plataforma para fins ilegais</li>
        </ul>

        <h2>3. Publicação de Anúncios</h2>
        <ul>
          <li>O utilizador é responsável pelo conteúdo publicado</li>
          <li>É proibido: conteúdo ilegal, fraude, duplicação abusiva</li>
          <li>A plataforma pode remover anúncios sem aviso prévio</li>
        </ul>

        <h2>4. Transações</h2>
        <ul>
          <li>A plataforma não participa em compras/vendas</li>
          <li>Não garante qualidade, entrega ou pagamento</li>
          <li>Toda a responsabilidade é dos utilizadores envolvidos</li>
        </ul>

        <h2>5. Serviços Pagos</h2>
        <ul>
          <li>Destaques e planos são pagos</li>
          <li>Valores não reembolsáveis, salvo obrigação legal</li>
          <li>Ativação após confirmação de pagamento</li>
        </ul>

        <h2>6. Sistema de Embaixadores</h2>
        <ul>
          <li>Comissões aplicam-se apenas a serviços pagos</li>
          <li>Pagamentos sujeitos a validação</li>
          <li>Contas inativas não recebem comissões</li>
          <li>A plataforma pode alterar regras do sistema</li>
        </ul>

        <h2>7. Suspensão e Cancelamento</h2>
        <p>A plataforma pode suspender contas em caso de violação de regras, atividade suspeita ou abuso do sistema.</p>

        <h2>8. Limitação de Responsabilidade</h2>
        <p>A plataforma não é responsável por perdas financeiras, fraudes entre utilizadores ou conteúdos publicados.</p>

        <h2>9. Alterações</h2>
        <p>Os termos podem ser alterados a qualquer momento.</p>

        <h2>10. Lei Aplicável</h2>
        <p>Aplicável a legislação portuguesa e europeia (UE).</p>
      </main>
    </div>
  );
}
