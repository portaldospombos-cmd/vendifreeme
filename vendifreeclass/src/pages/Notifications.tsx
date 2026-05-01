import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Package, Tag, Heart, Loader2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useSettings } from '../contexts/SettingsContext';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { supabase } from '../lib/supabase';

export default function Notifications() {
  const goBack = useBackNavigation();
  const { t } = useSettings();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Novo Artigo!", message: "Um artigo que segues baixou de preço.", time: "2h atrás", icon: Tag, color: "bg-primary/10 text-primary" },
    { id: 2, title: "Mensagem Recebida", message: "Recebeste uma nova proposta para o teu artigo.", time: "5h atrás", icon: Package, color: "bg-secondary/10 text-secondary" },
    { id: 3, title: "Favorito", message: "Alguém adicionou o teu artigo aos favoritos.", time: "1d atrás", icon: Heart, color: "bg-error/10 text-error" },
  ]);

  return (
    <div className="bg-background min-h-screen pb-32">
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center px-6 h-16 gap-4">
        <button onClick={goBack} className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black font-headline text-primary tracking-tight">Notificações</h1>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/10 flex gap-4 items-start shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                <n.icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold font-headline text-on-surface">{n.title}</h3>
                  <span className="text-[10px] text-on-surface-variant font-medium">{n.time}</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
