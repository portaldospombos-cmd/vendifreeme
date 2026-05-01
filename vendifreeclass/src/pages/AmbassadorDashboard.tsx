import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { ArrowLeft, Copy, Share2, Users, TrendingUp, Wallet, History, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabase';

export default function AmbassadorDashboard() {
  const { showToast } = useToast();
  const goBack = useBackNavigation();
  const navigate = useNavigate();
  const { formatPrice } = useSettings();
  const { user } = useAuth();
  const [isAmbassador, setIsAmbassador] = useState(user?.user_metadata?.is_ambassador === true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [networkL1, setNetworkL1] = useState<any[]>([]);
  const [networkL2Count, setNetworkL2Count] = useState(0);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'network' | 'commissions' | 'withdrawals'>('network');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  const [withdrawDetails, setWithdrawDetails] = useState('');

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsEnrolling(true);
    try {
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { is_ambassador: true }
      });
      if (authError) throw authError;

      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_ambassador: true })
        .eq('id', user.id);
      
      // If column doesn't exist, we skip but at least we tried
      // If it exists, it confirms being an ambassador
      
      setIsAmbassador(true);
    } catch (err) {
      console.error('Error enrolling as ambassador:', err);
    } finally {
      setIsEnrolling(false);
    }
  };

  useEffect(() => {
    if (!user || !isAmbassador) return;

    const fetchAmbassadorData = async () => {
      // Profile
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (prof) {
        setProfile(prof);
        if (prof.is_ambassador) {
          setIsAmbassador(true);
        }
      }

      // Network L1
      const { data: l1Users } = await supabase.from('profiles').select('id, full_name, avatar_url, created_at, status').eq('referred_by', user.id);
      setNetworkL1(l1Users || []);
      
      // Network L2 Count
      if (l1Users && l1Users.length > 0) {
        const ids = l1Users.map(o => o.id);
        const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).in('referred_by', ids);
        setNetworkL2Count(count || 0);
      }

      // Commissions
      const { data: comms } = await supabase
        .from('commissions')
        .select(`
          *,
          source_user:profiles!commissions_source_user_id_fkey(full_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setCommissions(comms || []);

      // Withdrawals
      const { data: withs } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setWithdrawals(withs || []);
    };

    fetchAmbassadorData();

    // Real-time subscriptions for balance and commissions
    const profileChannel = supabase
      .channel('profile_balance')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles',
        filter: `id=eq.${user.id}`
      }, (payload) => {
        setProfile(payload.new);
      })
      .subscribe();

    const commissionChannel = supabase
      .channel('new_commissions')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'commissions',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchAmbassadorData(); // Re-fetch on any new commission
      })
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(commissionChannel);
    };
  }, [user]);

  const referralLink = `${window.location.origin}/signup?ref=${profile?.referral_code || '...'}`;

  const l1Earnings = commissions.filter(c => c.level === 1 && c.status === 'confirmed').reduce((acc, c) => acc + Number(c.amount), 0);
  const l2Earnings = commissions.filter(c => c.level === 2 && c.status === 'confirmed').reduce((acc, c) => acc + Number(c.amount), 0);
  const pendingEarnings = commissions.filter(c => c.status === 'pending').reduce((acc, c) => acc + Number(c.amount), 0);

  const stats = {
    totalEarnings: (profile?.commission_balance || 0), // balance is the truth
    availableBalance: profile?.commission_balance || 0,
    pendingBalance: pendingEarnings,
    level1Referrals: networkL1.length,
    level2Referrals: networkL2Count,
    activeStatus: profile?.status === 'active',
    lastLogin: profile?.last_login ? new Date(profile.last_login).toLocaleDateString() : 'N/A'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = async () => {
    const shareData = {
      title: 'Junta-te à Vendifree!',
      text: 'Usa o meu link para te registares na Vendifree e começarmos a ganhar juntos!',
      url: referralLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (amount < 20) {
      showToast('O valor mínimo de levantamento é 20€', 'error');
      return;
    }
    if (amount > stats.availableBalance) {
      showToast('Saldo insuficiente', 'error');
      return;
    }

    try {
      const { error } = await supabase.from('withdrawals').insert({
        user_id: user?.id,
        amount,
        method: withdrawMethod,
        details: withdrawDetails,
        status: 'pending'
      });

      if (error) throw error;
      
      showToast('Pedido de levantamento enviado com sucesso!');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
    } catch (err) {
      console.error('Withdrawal error:', err);
      showToast('Erro ao processar pedido de levantamento.', 'error');
    }
  };

  if (!isAmbassador) {
    return (
      <div className="bg-background min-h-screen pb-24">
        <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center px-4 md:px-6 h-16 border-b border-outline-variant/10">
          <button 
            onClick={() => goBack()}
            className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors mr-3 md:mr-4"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg md:text-xl font-black font-headline text-primary tracking-tight">Programa Embaixador</h1>
        </header>

        <main className="pt-20 md:pt-24 px-4 md:px-6 max-w-4xl mx-auto space-y-6 md:space-y-8 flex flex-col items-center">
          <div className="bg-primary/5 border border-primary/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 w-full text-center shadow-lg shadow-primary/5 flex flex-col items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/20 text-primary mx-auto rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-4 md:mb-6 shrink-0">
              <Users size={40} className="md:w-12 md:h-12" />
            </div>
            
            <h2 className="text-2xl md:text-4xl font-black text-primary font-headline mb-3 md:mb-4 tracking-tight leading-tight">Ganha Dinheiro com a Vendifree</h2>
            <p className="text-on-surface-variant max-w-lg mx-auto text-sm md:text-lg mb-6 md:mb-8 leading-relaxed">
              Junta-te ao nosso programa e recebe comissões para sempre! Ganha <strong className="text-primary">12%</strong> dos anúncios da tua rede direta e <strong className="text-primary">3%</strong> da rede secundária.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl mx-auto text-left mb-8 md:mb-12">
              <div className="bg-surface p-5 md:p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
                <Share2 className="text-tertiary mb-3 md:mb-4" size={24} />
                <h4 className="font-black text-base md:text-lg text-primary mb-1 md:mb-2">1. Partilha</h4>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">Convida amigos ou seguidores com o teu link único.</p>
              </div>
              <div className="bg-surface p-5 md:p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
                <Users className="text-tertiary mb-3 md:mb-4" size={24} />
                <h4 className="font-black text-base md:text-lg text-primary mb-1 md:mb-2">2. Constrói</h4>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">Os teus convidados (e os convidados deles) formam a tua rede.</p>
              </div>
              <div className="bg-surface p-5 md:p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col">
                <Wallet className="text-tertiary mb-3 md:mb-4" size={24} />
                <h4 className="font-black text-base md:text-lg text-primary mb-1 md:mb-2">3. Ganha</h4>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">Recebe comissão cada vez que alguém da tua rede vende.</p>
              </div>
            </div>

            <button 
              onClick={handleEnroll}
              disabled={isEnrolling}
              className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-primary text-white font-black text-base md:text-lg rounded-2xl md:rounded-full shadow-xl hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
            >
              {isEnrolling ? 'A processar...' : 'Quero Ser Embaixador'}
            </button>
            <p className="text-[10px] md:text-xs text-on-surface-variant mt-4 md:mt-6 opacity-70">
              Ao ativar, estarás a concordar com os nossos <a href="/terms" className="underline hover:text-primary font-bold">Termos de Embaixador</a>.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-24">
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 glass-header flex items-center px-6 h-16 border-b border-outline-variant/10">
        <button 
          onClick={() => goBack()}
          className="p-2 text-primary hover:bg-surface-container-high/50 rounded-full transition-colors mr-4"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black font-headline text-primary tracking-tight">Embaixador Vendifree</h1>
      </header>

      <main className="pt-24 px-6 max-w-4xl mx-auto space-y-8">
        {/* Activity Status */}
        <div className={`p-4 rounded-2xl flex items-center gap-3 border shadow-sm ${stats.activeStatus ? 'bg-success/5 border-success/20 text-success' : 'bg-error/5 border-error/20 text-error'}`}>
          {stats.activeStatus ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest">
              Status: {stats.activeStatus ? 'Ativo' : 'Inativo'}
            </p>
            <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">
              Último login: {stats.lastLogin} (Mantenha o login regular a cada 60 dias para receber comissões)
            </p>
          </div>
        </div>

        {/* Activity Status Warning */}
        {!stats.activeStatus && (
          <div className="bg-error/10 border border-error/20 p-6 rounded-[2.5rem] flex items-start gap-4">
            <AlertCircle className="text-error shrink-0" size={24} />
            <div>
              <h4 className="font-black text-error font-headline uppercase tracking-tight">Utilizador Inativo</h4>
              <p className="text-sm font-bold text-error/80 leading-snug">
                Não fizeste login nos últimos 60 dias. A tua conta de embaixador está suspensa e não irás receber novas comissões até voltares a estar ativo.
              </p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-primary p-8 rounded-[3rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-12 blur-3xl"></div>
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Ganhos Totais</p>
            <h2 className="text-5xl font-black font-headline mb-8">{formatPrice(stats.totalEarnings)}</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Disponível</p>
                <p className="text-xl font-black">{formatPrice(stats.availableBalance)}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Pendente</p>
                <p className="text-xl font-black">{formatPrice(stats.pendingBalance)}</p>
              </div>
            </div>

            <button 
              onClick={() => setShowWithdrawModal(true)}
              className="w-full mt-8 py-4 bg-white text-primary font-black rounded-full shadow-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:grayscale"
            >
              Pedir Levantamento (Min. €20)
            </button>
          </div>
        </div>

        {/* Level Earnings Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant/10 text-center">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3">
              <Wallet size={20} />
            </div>
            <p className="text-[10px] font-black opacity-40 uppercase mb-1">Ganhos Nível 1</p>
            <p className="text-xl font-black text-on-surface">€{l1Earnings.toFixed(2)}</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant/10 text-center">
            <div className="w-10 h-10 bg-tertiary/10 text-tertiary rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp size={20} />
            </div>
            <p className="text-[10px] font-black opacity-40 uppercase mb-1">Ganhos Nível 2</p>
            <p className="text-xl font-black text-on-surface">€{l2Earnings.toFixed(2)}</p>
          </div>
        </div>

        {/* Share Section */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h3 className="text-xl font-black font-headline mb-2 flex items-center gap-2">
                <Share2 size={24} className="text-primary" />
                Convida e Ganha
              </h3>
              <p className="text-sm text-on-surface-variant font-bold leading-relaxed mb-6">
                Partilha o teu link único e recebe comissões de todos os serviços pagos pela tua rede em 2 níveis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-surface-container-low px-6 py-4 rounded-2xl border border-outline-variant/20 font-mono text-xs font-bold text-primary truncate">
                  {referralLink}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleCopy}
                    className={`flex-1 sm:flex-none px-6 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${copied ? 'bg-success text-white' : 'bg-surface-container-high text-primary hover:bg-surface-container-high/80'}`}
                  >
                    {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                  <button 
                    onClick={handleShareLink}
                    className="flex-1 sm:flex-none px-6 py-4 bg-primary text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg hover:bg-primary/90 active:scale-95"
                  >
                    <Share2 size={20} />
                    <span>Partilhar</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="w-32 h-32 bg-white p-2 rounded-2xl border border-outline-variant/10 shadow-inner shrink-0 hidden sm:block">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(referralLink)}`} 
                alt="Referral QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </section>

        {/* 2-Level Network & History */}
        <div className="space-y-6">
          <div className="flex gap-8 border-b border-outline-variant/10 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('network')}
              className={`pb-4 border-b-4 transition-all ${activeTab === 'network' ? 'border-primary font-black text-primary font-headline' : 'border-transparent font-bold text-on-surface-variant opacity-60'}`}
            >
              Rede
            </button>
            <button 
              onClick={() => setActiveTab('commissions')}
              className={`pb-4 border-b-4 transition-all ${activeTab === 'commissions' ? 'border-primary font-black text-primary font-headline' : 'border-transparent font-bold text-on-surface-variant opacity-60'}`}
            >
              Comissões
            </button>
            <button 
              onClick={() => setActiveTab('withdrawals')}
              className={`pb-4 border-b-4 transition-all ${activeTab === 'withdrawals' ? 'border-primary font-black text-primary font-headline' : 'border-transparent font-bold text-on-surface-variant opacity-60'}`}
            >
              Levantamentos
            </button>
          </div>

          {activeTab === 'network' && (
            <div className="space-y-3">
              <h5 className="text-sm font-black opacity-40 uppercase tracking-widest px-2">Nível 1 (Diretos • {networkL1.length})</h5>
              {networkL1.length > 0 ? networkL1.map((user, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-surface-container-low/30 rounded-3xl border border-outline-variant/10">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center overflow-hidden">
                    {user.avatar_url ? <img src={user.avatar_url} alt="" /> : <User size={24} className="opacity-20" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm tracking-tight">{user.full_name}</p>
                    <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
                      Inscrito em {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter ${user.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {user.status === 'active' ? 'Ativo' : 'Inativo'}
                  </div>
                </div>
              )) : (
                <p className="text-center py-8 text-on-surface-variant opacity-40 text-sm font-bold italic">Ainda não tens convites diretos.</p>
              )}

              <div className="pt-4">
                <h5 className="text-sm font-black opacity-40 uppercase tracking-widest px-2 mb-3">Nível 2 (Sub-rede • {networkL2Count})</h5>
                <div className="p-8 bg-surface-container-low/30 rounded-[2.5rem] border-2 border-dashed border-outline-variant/10 text-center">
                  <Users size={32} className="mx-auto mb-4 opacity-10" />
                  <p className="text-sm font-bold text-on-surface-variant">Tens <span className="text-primary font-black">{networkL2Count}</span> utilizadores no nível 2</p>
                  <p className="text-[10px] uppercase font-black opacity-40 tracking-widest mt-1">Ganha 5% de cada serviço que eles pagarem</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'commissions' && (
            <section className="bg-white rounded-[2.5rem] border border-outline-variant/10 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest/50">
                <h3 className="font-black font-headline text-lg">Histórico de Comissões</h3>
                <History size={20} className="text-on-surface-variant" />
              </div>
              <div className="divide-y divide-outline-variant/5">
                {commissions.length > 0 ? commissions.map((comm) => (
                  <div key={comm.id} className="p-6 hover:bg-surface-container-low/20 transition-colors flex justify-between items-center">
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${comm.level === 1 ? 'bg-primary/10 text-primary' : 'bg-tertiary/10 text-tertiary'}`}>
                        <TrendingUp size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Comissão Nível {comm.level}</h4>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                          {comm.source_user?.full_name || 'Utilizador'} • {new Date(comm.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary">{formatPrice(comm.amount)}</p>
                      <div className="flex items-center gap-1 justify-end">
                        <div className={`w-1 h-1 rounded-full ${comm.status === 'confirmed' ? 'bg-success' : comm.status === 'pending' ? 'bg-warning' : 'bg-error'}`} />
                        <p className={`text-[9px] font-black uppercase tracking-tighter ${comm.status === 'confirmed' ? 'text-success' : comm.status === 'pending' ? 'text-warning' : 'text-error'}`}>
                          {comm.status === 'confirmed' ? 'Confirmado' : comm.status === 'pending' ? 'Pendente' : 'Perdido'}
                        </p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center opacity-20">
                    <p className="font-bold">Ainda não há comissões registadas.</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === 'withdrawals' && (
            <section className="bg-white rounded-[2.5rem] border border-outline-variant/10 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest/50">
                <h3 className="font-black font-headline text-lg">Histórico de Levantamentos</h3>
                <Wallet size={20} className="text-on-surface-variant" />
              </div>
              <div className="divide-y divide-outline-variant/5">
                {withdrawals.length > 0 ? withdrawals.map((w) => (
                  <div key={w.id} className="p-6 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm">Levantamento {w.method === 'paypal' ? 'PayPal' : 'Banco'}</h4>
                      <p className="text-[10px] font-bold text-on-surface-variant opacity-60 mt-1 uppercase">
                        {new Date(w.created_at).toLocaleDateString()} • {w.details?.substring(0, 15)}...
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-primary">-{formatPrice(w.amount)}</p>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        w.status === 'completed' ? 'bg-success/10 text-success' :
                        w.status === 'rejected' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                      }`}>
                        {w.status === 'completed' ? 'Efetuado' : w.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center opacity-20 text-sm font-bold">
                    Ainda não fizeste nenhum levantamento.
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Info Rules */}
        <div className="bg-surface-container-low/30 p-6 rounded-3xl border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-on-surface-variant" size={20} />
            <h4 className="font-bold text-sm">Regras do Programa</h4>
          </div>
          <ul className="space-y-2">
            {[
              "Comissão apenas sobre serviços pagos (destaques e planos).",
              "As comissões ficam pendentes por 7 dias (período de validação).",
              "Levantamento mínimo de €20 via Transferência ou PayPal.",
              "Deves manter o login regular (pelo menos uma vez a cada 60 dias).",
              "Se estiveres inativo, as comissões revertem para a plataforma."
            ].map((rule, i) => (
              <li key={i} className="text-[11px] text-on-surface-variant font-medium flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                {rule}
              </li>
            ))}
          </ul>

        </div>
      </main>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowWithdrawModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md" 
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-lg bg-surface-container-high rounded-[3rem] p-8 shadow-2xl border border-white/20"
            >
              <h3 className="text-2xl font-black font-headline text-on-surface mb-6">Pedir Levantamento</h3>
              <form onSubmit={handleWithdraw} className="space-y-6">
                <div>
                  <label className="block text-sm font-black opacity-40 uppercase tracking-widest mb-3">Valor (Disponível: €{stats.availableBalance.toFixed(2)})</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-2xl text-primary">€</span>
                    <input 
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-2xl py-6 pl-12 pr-6 text-2xl font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                      min="20"
                    />
                  </div>
                  <p className="text-[10px] mt-2 font-bold opacity-40">Mínimo necessário: 20,00€</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    onClick={() => setWithdrawMethod('bank')}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold ${withdrawMethod === 'bank' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/10 text-on-surface-variant'}`}
                  >
                    Transferência
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setWithdrawMethod('paypal')}
                    className={`p-4 rounded-2xl border-2 transition-all font-bold ${withdrawMethod === 'paypal' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/10 text-on-surface-variant'}`}
                  >
                    PayPal
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-black opacity-40 uppercase tracking-widest mb-2 font-headline">Dados de Pagamento (IBAN ou Email)</label>
                  <textarea 
                    value={withdrawDetails}
                    onChange={(e) => setWithdrawDetails(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-4 text-sm font-bold min-h-[100px] outline-none"
                    placeholder="Insere os teus dados aqui..."
                  />
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setShowWithdrawModal(false)} className="flex-1 py-4 font-black opacity-40 hover:opacity-100 transition-opacity">Cancelar</button>
                  <button type="submit" className="flex-[2] bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/20">Confirmar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
