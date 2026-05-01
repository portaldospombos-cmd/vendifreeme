import AdminLayout from '../components/AdminLayout';
import { Search, Filter, MoreHorizontal, UserPlus, Mail, Shield } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const users = [
  { id: 1, name: 'Elena Vance', email: 'elena@example.com', role: 'User', status: 'Ativo', lastLogin: '10 min atrás', joined: 'Oct 12, 2023', avatar: 'https://picsum.photos/seed/elena/100/100' },
  { id: 2, name: 'Marcus Wright', email: 'marcus@example.com', role: 'Moderator', status: 'Ativo', lastLogin: '2 dias atrás', joined: 'Sep 05, 2023', avatar: 'https://picsum.photos/seed/marcus/100/100' },
  { id: 3, name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'User', status: 'Inativo', lastLogin: '65 dias atrás', joined: 'Aug 22, 2023', avatar: 'https://picsum.photos/seed/sarah/100/100' },
  { id: 4, name: 'Alex Thompson', email: 'alex@example.com', role: 'User', status: 'Ativo', lastLogin: '5 dias atrás', joined: 'May 15, 2023', avatar: 'https://picsum.photos/seed/alex/100/100' },
  { id: 5, name: 'Admin User', email: 'admin@vendifree.com', role: 'Admin', status: 'Ativo', lastLogin: 'Hoje', joined: 'Jan 01, 2023', avatar: 'https://picsum.photos/seed/admin/100/100' },
];

export default function AdminUsers() {
  const { showToast } = useAdmin();

  return (
    <AdminLayout title="Gestão de Utilizadores">
      <div className="bg-white rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
        {/* Table Header / Actions */}
        <div className="p-6 border-b border-outline-variant/10 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar utilizadores..." 
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant/10 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              onChange={(e) => e.target.value.length > 2 && showToast(`Pesquisando por "${e.target.value}"`)}
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => showToast('Filtros avançados...')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-surface-container-low text-on-surface-variant font-bold rounded-2xl hover:bg-surface-container-high transition-colors active:scale-95"
            >
              <Filter size={18} />
              <span>Filtrar</span>
            </button>
            <button 
              onClick={() => showToast('Abrindo criar utilizador...')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 signature-gradient text-white font-bold rounded-2xl shadow-lg shadow-primary/10 active:scale-95 transition-all"
            >
              <UserPlus size={18} />
              <span>Adicionar Utilizador</span>
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/30">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Utilizador</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Função</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Último Login</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-low/10 transition-colors">
                  <td className="px-8 py-5 text-sm font-bold">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-outline-variant/20" />
                      <div>
                        <p className="font-bold text-sm text-on-surface">{user.name}</p>
                        <p className="text-xs text-on-surface-variant font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      {user.role === 'Admin' ? (
                        <Shield size={14} className="text-tertiary" />
                      ) : user.role === 'Moderator' ? (
                        <Shield size={14} className="text-primary" />
                      ) : null}
                      <span className={`text-xs font-bold ${user.role === 'Admin' ? 'text-tertiary' : user.role === 'Moderator' ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      user.status === 'Ativo' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">
                    {user.lastLogin}
                  </td>
                  <td className="px-8 py-5">
                    <button 
                      onClick={() => showToast(`Ações para ${user.name}`)}
                      className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors active:scale-90"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-outline-variant/10 flex justify-between items-center">
          <p className="text-xs text-on-surface-variant font-medium">Showing 1-5 of 8,245 users</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-surface-container-low text-on-surface-variant text-xs font-bold rounded-xl opacity-50 cursor-not-allowed">Previous</button>
            <button 
              onClick={() => showToast('Loading next page...')}
              className="px-4 py-2 bg-surface-container-low text-on-surface-variant text-xs font-bold rounded-xl hover:bg-surface-container-high transition-colors active:scale-95"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
