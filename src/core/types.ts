export interface GameModule {
  id: string;
  name: string;
  Content: React.ComponentType<any>;
  isVisible: true;
  isActive: true;
  icon?: string;
  colorClass?: string;
}

export interface MacroModule extends GameModule {
  Card?: React.ComponentType<any>;
  statIds?: string[];
}
