import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  const goBack = useBackNavigation();
  const navigate = useNavigate();
  return (
    <div className="bg-background min-h-screen pb-20">
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center px-6 h-16 border-b border-outline-variant/10">
        <button onClick={() => goBack()} className="p-2 mr-4 text-primary"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-black font-headline text-primary">Política de Privacidade</h1>
      </header>
      <main className="pt-24 px-6 max-w-3xl mx-auto prose prose-sm prose-primary">
        <h2>1. Introdução</h2>
        <p>Valorizamos a sua privacidade e estamos comprometidos em proteger os seus dados pessoais. Esta política explica como recolhemos, usamos e protegemos as suas informações em conformidade com o RGPD.</p>
        
        <h2>2. Dados que Recolhemos</h2>
        <p>Recolhemos dados como nome, email, número de telefone e localização quando cria uma conta ou publica um anúncio.</p>
        
        <h2>3. Finalidade do Tratamento</h2>
        <p>Usamos os seus dados para possibilitar a comunicação entre compradores e vendedores, melhorar os nossos serviços e prevenir fraudes.</p>
        
        <h2>4. Os Seus Direitos (RGPD)</h2>
        <ul>
          <li>Direito de acesso: Pode solicitar uma cópia dos seus dados.</li>
          <li>Direito ao esquecimento: Pode solicitar a eliminação total da sua conta.</li>
          <li>Direito à portabilidade: Pode exportar os seus dados.</li>
        </ul>
        
        <h2>5. Cookies</h2>
        <p>Utilizamos cookies para melhorar a experiência do utilizador. Pode gerir as suas preferências através do nosso banner de cookies.</p>
        
        <h2>6. Contacto</h2>
        <p>Para qualquer questão sobre os seus dados, contacte-nos através do suporte.</p>
      </main>
    </div>
  );
}
