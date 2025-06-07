import { IStatDefinition } from "../../shared/types/Stat";
import { STAT_DEFINITIONS } from "./StatDefinition";

/**
 * Singleton registry for managing statistic definitions
 * Provides centralized access to all registered statistics without direct imports
 */
export class StatRegistry {
  private definitions: Record<string, IStatDefinition>;

  constructor() {
    this.definitions = STAT_DEFINITIONS;
  }

  /**
   * Retrieves all registered statistic definitions
   * @returns Array of all available statistic definitions
   */
  getAll(): IStatDefinition[] {
    return Object.values(this.definitions);
  }

  /**
   * Retrieves a specific statistic definition by its unique identifier
   * @param id - The unique identifier of the statistic
   * @returns The statistic definition if found, undefined otherwise
   * 
   * @example
   * ```typescript
   * const strengthStat = statRegistry.getById("strength");
   * if (strengthStat) {
   *   console.log(strengthStat.name); // "Strength"
   * }
   * ```
   */
  getById(id: string): IStatDefinition | undefined {
    return this.definitions[id];
  }

  /**
   * Checks if a statistic with the given identifier exists
   * @param id - The unique identifier to check
   * @returns True if the statistic exists, false otherwise
   * 
   * @example
   * ```typescript
   * if (statRegistry.has("strength")) {
   *   // Safe to use strength stat
   * }
   * ```
   */
  has(id: string): boolean {
    return id in this.definitions;
  }
}

/**
 * Singleton instance of the StatRegistry
 * Use this instance throughout the application to access statistic definitions
 */
export const statRegistry = new StatRegistry();