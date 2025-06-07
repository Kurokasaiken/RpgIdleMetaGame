// src/modules/BalancerTab/types.ts
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
