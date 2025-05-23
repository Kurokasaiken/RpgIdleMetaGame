import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definizione dell'interfaccia BalanceParams
export interface BalanceParams {
  hitsToKill: number;
  baseHP: number;
  baseDamage: number;
  modules: {
    hitChance: boolean;
    critical: boolean;
    armor: boolean;
    magic: boolean;
    initiative: boolean;
    cooldowns: boolean;
  };
  hitChance: number;
  critChance: number;
  critMultiplier: number;
  armorValue: number;
  armorPen: number;
}

interface BalanceContextType {
  balanceParams: BalanceParams;
  setBalanceParams: React.Dispatch<React.SetStateAction<BalanceParams>>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balanceParams, setBalanceParams] = useState<BalanceParams>({
    hitsToKill: 5,
    baseHP: 100,
    baseDamage: 20,
    modules: {
      hitChance: false,
      critical: false,
      armor: false,
      magic: false,
      initiative: false,
      cooldowns: false,
    },
    hitChance: 75,
    critChance: 15,
    critMultiplier: 200,
    armorValue: 10,
    armorPen: 0,
  });

  return (
    <BalanceContext.Provider value={{ balanceParams, setBalanceParams }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};