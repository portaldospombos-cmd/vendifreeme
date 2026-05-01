import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { ArrowLeft } from 'lucide-react';

export default function CookiePolicy() {
  const goBack = useBackNavigation();
  const navigate = useNavigate();
  return (
    <div className="bg-background min-h-screen pb-20">
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center px-6 h-16 border-b border-outline-variant/10">
        <button onClick={() => goBack()} className="p-2 mr-4 text-primary"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-black font-headline text-primary">Política de Cookies</h1>
      </header>
      <main className="pt-24 px-6 max-w-3xl mx-auto prose prose-sm prose-primary">
        <h2>O que são cookies</h2>
        <p>Cookies são pequenos ficheiros armazenados no dispositivo do utilizador.</p>

        <hr />

        <h2>Tipos de cookies utilizados</h2>

        <h3>Essenciais</h3>
        <ul>
          <li>funcionamento do site</li>
          <li>login e segurança</li>
        </ul>

        <h3>Analíticos</h3>
        <ul>
          <li>análise de tráfego</li>
          <li>melhoria da plataforma</li>
        </ul>

        <hr />

        <h2>Consentimento</h2>
        <ul>
          <li>O utilizador pode aceitar ou rejeitar cookies</li>
          <li>Cookies não essenciais só são ativados após consentimento</li>
        </ul>

        <hr />

        <h2>Gestão de cookies</h2>
        <p>O utilizador pode:</p>
        <ul>
          <li>alterar preferências</li>
          <li>apagar cookies no navegador</li>
        </ul>

        <hr />

        <h2>Alterações</h2>
        <p>A política pode ser atualizada a qualquer momento.</p>
      </main>
    </div>
  );
}
