import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, PlusCircle, MessageSquare, User, Settings, ShieldCheck, HelpCircle, Users, Globe } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';

export default function Sidebar() {
  const location = useLocation();
  const { t } = useSettings();
  const { user } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const [unreadCount, setUnreadCount] = React.useState(3);

  const navItems = [
    { icon: Home, label: t('common.home'), path: '/' },
    { icon: Heart, label: t('profile.favorites'), path: '/favorites' },
    { icon: MessageSquare, label: t('common.community'), path: '/community' },
    { icon: PlusCircle, label: t('common.sell'), path: '/sell', isSpecial: true },
    { icon: User, label: t('common.profile'), path: '/profile' },
    { icon: Users, label: 'Embaixadores', path: '/ambassador' },
  ];

  const adminItems = user?.email === 'PortaldosPombos@gmail.com' ? [
    { icon: ShieldCheck, label: 'Admin', path: '/admin' },
  ] : [];

  const footerItems = [
    { icon: Settings, label: 'Settings', path: '/profile/edit' },
    { icon: HelpCircle, label: 'Privacy', path: '/privacy' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/10 p-6 pt-8 z-40">
      <div className="px-4 mb-8">
        <Link to="/" className="text-2xl font-black tracking-tighter text-primary font-headline cursor-pointer hover:opacity-80 transition-opacity">
          Vendifree
        </Link>
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest px-4 mb-4">Menu</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
              }`}
            >
              <Icon size={20} className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
              <span className="font-headline font-bold text-sm tracking-tight">{item.label}</span>
              
              {item.path === '/messages' && (item as any).count > 0 && (
                <div className={`ml-auto min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-black ${isActive ? 'bg-white text-primary' : 'bg-error text-white'}`}>
                  {(item as any).count}
                </div>
              )}
              {isActive && item.path !== '/messages' && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </Link>
          );
        })}

        {adminItems.length > 0 && (
          <div className="pt-8">
            <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest px-4 mb-4">Management</p>
            {adminItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-tertiary text-white shadow-lg shadow-tertiary/20' 
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary'
                }`}
              >
                <item.icon size={20} />
                <span className="font-headline font-bold text-sm tracking-tight">{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2 pt-8 border-t border-outline-variant/10">
        <div className="px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center gap-3 text-on-surface-variant mb-1">
            <Globe size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest ">Moeda & Região</span>
          </div>
          <div className="flex gap-2">
            {(['EUR', 'USD', 'BRL'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all ${
                  currency === curr
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {footerItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-all duration-200"
          >
            <item.icon size={20} />
            <span className="font-headline font-bold text-sm tracking-tight">{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
}
