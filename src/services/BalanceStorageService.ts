/* src/services/BalanceStorageService.ts */
const STORAGE_KEY = 'stat_balancer_snapshots';

export interface StatSnapshot {
  name: string;
  stats: any;
  formulas?: Record<string,string>;
  cardStates?: any;
  locked?: string[];
  timestamp: number;
}

export class BalanceStorageService {
  private static loadAll(): StatSnapshot[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try { return JSON.parse(raw) as StatSnapshot[]; } catch { return []; }
  }
  private static saveAll(snaps: StatSnapshot[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snaps));
  }
  static saveSnapshot(name: string, stats: any, locked: Set<string>) {
    const payload: StatSnapshot = { name, stats, timestamp: Date.now(), locked: Array.from(locked) };
    const all = this.loadAll().filter(s => s.name !== name);
    all.push(payload);
    this.saveAll(all);
  }
  static loadSnapshot(name: string): StatSnapshot | undefined {
    return this.loadAll().find(s => s.name === name);
  }
  static deleteSnapshot(name: string) {
    const all = this.loadAll().filter(s => s.name !== name);
    this.saveAll(all);
  }
  static listSnapshotNames(): string[] {
    return this.loadAll().map(s => s.name);
  }
}
