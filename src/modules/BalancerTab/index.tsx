// src/modules/BalancerTab/index.tsx
import BalancerCard from './BalancerCard';
import BalancerContent from './BalancerTab'; // il componente preesistente
import type { MacroModule } from './types';

const BalancerModule: MacroModule = {
  id: 'balancer-tab',
  name: 'Bilanciamento Stat',
  icon: '⚖️',
  colorClass: 'text-yellow-400',
  statIds: [],       // qui potrai mettere le stat di default (es. da defaultBalancerConfig)
  isVisible: true,
  isActive: true,
  Card: BalancerCard,
  Content: BalancerContent,
};

export default BalancerModule;
