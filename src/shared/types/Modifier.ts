/**
 * Defines the types of modifiers that can be applied to statistics
 */
export type ModifierType = "flat" | "percent";

/**
 * Interface defining the structure of a statistic modifier
 * Used for buffs, debuffs, equipment bonuses, and temporary effects
 */
export interface IStatModifier {
  /**
   * Unique identifier for this modifier instance
   * Used to track and remove specific modifiers
   */
  id: string;

  /**
   * The type of modification this applies
   * - "flat": Adds/subtracts a direct numerical value (e.g., +10 HP)
   * - "percent": Applies a percentage modifier (e.g., +15% damage)
   */
  type: ModifierType;

  /**
   * The numerical value of the modifier
   * For flat modifiers: direct value to add/subtract
   * For percent modifiers: percentage as decimal (0.15 for 15%)
   */
  value: number;

  /**
   * The source that created this modifier
   * Examples: "buff", "equipment", "skill", "item", "enchantment"
   * Used for categorization and conflict resolution
   */
  source: string;

  /**
   * Optional human-readable description of the modifier
   * Used for UI display and debugging purposes
   * Example: "Iron Sword +5 Attack" or "Haste Buff +20% Speed"
   */
  description?: string;

  /**
   * Optional duration in game turns/ticks
   * If undefined, the modifier is considered permanent
   * Used for temporary buffs, debuffs, and timed effects
   */
  duration?: number;

  /**
   * Whether multiple instances of this modifier can stack
   * If false, only one instance from the same source should be active
   * Defaults to true if not specified
   */
  stackable?: boolean;
}