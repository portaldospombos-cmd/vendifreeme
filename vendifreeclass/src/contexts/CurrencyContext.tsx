import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'EUR' | 'USD' | 'BRL';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Static rates for demo (could be fetched from API)
const rates: Record<Currency, number> = {
  EUR: 1,
  USD: 1.08,
  BRL: 5.42,
};

const symbols: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  BRL: 'R$',
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('preferred_currency') as Currency) || 'EUR';
  });

  useEffect(() => {
    localStorage.setItem('preferred_currency', currency);
  }, [currency]);

  const formatPrice = (priceInEur: number) => {
    const converted = priceInEur * rates[currency];
    
    if (currency === 'BRL') {
      return `${symbols[currency]} ${converted.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    const formatted = converted.toLocaleString(currency === 'EUR' ? 'pt-PT' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return currency === 'EUR' ? `${formatted}${symbols[currency]}` : `${symbols[currency]}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
