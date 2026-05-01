import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Heart, PlusCircle, MessageSquare, User, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useSettings();
  const { user } = useAuth();
  
  const navItems = [
    { icon: Home, label: t('common.home'), path: '/' },
    { icon: Heart, label: t('profile.favorites'), path: '/favorites' },
    { icon: PlusCircle, label: t('common.sell'), path: '/sell', isSpecial: true },
    { icon: Users, label: 'Embaixador', path: '/ambassador' },
    { icon: MessageSquare, label: t('common.inbox'), path: '/messages' },
    { icon: User, label: t('common.profile'), path: '/profile' },
  ];

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    // Allows navigating to the profile page when logged out
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-background/70 backdrop-blur-xl z-50 rounded-t-[24px] shadow-[0px_-12px_32px_rgba(0,53,52,0.06)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        
        if (item.isSpecial) {
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={(e) => handleNavClick(e, item.path)}
              className={`flex flex-col items-center justify-center rounded-2xl px-3 py-2 transition-all active:scale-90 ${
                isActive 
                  ? 'bg-secondary-container text-on-secondary-container' 
                  : 'text-on-surface-variant'
              }`}
            >
              <Icon size={24} />
              <span className="font-body font-medium text-[9px] mt-1">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={(e) => handleNavClick(e, item.path)}
            className={`flex flex-col items-center justify-center px-2 py-2 transition-all active:scale-90 relative ${
              isActive ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <Icon size={22} fill={isActive ? 'currentColor' : 'none'} />
            <span className="font-body font-medium text-[9px] mt-1 whitespace-nowrap">{item.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
