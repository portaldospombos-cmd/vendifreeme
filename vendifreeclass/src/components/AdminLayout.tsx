import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldAlert, Settings, LogOut, Menu, Bell } from 'lucide-react';
import { useState, ReactNode, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      navigate('/');
    }
  }, [profile, navigate]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Report', message: 'User reported listing #1234', time: '2m ago', type: 'error' },
    { id: 2, title: 'System Update', message: 'Vendifree 2.0 deployment in progress', time: '1h ago', type: 'primary' },
    { id: 3, title: 'New User', message: 'User_592 just registered', time: '3h ago', type: 'success' },
  ]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: ShieldAlert, label: 'Moderation', path: '/admin/moderation' },
    { icon: Settings, label: 'System Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#f0f9f8] flex font-body">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-outline-variant/10 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 signature-gradient rounded-xl flex items-center justify-center text-white font-black text-xl">V</div>
            <span className="text-2xl font-black font-headline tracking-tighter text-primary">Admin Panel</span>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold font-headline transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <item.icon size={22} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-outline-variant/10">
            <button 
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold font-headline text-error hover:bg-error/5 transition-all"
            >
              <LogOut size={22} />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-outline-variant/10 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-2xl font-black font-headline text-on-surface tracking-tight">{title}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 text-on-surface-variant hover:bg-surface-container-low rounded-xl transition-colors ${showNotifications ? 'bg-surface-container-low' : ''}`}
              >
                <Bell size={24} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error border-2 border-white rounded-full"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-outline-variant/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center">
                      <h3 className="font-black font-headline text-sm">Notifications</h3>
                      <span className="bg-error text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">3 New</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-4 hover:bg-surface-container-low transition-colors cursor-pointer border-b border-outline-variant/5 last:border-0">
                          <div className="flex items-center gap-3 mb-1">
                            <div className={`w-2 h-2 rounded-full ${n.type === 'error' ? 'bg-error' : n.type === 'primary' ? 'bg-primary' : 'bg-success'}`}></div>
                            <span className="font-bold text-xs">{n.title}</span>
                            <span className="ml-auto text-[10px] font-bold text-on-surface-variant">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-on-surface-variant font-medium leading-relaxed">{n.message}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full p-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-colors">
                      Mark all as read
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/20">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black font-headline">{profile?.full_name || 'Admin User'}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{profile?.role === 'admin' ? 'Super Admin' : 'Staff'}</p>
              </div>
              <img src={profile?.avatar_url || 'https://picsum.photos/seed/admin/100/100'} alt="Admin" className="w-10 h-10 rounded-full border-2 border-primary/20 object-cover" />
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
