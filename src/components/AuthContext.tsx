import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserAccount } from '../types';
import { ACCOUNTS } from '../data';

interface AuthContextType {
  currentUser: UserAccount | null;
  login: (email: string, password: string) => { success: boolean; error?: string; user?: UserAccount };
  register: (data: Omit<UserAccount, 'id' | 'role' | 'status' | 'failedAttempts'>) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserAccount>) => void;
}

const AuthCtx = createContext<AuthContextType>({
  currentUser: null,
  login: () => ({ success: false }),
  register: () => {},
  logout: () => {},
  updateProfile: () => {},
});

export const useAuth = () => useContext(AuthCtx);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [accounts, setAccounts] = useState<UserAccount[]>(ACCOUNTS);

  const login = useCallback((email: string, password: string): { success: boolean; error?: string; user?: UserAccount } => {
    const accIndex = accounts.findIndex(a => a.email.toLowerCase() === email.toLowerCase());
    
    if (accIndex === -1) {
      return { success: false, error: 'E-mail não encontrado.' };
    }

    const account = accounts[accIndex];

    if (account.status === 'locked') {
      return { success: false, error: 'Conta bloqueada após múltiplas tentativas falhadas. Contacte o suporte.' };
    }

    if (account.status === 'pending_activation') {
      return { success: false, error: 'Conta ainda não ativada. Verifique o seu e-mail.' };
    }

    if (account.password === password) {
      const updatedAcc = { ...account, failedAttempts: 0 };
      const newAccounts = [...accounts];
      newAccounts[accIndex] = updatedAcc;
      setAccounts(newAccounts);
      setCurrentUser(updatedAcc);
      return { success: true, user: updatedAcc };
    } else {
      const newAttempts = account.failedAttempts + 1;
      const isLocked = newAttempts >= 3;
      const updatedAcc = { 
        ...account, 
        failedAttempts: newAttempts, 
        status: isLocked ? 'locked' : account.status 
      } as UserAccount;
      
      const newAccounts = [...accounts];
      newAccounts[accIndex] = updatedAcc;
      setAccounts(newAccounts);

      return { 
        success: false, 
        error: isLocked ? 'Conta bloqueada após 3 tentativas falhadas.' : `Password incorreta. Tentativa ${newAttempts} de 3.` 
      };
    }
  }, [accounts]);

  const register = useCallback((data: Omit<UserAccount, 'id' | 'role' | 'status' | 'failedAttempts'>) => {
    const newUser: UserAccount = {
      ...data,
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      status: 'pending_activation',
      failedAttempts: 0
    };
    setAccounts(prev => [...prev, newUser]);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const updateProfile = useCallback((data: Partial<UserAccount>) => {
    setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    if (currentUser) {
      setAccounts(prev => prev.map(a => a.id === currentUser.id ? { ...a, ...data } : a));
    }
  }, [currentUser]);

  return (
    <AuthCtx.Provider value={{ currentUser, login, register, logout, updateProfile }}>
      {children}
    </AuthCtx.Provider>
  );
};
