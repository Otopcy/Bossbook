"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Currency = "XAF" | "EUR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convert: (amountXAF: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const RATES: Record<Currency, number> = {
  XAF: 1,
  EUR: 655,
  USD: 600,
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("XAF");

  useEffect(() => {
    const saved = localStorage.getItem("bossbook_currency") as Currency;
    if (saved && ["XAF", "EUR", "USD"].includes(saved)) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("bossbook_currency", c);
    // Force a re-render or update of components that don't use context but listen to storage
    window.dispatchEvent(new Event("storage"));
  };

  const convert = (amountXAF: number) => {
    if (currency === "XAF") return amountXAF;
    return amountXAF / RATES[currency];
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
