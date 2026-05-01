import React, { useState } from 'react';
import { useBackNavigation } from '../hooks/useBackNavigation';
import { Link, useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, ShieldCheck, Lock, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function SignUp() {
  const { showToast } = useToast();
  const goBack = useBackNavigation();
  const navigate = useNavigate();
  const { signUpWithEmail } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error: signUpError } = await signUpWithEmail(email, password, name);
      if (signUpError) throw signUpError;
      
      // Successfully signed up (might need email verification depending on Supabase settings)
      showToast('Conta criada com sucesso! Verifique o seu email.');
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col items-center">
      <header className="fixed top-0 w-full z-50 glass-panel h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => goBack()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
          >
            <X size={24} className="text-primary" />
          </button>
          <span className="font-headline font-extrabold tracking-tighter text-primary text-xl">Vendifree</span>
        </div>
      </header>

      <main className="mt-24 px-6 w-full max-w-md pb-24">
        {/* Hero Section */}
        <div className="mb-10 mt-6">
          <h1 className="font-headline font-bold text-4xl text-on-surface tracking-tight mb-2">Join the Community</h1>
          <p className="text-on-surface-variant text-lg">Start your journey of finding and selling pre-loved treasures today.</p>
        </div>

        {/* Signup Form */}
        <form className="space-y-5" onSubmit={handleEmailSignUp}>
          {error && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-error rounded-full" />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-label text-sm font-semibold text-on-surface-variant ml-1" htmlFor="name">Full Name</label>
            <input 
              className="w-full px-5 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-on-surface-variant/50" 
              id="name" 
              placeholder="John Doe" 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-label text-sm font-semibold text-on-surface-variant ml-1" htmlFor="email">Email</label>
            <input 
              className="w-full px-5 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-on-surface-variant/50" 
              id="email" 
              placeholder="hello@vendifree.com" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5 relative">
            <label className="font-label text-sm font-semibold text-on-surface-variant ml-1" htmlFor="password">Password</label>
            <div className="relative">
              <input 
                className="w-full px-5 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-on-surface-variant/50" 
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
            className="w-full signature-gradient text-white py-4 rounded-full font-headline font-bold text-lg shadow-xl shadow-primary/10 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2" 
            type="submit"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign Up'}
          </button>
        </form>

        {/* Trust Footer */}
        <div className="mt-12 pt-8 border-t border-outline-variant/10 flex flex-col items-center gap-6">
          <p className="text-on-surface-variant text-sm">Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link></p>
          <div className="flex items-center gap-8 opacity-40 grayscale contrast-125">
            <div className="flex items-center gap-1">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-label font-bold uppercase tracking-wider">Secure Data</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock size={18} />
              <span className="text-[10px] font-label font-bold uppercase tracking-wider">Encryption</span>
            </div>
          </div>
        </div>
      </main>

      {/* Contextual Graphic (Asymmetric Layout Element) */}
      <div className="hidden lg:block fixed right-0 bottom-0 w-1/3 h-2/3 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute right-[-10%] bottom-[-5%] w-[120%] h-full rounded-tl-[80px] bg-surface-container-low/50 border-l border-t border-outline-variant/10 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img 
              alt="Sustainable Living" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI5ZKZgjGQ1AGmLOM2R8EOCulzPH4bzn_W29XPR_wZSorG-pxhRkYbX-s2ESuLveb2N0sEvqCSTbV4rtQr6DkZL4da7IhEEQFeLUcArM-QKPs0bY-l6_w9rIcMhOgx0NjwcMwZAw-7oBgNHbQIr9Bbd8-NP-wDagx6zjvqCJ6U5XPWzHx3JL3M8dz8lMeh4jsjtegjH1T-jisL2kiBsl0oju8B2B0rXSjxJQxNSVsq_9bWLqXtn5-yazmWo3X4V0k-0xiNLU0wx-6U"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
