"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import { TierLevel, TierContextType } from '@/types/tier';

const TierContext = createContext<TierContextType | undefined>(undefined);

export const TierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tier, setTier] = useState<TierLevel>(TierLevel.FREE);

  const value = useMemo(() => ({
    tier,
    setTier,
    isPro: tier === TierLevel.PRO,
    isElite: tier === TierLevel.ELITE
  }), [tier]);

  return (
    <TierContext.Provider value={value}>
      {children}
    </TierContext.Provider>
  );
};

export const useTierContext = () => {
  const context = useContext(TierContext);
  if (context === undefined) {
    throw new Error('useTierContext must be used within a TierProvider');
  }
  return context;
}; 