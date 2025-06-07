import { IStatDefinition } from "../../shared/types/Stat";

/**
 * Central registry of all available statistics in the game
 * 
 * To add a new statistic:
 * 1. Add a new entry to this object with a unique key
 * 2. Ensure the id property matches the key for consistency
 * 3. Set appropriate tags for categorization and filtering
 * 4. Use the formula property for derived stats that calculate from other stats
 * 
 * @example
 * ```typescript
 * // Adding a new derived stat
 * health: {
 *   id: "health",
 *   name: "Health",
 *   type: "derived",
 *   tags: ["secondary", "resource"],
 *   visible: true,
 *   formula: "constitution * 10 + strength * 2"
 * }
 * ```
 */
export const STAT_DEFINITIONS: Record<string, IStatDefinition> = {
  strength: {
    id: "strength",
    name: "Strength",
    type: "flat",
    tags: ["primary", "scaling"],
    visible: true
  },
  
  constitution: {
    id: "constitution",
    name: "Constitution",
    type: "flat",
    tags: ["primary", "derived"],
    visible: true,
    formula: undefined
  }
};