import AdminLayout from '../components/AdminLayout';
import { Save, Globe, Lock, Bell, Database, Palette, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { useAdmin } from '../contexts/AdminContext';

export default function AdminSettings() {
  const goBack = useBackNavigation();
  const navigate = useNavigate();
  const { showToast } = useAdmin();

  const handleSave = () => {
    showToast('Configuration saved successfully!', 'success');
  };

  const handleDiscard = () => {
    showToast('Changes discarded', 'error');
  };

  return (
    <AdminLayout title="System Settings">
      <div className="max-w-4xl space-y-8">
        <button 
          onClick={() => goBack()}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        {/* General Settings */}
        <section className="bg-white rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 flex items-center gap-3">
            <Globe size={20} className="text-primary" />
            <h3 className="text-lg font-black font-headline">General Configuration</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant ml-1">Marketplace Name</label>
                <input type="text" defaultValue="Vendifree" className="w-full bg-surface-container-low/50 border border-outline-variant/10 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant ml-1">Support Email</label>
                <input type="email" defaultValue="support@vendifree.com" className="w-full bg-surface-container-low/50 border border-outline-variant/10 rounded-xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant ml-1">Maintenance Mode</label>
              <div className="flex items-center gap-4 p-4 bg-surface-container-low/30 rounded-2xl border border-outline-variant/10">
                <div className="flex-1">
                  <p className="text-sm font-bold">Disable Public Access</p>
                  <p className="text-xs text-on-surface-variant">Only admins can access the marketplace while active.</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer" onClick={() => showToast('Adjusting maintenance mode...')}>
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Settings */}
        <section className="bg-white rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-outline-variant/10 flex items-center gap-3">
            <Lock size={20} className="text-tertiary" />
            <h3 className="text-lg font-black font-headline">Security & Authentication</h3>
          </div>
          <div className="p-8 space-y-6">
            <div onClick={() => showToast('Toggle 2FA setting')} className="flex items-center justify-between p-4 hover:bg-surface-container-low/30 rounded-2xl transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-tertiary/10 text-tertiary rounded-xl flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Two-Factor Authentication</p>
                  <p className="text-xs text-on-surface-variant">Enforce 2FA for all moderator and admin accounts.</p>
                </div>
              </div>
              <div className="w-11 h-6 bg-primary rounded-full relative">
                <div className="absolute right-[2px] top-[2px] w-5 h-5 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div onClick={() => showToast('Toggle login notifications')} className="flex items-center justify-between p-4 hover:bg-surface-container-low/30 rounded-2xl transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-surface-container-high text-on-surface-variant rounded-xl flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Login Notifications</p>
                  <p className="text-xs text-on-surface-variant">Notify users via email when a new login is detected.</p>
                </div>
              </div>
              <div className="w-11 h-6 bg-surface-container-highest rounded-full relative">
                <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <button onClick={handleDiscard} className="px-8 py-3.5 bg-surface-container-low text-on-surface-variant font-bold rounded-2xl hover:bg-surface-container-high transition-colors active:scale-95">
            Discard Changes
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-8 py-3.5 signature-gradient text-white font-bold rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all">
            <Save size={20} />
            Save Configuration
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
