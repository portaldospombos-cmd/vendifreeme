import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, Currency, translations, currencies } from '../translations';

interface SettingsContextType {
  language: Language;
  currency: Currency;
  location: string | null;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  setLocation: (loc: string | null) => void;
  t: (path: string, replacements?: Record<string, any>) => any;
  formatPrice: (amount: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('vendifree_lang');
    if (saved && (saved === 'pt' || saved === 'en' || saved === 'es')) return saved as Language;
    
    // Auto-detect from browser
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'pt' || browserLang === 'en' || browserLang === 'es') {
      return browserLang as Language;
    }
    
    return 'pt';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('vendifree_curr');
    return (saved as Currency) || 'EUR';
  });

  const [location, setLocation] = useState<string | null>(() => {
    const saved = localStorage.getItem('vendifree_loc');
    return saved === 'null' ? null : (saved || null);
  });

  useEffect(() => {
    localStorage.setItem('vendifree_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('vendifree_curr', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('vendifree_loc', String(location));
  }, [location]);

  const t = (path: string, replacements?: Record<string, any>) => {
    const keys = path.split('.');
    let value: any = translations[language];
    
    for (const key of keys) {
      if (!value || value[key] === undefined) return path;
      value = value[key];
    }

    if (typeof value === 'string' && replacements) {
      let result = value;
      Object.entries(replacements).forEach(([key, val]) => {
        result = result.replace(`{${key}}`, String(val));
      });
      return result;
    }

    return value;
  };

  const formatPrice = (amount: number) => {
    const config = currencies[currency];
    // Simple conversion for demo purposes (1 USD = 0.92 EUR = 5.00 BRL)
    let convertedAmount = amount;
    if (currency === 'EUR') convertedAmount = amount * 0.92;
    if (currency === 'BRL') convertedAmount = amount * 5.05;

    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currency,
    }).format(convertedAmount);
  };

  return (
    <SettingsContext.Provider value={{ language, currency, location, setLanguage, setCurrency, setLocation, t, formatPrice }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
