import type { MacroModule } from '../BalancerModule/types';
import { BarChart, SlidersHorizontal } from 'lucide-react';

export const StatBalancerModule: MacroModule = {
  id: 'stat-balancer',
  name: 'Stat Balancer',
  icon: <SlidersHorizontal className="w-6 h-6" />,
  colorClass: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white',
  statIds: ['strength', 'agility', 'intelligence'],
  isVisible: true,
  isActive: true,

  Card: ({ module }) => (
    <div className={`p-4 rounded-xl shadow-md ${module.colorClass}`}>
      <div className="flex items-center space-x-2">
        {module.icon}
        <h2 className="text-lg font-bold">{module.name}</h2>
      </div>
      <p className="mt-2 text-sm">Bilancia le statistiche dei personaggi per una progressione armoniosa.</p>
    </div>
  ),

  Content: ({ module }) => (
    <div className="p-4 space-y-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <BarChart className="w-5 h-5" />
        Gestione {module.name}
      </h3>
      <p className="text-sm text-muted-foreground">
        Qui puoi vedere l’equilibrio corrente tra le statistiche:
      </p>
      <ul className="list-disc pl-5 text-sm">
        {module.statIds.map(stat => (
          <li key={stat}>{stat}</li>
        ))}
      </ul>
    </div>
  ),
};
