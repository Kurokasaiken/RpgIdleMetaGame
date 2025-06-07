import { SampleModuleCard } from './SampleModuleCard';
import { SampleModuleContent } from './SampleModuleContent';
import defaults from './defaults.json';
import type { MacroModule } from './types';

/**
 * Ogni modulo deve esporre un oggetto con:
 *  - id: string
 *  - name: string
 *  - Card: React.FC
 *  - Content: React.FC
 *  - defaults: MacroModule
 */
const SampleModule: MacroModule & { Card: React.FC<any>; Content: React.FC<any> } = {
  id: defaults.id,
  name: defaults.name,
  icon: defaults.icon,
  colorClass: defaults.colorClass,
  statIds: defaults.statIds,
  formula: defaults.formula,
  isVisible: defaults.isVisible,
  isActive: defaults.isActive,
  metadata: defaults.metadata || {},
  Card: SampleModuleCard,
  Content: SampleModuleContent
};

export default SampleModule;
