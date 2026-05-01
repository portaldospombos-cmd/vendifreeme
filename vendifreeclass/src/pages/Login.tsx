import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithEmail } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error: loginError } = await loginWithEmail(email, password);
      if (loginError) throw loginError;
      
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar na conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background font-body text-on-surface min-h-screen flex flex-col items-center">
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 glass-header">
        <div className="flex items-center gap-2">
          <span className="text-primary font-headline font-extrabold text-2xl tracking-tighter">Vendifree</span>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="p-2 text-on-surface-variant hover:bg-surface-container-high/30 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </header>

      <main className="w-full max-w-md px-6 pt-24 pb-12 flex flex-col items-center">
        {/* Hero Illustration Area */}
        <div className="relative w-full aspect-square max-w-[280px] mb-8 group">
          <div className="absolute inset-0 bg-primary-container/30 rounded-full blur-3xl group-hover:bg-primary-container/40 transition-all"></div>
          <img 
            alt="Luxury items curated layout" 
            className="relative z-10 w-full h-full object-cover rounded-3xl shadow-[0px_12px_32px_rgba(0,53,52,0.06)] transform -rotate-3 hover:rotate-0 transition-transform duration-500" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6YH_65SxLNv8QbhVY72EtjLryIJB86WJcmVM3nnq2C5W-ufaEXFgka01eCgbC-fMX4BJGpnhi6rXY6fne2Q75hvPrcceoP5g8tLIErV_pPlMZogBio85RV2enAHixD8uGH8rK1rr0QSngBIwv1TWkOizYk-OB1xrBl7mdBgVD26J8_QPSO9DOBZXpbFBMFwbo6RJS4LufqbIfwDrBhsiKu3uWwFkYGRLcUETV_F3km3A19tTe8NIvm4BNBc6j4E0Vsx8p_sAVu3lD"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-10">
          <h1 className="font-headline font-extrabold text-3xl text-on-surface mb-2 tracking-tight">Welcome back</h1>
          <p className="text-on-surface-variant text-lg">The curated marketplace for pre-loved treasures.</p>
        </div>

        {/* Form Section */}
        <form className="w-full space-y-5" onSubmit={handleEmailLogin}>
          {error && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-error rounded-full" />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-on-surface-variant ml-2 font-label" htmlFor="email">Email address</label>
            <div className="relative group">
              <input 
                className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all" 
                id="email" 
                placeholder="name@example.com" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-2">
              <label className="text-sm font-semibold text-on-surface-variant font-label" htmlFor="password">Password</label>
              <button type="button" className="text-sm font-semibold text-primary hover:text-primary-dim transition-colors">Forgot Password?</button>
            </div>
            <div className="relative group">
              <input 
                className="w-full bg-surface-container-highest border-none rounded-xl py-4 px-5 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all" 
                id="password" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 mt-4 signature-gradient text-white font-headline font-bold text-lg rounded-full shadow-[0px_8px_16px_rgba(0,103,92,0.15)] active:scale-95 transition-transform flex items-center justify-center gap-2" 
            type="submit"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
          </button>
        </form>

        {/* Footer Call to Action */}
        <div className="text-center mt-12">
          <p className="text-on-surface-variant">
            Don't have an account? 
            <Link to="/signup" className="text-primary font-bold ml-1 hover:underline underline-offset-4">Create an account</Link>
          </p>
        </div>

        {/* Semantic Design Element (Asymmetry) */}
        <div className="fixed -bottom-24 -left-24 w-64 h-64 bg-secondary-container/20 rounded-full blur-[80px] -z-10"></div>
        <div className="fixed top-1/4 -right-32 w-80 h-80 bg-tertiary-container/10 rounded-full blur-[100px] -z-10"></div>
      </main>
    </div>
  );
}
