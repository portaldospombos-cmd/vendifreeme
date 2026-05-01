import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface ProfileData {
  id: string;
  plan_type?: 'free' | 'basic' | 'pro' | 'premium';
  plan_expiry?: string;
  is_professional?: boolean;
  store_name?: string;
  store_description?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  profile: ProfileData | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for referral code in URL
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('vendifree_ref', ref);
    }

    // Check current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        let { data: prof } = await supabase.from('profiles').select('*').eq('id', currentUser.id).maybeSingle();
        
        // Handle expiration
        if (prof?.plan_expiry && new Date(prof.plan_expiry) < new Date() && prof.plan_type !== 'free') {
          const resetData = { plan_type: 'free', plan_expiry: null, is_professional: false };
          await supabase.from('profiles').update(resetData).eq('id', currentUser.id);
          prof = { ...prof, ...resetData };
        }
        
        setProfile(prof || null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        // Handle referral linkage
        const storedRef = localStorage.getItem('vendifree_ref');
        let referredById: string | null = null;
        
        if (storedRef) {
          const { data: amb } = await supabase
            .from('profiles')
            .select('id')
            .eq('referral_code', storedRef)
            .maybeSingle();
          
          if (amb && amb.id !== currentUser.id) {
            referredById = amb.id;
          }
        }

        // Check if profile exists
        let { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (existingProfile?.plan_expiry && new Date(existingProfile.plan_expiry) < new Date() && existingProfile.plan_type !== 'free') {
          const resetData = { plan_type: 'free', plan_expiry: null, is_professional: false };
          await supabase.from('profiles').update(resetData).eq('id', currentUser.id);
          existingProfile = { ...existingProfile, ...resetData };
        }

        if (!existingProfile) {
          // New Profile
          const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
          const newProfile = {
            id: currentUser.id,
            full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
            avatar_url: currentUser.user_metadata?.avatar_url,
            email: currentUser.email,
            last_login: new Date().toISOString(),
            status: 'active',
            referral_code: referralCode,
            referred_by: referredById,
            commission_balance: 0,
            plan_type: 'free',
            is_professional: false
          };
          await supabase.from('profiles').insert(newProfile);
          setProfile(newProfile);
        } else {
          // Existing Profile - Update last login
          await supabase.from('profiles').update({
            last_login: new Date().toISOString(),
            status: 'active'
          }).eq('id', currentUser.id);
          setProfile(existingProfile);
        }

        if (storedRef) localStorage.removeItem('vendifree_ref');
      } else if (!currentUser) {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    return { error };
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, loginWithEmail, signUpWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
