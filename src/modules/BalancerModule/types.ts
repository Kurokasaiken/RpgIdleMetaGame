/* src/modules/BalancerTab/types.ts */
import type React from 'react';

export interface MacroModule {
  id: string;
  name: string;
  icon: string;
  colorClass?: string;
  isVisible: boolean;
  isActive: boolean;
  statIds: string[];
  Card: React.FC<any>;
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
  constant: number | null; // Add this property
}

/** Stato di ciascuna Card (macro o micro) */
export interface CardState {
  id: string;
  name: string;
  icon?: string;
  collapsed: boolean;
  active: boolean;
  color: string;
  formula?: string;
  stats: string[];
  subCards: string[];
}
