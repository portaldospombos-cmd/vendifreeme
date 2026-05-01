import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, ShoppingBag, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const stats = [
  { label: 'Total Revenue', value: '€42,590', change: '+12.5%', isPositive: true, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Comissões Pagas', value: '€12,245', change: '+5.2%', isPositive: true, icon: Users, color: 'text-tertiary', bg: 'bg-tertiary/10' },
  { label: 'Comissões Retidas', value: '€1,201', change: '-2.1%', isPositive: false, icon: ShoppingBag, color: 'text-secondary-container', bg: 'bg-secondary-container/10' },
  { label: 'Pending Reports', value: '14', change: 'Action Required', isPositive: false, icon: AlertTriangle, color: 'text-error', bg: 'bg-error/10' },
];

export default function AdminDashboard() {
  const { showToast } = useAdmin();
  const navigate = useNavigate();
  const [dbStats, setDbStats] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: rev } = await supabase.from('transactions').select('amount').eq('status', 'completed');
        const totalRev = rev?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

        const { data: comms } = await supabase.from('commissions').select('*, profiles!commissions_ambassador_id_fkey(full_name)');
        const commsPaid = comms?.filter(c => c.status === 'validated').reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
        const commsForfeited = comms?.filter(c => c.status === 'forfeited').reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

        const { count: listingCount } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'active');

        setDbStats([
          { label: 'Receita Total', value: `€${totalRev.toFixed(0)}`, change: '+12%', isPositive: true, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Comissões Pagas', value: `€${commsPaid.toFixed(0)}`, change: '+5%', isPositive: true, icon: Users, color: 'text-tertiary', bg: 'bg-tertiary/10' },
          { label: 'Comissões Retidas', value: `€${commsForfeited.toFixed(0)}`, change: '+2%', isPositive: true, icon: ShoppingBag, color: 'text-secondary-container', bg: 'bg-secondary-container/10' },
          { label: 'Anúncios Ativos', value: String(listingCount || 0), change: 'Live', isPositive: true, icon: AlertTriangle, color: 'text-error', bg: 'bg-error/10' },
        ]);
        setCommissions(comms || []);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      }
    }
    fetchStats();
  }, []);

  const handleAction = (type: string) => {
    showToast(`Action "${type}" processed successfully`, 'success');
  };

  const actualStats = dbStats.length > 0 ? dbStats : stats;

  return (
    <AdminLayout title="Dashboard Overview">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {actualStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => showToast(`Opening details for ${stat.label}`)}>
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.isPositive ? 'text-primary' : 'text-error'}`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black font-headline text-on-surface">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
            <h4 className="text-lg font-black font-headline">Recent Commissions</h4>
            <button onClick={() => handleAction('View All Commissions')} className="text-primary font-bold text-sm hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/30">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">User (Ambassador)</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Referral</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Level</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {[
                  { user: 'Admin_Juan', ref: 'User_402', level: '1 (10%)', amount: '€2.50' },
                  { user: 'Elena_V', ref: 'User_591', level: '2 (5%)', amount: '€0.75' },
                  { user: 'Mark_P', ref: 'User_102', level: '1 (10%)', amount: '€1.20' },
                  { user: 'Sara_L', ref: 'User_202', level: '1 (10%)', amount: '€0.50' },
                  { user: 'Tom_H', ref: 'User_302', level: '2 (5%)', amount: '€0.35' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/20 transition-colors cursor-pointer" onClick={() => handleAction(`Viewing Commission for ${item.user}`)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-container-high rounded-full shrink-0"></div>
                        <span className="font-bold text-sm">{item.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{item.ref}</td>
                    <td className="px-6 py-4 text-xs font-bold">{item.level}</td>
                    <td className="px-6 py-4 font-black text-primary">{item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Moderation Queue Preview */}
        <div className="bg-white rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10">
            <h4 className="text-lg font-black font-headline">Moderation Queue</h4>
          </div>
          <div className="p-6 space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-error/10 text-error rounded-xl flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold mb-1">Suspicious Listing Reported</p>
                  <p className="text-xs text-on-surface-variant mb-3">Listing #8241 contains prohibited items.</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAction('Removal'); }} 
                      className="px-3 py-1.5 bg-error text-white text-[10px] font-black rounded-lg uppercase tracking-wider active:scale-95 transition-transform"
                    >
                      Remove
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleAction('Dismissal'); }} 
                      className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant text-[10px] font-black rounded-lg uppercase tracking-wider active:scale-95 transition-transform"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Recent Listings Management */}
        <div className="bg-white rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden mt-8">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
            <h4 className="text-lg font-black font-headline">Novos Anúncios (Gestão)</h4>
            <button onClick={() => navigate('/admin/moderation')} className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
              Ver Todos <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/30">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Anúncio</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Vendedor</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Categoria</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {[
                  { id: 4821, title: 'BMW M3 Competition', seller: 'Stand_Lisboa', cat: 'Carros', price: '€82,500', status: 'Destaque' },
                  { id: 4822, title: 'Apartamento T2 Portimão', seller: 'Imobi_Real', cat: 'Imóveis', price: '€210,000', status: 'Grátis' },
                  { id: 4823, title: 'Rolex Submariner', seller: 'João_Luxury', cat: 'Lazer', price: '€12,200', status: 'Urgente' },
                ].map((ad, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-container-high rounded-lg shrink-0"></div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm truncate max-w-[150px]">{ad.title}</span>
                          <span className="text-[10px] font-black text-primary">{ad.price}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{ad.seller}</td>
                    <td className="px-6 py-4 text-xs font-bold text-on-surface-variant">{ad.cat}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        ad.status === 'Grátis' ? 'bg-surface-container-high text-on-surface-variant' : 'bg-tertiary/10 text-tertiary'
                      }`}>
                        {ad.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => showToast(`Editando ${ad.id}`)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors">
                          <ShoppingBag size={16} />
                        </button>
                        <button onClick={() => showToast(`Reportado ${ad.id}`)} className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors">
                          <AlertTriangle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
