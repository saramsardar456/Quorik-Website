import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'PKR' | 'AED' | 'EUR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  label: string;
  flag: string;
  name: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1, label: 'USD ($)', flag: '🇺🇸', name: 'US Dollar' },
  PKR: { code: 'PKR', symbol: '₨ ', rate: 278.5, label: 'PKR (₨)', flag: '🇵🇰', name: 'PKR Rupee' },
  AED: { code: 'AED', symbol: 'AED ', rate: 3.67, label: 'AED (د.إ)', flag: '🇦🇪', name: 'UAE Dirham' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)', flag: '🇪🇺', name: 'Euro' },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  currencyConfig: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (usdAmount: number, options?: { compact?: boolean; hideSymbol?: boolean }) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('quorik_currency');
    return (saved && saved in CURRENCIES) ? (saved as CurrencyCode) : 'USD';
  });

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('quorik_currency', code);
  };

  const currencyConfig = CURRENCIES[currency];

  const formatPrice = (usdAmount: number, options?: { compact?: boolean; hideSymbol?: boolean }) => {
    const converted = usdAmount * currencyConfig.rate;
    
    // For PKR, round to integer with commas
    let formattedNum = '';
    if (currency === 'PKR') {
      formattedNum = Math.round(converted).toLocaleString('en-US');
    } else if (currency === 'AED') {
      formattedNum = Math.round(converted).toLocaleString('en-US');
    } else if (currency === 'EUR') {
      formattedNum = Math.round(converted).toLocaleString('de-DE');
    } else {
      formattedNum = Math.round(converted).toLocaleString('en-US');
    }

    if (options?.hideSymbol) {
      return formattedNum;
    }

    if (currency === 'PKR' || currency === 'AED') {
      return `${currencyConfig.symbol}${formattedNum}`;
    }

    return `${currencyConfig.symbol}${formattedNum}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, currencyConfig, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
