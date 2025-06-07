// src/utils/statPersistence.ts
import { StatInstance } from "../core/stats/StatInstance";

export const saveStats = (stats: Record<string, number>) => {
  const toSave = Object.entries(stats).map(([id, baseValue]) => ({
    id,
    baseValue,
  }));
  localStorage.setItem("stats", JSON.stringify(toSave));
};

export const loadStats = (): Record<string, number> | null => {
  const raw = localStorage.getItem("stats");
  if (!raw) return null;

  try {
    const parsed: { id: string; baseValue: number }[] = JSON.parse(raw);
    return Object.fromEntries(parsed.map(({ id, baseValue }) => [id, baseValue]));
  } catch (e) {
    console.error("Failed to load stats:", e);
    return null;
  }
};
