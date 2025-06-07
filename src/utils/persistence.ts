const BALANCER_KEY = 'balancer_entries';

export interface BalancerConfig {
  id: string;
  // add other properties as needed
}

export function loadAllBalancerConfigs(): BalancerConfig[] {
  const raw = localStorage.getItem(BALANCER_KEY);
  return raw ? JSON.parse(raw) as BalancerConfig[] : [];
}

export function saveBalancerConfig(entry: BalancerConfig) {
  const current = loadAllBalancerConfigs().filter((e: BalancerConfig) => e.id !== entry.id);
  localStorage.setItem(BALANCER_KEY, JSON.stringify([...current, entry]));
}
