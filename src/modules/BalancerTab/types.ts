/* src/modules/BalancerTab/types.ts */
import type React from 'react';

export interface MacroModule {
  id: string;
  name: string;
  icon: React.ReactNode;
  colorClass: string;
  statIds: string[];
  isVisible: boolean;
  isActive: boolean;
  Card: React.FC<{ module: MacroModule }>;
  Content: React.FC<{ module: MacroModule }>;
}

/** Stato di ciascuna Stat nel Balancer */
export interface StatState {
  id: string;
  name: string;
  value: number;
  formula: string;
  locked: boolean;
  visible: boolean;
}

/** Stato di ciascuna Card (macro o micro) */
export interface CardState {
  id: string;
  name: string;
  icon?: string;
  collapsed: boolean;
  active: boolean;
  stats: string[];
  subCards: string[];
}
