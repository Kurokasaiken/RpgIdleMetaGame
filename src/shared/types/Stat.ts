/**
 * Defines the types of statistics available in the RPG system
 */
export type StatType = "flat" | "percent" | "derived";

/**
 * Interface defining the structure of a statistic definition
 */
export interface IStatDefinition {
  /**
   * Unique identifier for the statistic
   * Used as a key throughout the system
   */
  id: string;

  /**
   * Human-readable name for the statistic
   * Displayed in UI components
   */
  name: string;

  /**
   * The type of statistic this represents
   * - "flat": Direct numerical value (e.g., 100 HP)
   * - "percent": Percentage-based value (e.g., 15% crit chance)
   * - "derived": Calculated from other statistics using a formula
   */
  type: StatType;

  /**
   * Tags for categorizing and filtering statistics
   * Examples: ["primary", "scaling"], ["combat", "defensive"], ["resource"]
   */
  tags: string[];

  /**
   * Whether this statistic should be visible in the UI
   * Hidden stats can be used for internal calculations
   */
  visible: boolean;

  /**
   * Mathematical formula used to calculate derived statistics
   * Only required when type === "derived"
   * Should reference other stat IDs that will be resolved at runtime
   * Example: "strength * 2 + dexterity * 0.5"
   */
  formula?: string;
}export interface Stat {
  id: string;
  name: string;
  baseValue: number;
  currentValue: number;
  isLocked: boolean;
  isVisible: boolean;
  isActive: boolean;
}

export interface Stat extends Pick<IStatDefinition, 'id' | 'name'> {
  baseValue: number;
  currentValue: number;
  isLocked: boolean;
  isVisible: boolean;
  isActive: boolean;
}
