import React from 'react';
import { AppMode, PublicTab, UserAccount } from '../types';

interface NavbarProps {
  mode: AppMode;
  publicTab: PublicTab;
  currentUser: UserAccount | null;
  onModeChange: (mode: AppMode) => void;
  onTabChange: (tab: PublicTab) => void;
  onLogout: () => void;
}

const PUBLIC_TABS: { key: PublicTab; label: string }[] = [
  { key: 'home', label: 'Início' },
  { key: 'villas', label: 'Villas' },
  { key: 'realestate', label: 'Imobiliário' },
  { key: 'hotels', label: 'Hotéis' },
  { key: 'cars', label: 'Viaturas' },
];

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin Panel',
  ambassador: 'Ambassador Panel',
  user: 'Área de Cliente',
};

export const Navbar: React.FC<NavbarProps> = ({ mode, publicTab, currentUser, onModeChange, onTabChange, onLogout }) => {
  return (
    <nav className="luxury-navbar">
      <div
        className="luxury-logo"
        onClick={() => { onModeChange('public'); onTabChange('home'); }}
        style={{ cursor: 'pointer' }}
      >
        VENDIFREE
        <span>MARKETPLACE GLOBAL</span>
      </div>

      {mode === 'public' && (
        <div className="nav-tabs">
          {PUBLIC_TABS.map(t => (
            <button
              key={t.key}
              className={`nav-tab ${publicTab === t.key ? 'active' : ''}`}
              onClick={() => onTabChange(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {mode !== 'public' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(248,250,252,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {ROLE_LABELS[mode] || ''}
          </div>
          {currentUser && (
            <div className="navbar-user-badge">
              <span className="navbar-user-name">{currentUser.name}</span>
              <span className="navbar-user-role">{currentUser.role}</span>
            </div>
          )}
        </div>
      )}

      {mode !== 'public' ? (
        <button
          className="nav-admin-btn active-admin"
          onClick={onLogout}
          id="navbar-logout-btn"
        >
          Sair
        </button>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="nav-admin-btn"
            onClick={() => onModeChange('user')}
            id="navbar-login-btn"
          >
            Entrar
          </button>
        </div>
      )}
    </nav>
  );
};
