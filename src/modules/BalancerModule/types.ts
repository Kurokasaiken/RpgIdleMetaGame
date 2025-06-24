// src/modules/BalancerModule/types.ts

export interface MacroModule {
  id: string;
  name: string;
  icon: string;
  colorClass?: string;
  isVisible: boolean;
  isActive: boolean;
  statIds: string[];
  Card: React.FC<{ module: MacroModule }>;
  Content: React.FC<{ module: MacroModule }>;
}

export interface StatState {
  id: string;
  name: string;
  value: number;
  formula: string;
  locked: boolean;
  tooltip?: string;
  constant: number | null;
  dirty: boolean;
  active: boolean;
  visible: boolean;
  lastRecalcTime?: number;
}

export interface CardState {
  id: string;
  name: string;
  icon: string;
  color: string;
  collapsed: boolean;
  active: boolean;
  visible: boolean;
  stats: string[];
  subCards: string[];
  formula?: string;
}
