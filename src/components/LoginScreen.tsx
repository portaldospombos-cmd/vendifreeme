import React, { useState } from 'react';
import { LoginTarget } from '../types';
import { useAuth } from './AuthContext';

interface LoginScreenProps {
  target: LoginTarget;
  onClose: () => void;
  onSuccess: (role: 'admin' | 'ambassador' | 'user' | 'seller') => void;
}

const TARGET_CONFIG: Record<string, { icon: string; title: string; subtitle: string }> = {
  admin: {
    icon: 'ADM',
    title: 'Acesso Administrativo',
    subtitle: 'Gestão global da plataforma Vendifree',
  },
  seller: {
    icon: 'VEN',
    title: 'Acesso Vendedor',
    subtitle: 'Gestão de anúncios e propostas',
  },
  ambassador: {
    icon: 'AMB',
    title: 'Acesso Embaixador',
    subtitle: 'Painel de parceiros e rendimentos',
  },
  user: {
    icon: 'CLI',
    title: 'Acesso Cliente',
    subtitle: 'Área pessoal de reservas e imóveis',
  },
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ target, onClose, onSuccess }) => {
  const { login, register } = useAuth();
  const [view, setView] = useState<'login' | 'register' | '2fa' | 'success'>(target === 'admin' ? 'login' : 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const config = TARGET_CONFIG[target || 'user'];

  function validatePassword(pass: string) {
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return pass.length >= 8 && hasSpecial;
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);

      if (!result.success) {
        setError(result.error || 'Credenciais inválidas.');
        return;
      }

      const user = result.user!;
      if (target && user.role !== target && target !== 'user') {
        setError(`Acesso negado. Esta conta é do tipo "${user.role}".`);
        return;
      }

      if (user.role === 'admin') {
        setView('2fa');
      } else {
        onSuccess(user.role);
      }
    }, 800);
  }

  function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    
    if (!validatePassword(password)) {
      setError('A password deve ter pelo menos 8 caracteres e um símbolo especial.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      register({ name, email, password, phone });
      setLoading(false);
      setView('success');
    }, 1000);
  }

  function handle2FASubmit(e: React.FormEvent) {
    e.preventDefault();
    if (otp === '123456') { // Simulated correct OTP
      onSuccess('admin');
    } else {
      setError('Código 2FA incorreto. Verifique o seu dispositivo.');
    }
  }

  if (view === 'success') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="login-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
          <div className="login-title">Conta Criada!</div>
          <div className="login-subtitle">Enviámos um link de ativação para {email}.</div>
          <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: '0.8rem', marginTop: '1rem' }}>
            Verifique também a pasta de spam. Após ativar a conta, poderá fazer login.
          </p>
          <button className="login-submit-btn" style={{ marginTop: '2rem' }} onClick={() => setView('login')}>
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="login-card" onClick={e => e.stopPropagation()}>
        <button className="login-close-btn" onClick={onClose}>✕</button>
        
        <div className="login-header">
          <div className="login-icon" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', fontWeight: 700, color: 'var(--gold)', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '4px', padding: '0.5rem 1rem' }}>{config.icon}</div>
          <div className="login-title">{view === 'register' ? 'Criar Conta Vendifree' : view === '2fa' ? 'Verificação de Segurança' : config.title}</div>
          <div className="login-subtitle">{view === '2fa' ? 'Introduza o código 2FA enviado para o seu telemóvel' : config.subtitle}</div>
        </div>

        {view === '2fa' ? (
          <form className="login-form" onSubmit={handle2FASubmit}>
             <div className="login-field">
              <label>Código 2FA</label>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" maxLength={6} required autoFocus />
            </div>
            {error && <div className="login-error">⚠️ {error}</div>}
            <button type="submit" className="login-submit-btn">✦ Validar & Entrar</button>
          </form>
        ) : (
          <form className="login-form" onSubmit={view === 'register' ? handleRegisterSubmit : handleLoginSubmit}>
            {view === 'register' && (
              <>
                <div className="login-field">
                  <label>Nome Completo</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="O seu nome" required />
                </div>
                <div className="login-field">
                  <label>Telemóvel</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+351 ..." required />
                </div>
              </>
            )}
            
            <div className="login-field">
              <label>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <div className="login-error">⚠️ {error}</div>}

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? '⏳ A processar...' : view === 'register' ? '✦ Criar Cadastro' : '✦ Entrar'}
            </button>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
              {view === 'login' ? (
                <div style={{ fontSize: '0.85rem', color: 'rgba(248,250,252,0.5)' }}>
                  Não tem conta?{' '}
                  <button type="button" onClick={() => setView('register')} style={{ background: 'transparent', border: 'none', color: 'var(--gold)', fontWeight: 700, cursor: 'pointer', padding: '0', textDecoration: 'underline' }}>
                    Cadastre-se aqui
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'rgba(248,250,252,0.5)' }}>
                  Já tem conta?{' '}
                  <button type="button" onClick={() => setView('login')} style={{ background: 'transparent', border: 'none', color: 'var(--gold)', fontWeight: 700, cursor: 'pointer', padding: '0', textDecoration: 'underline' }}>
                    Faça login
                  </button>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
