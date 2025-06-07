import { STAT_DEFINITIONS } from "./StatDefinition";
import { statRegistry } from "./StatRegistry";
import { StatInstance } from "./StatInstance";
import { IStatModifier } from "../../shared/types/Modifier";

/**
 * Manager class for creating and managing collections of StatInstance objects
 * Handles bulk operations on statistics for entities like players, enemies, items, etc.
 * 
 * Usage:
 * - Use createAll() to initialize stats for a new entity
 * - Use resetAll() to clear all modifiers when loading from save
 * - Use applyModifier() to add effects from equipment, buffs, etc.
 * 
 * Serialization considerations:
 * - Only serialize baseValues and permanent modifiers
 * - Temporary modifiers should be recalculated on load
 * - Use StatInstance.definition.id as keys for serialization
 */
export class StatManager {
  /**
   * Creates StatInstance objects for all registered statistics
   * If a baseValue is not provided for a stat, defaults to 0
   * 
   * @param baseValues - Record mapping stat IDs to their base values
   * @returns Array of StatInstance objects for all registered stats
   * 
   * @example
   * ```typescript
   * const manager = new StatManager();
   * const playerStats = manager.createAll({
   *   strength: 10,
   *   constitution: 12,
   *   // Other stats will default to 0
   * });
   * ```
   */
  createAll(baseValues: Record<string, number>): StatInstance[] {
    const instances: StatInstance[] = [];
    
    const allDefinitions = statRegistry.getAll();
    
    for (const definition of allDefinitions) {
      const baseValue = baseValues[definition.id] ?? 0;
      const instance = new StatInstance(definition, baseValue);
      instances.push(instance);
    }
    
    return instances;
  }

  /**
   * Resets all StatInstance objects by clearing their modifiers
   * Useful when loading from save data or when resetting entity state
   * Base values are preserved
   * 
   * @param instances - Array of StatInstance objects to reset
   * 
   * @example
   * ```typescript
   * // Clear all temporary effects when loading save
   * manager.resetAll(playerStats);
   * ```
   */
  resetAll(instances: StatInstance[]): void {
    for (const instance of instances) {
      // Clear all modifiers
      instance.modifiers.length = 0;
    }
  }

  /**
   * Applies a modifier to a specific statistic across a collection of instances
   * Finds the matching StatInstance by statId and adds the modifier
   * 
   * @param instances - Array of StatInstance objects to search
   * @param statId - The ID of the statistic to modify
   * @param modifier - The modifier to apply
   * @returns True if the stat was found and modifier applied, false otherwise
   * 
   * @example
   * ```typescript
   * const strengthBuff: IStatModifier = {
   *   id: "berserker-rage",
   *   type: "percent",
   *   value: 0.25, // +25%
   *   source: "buff",
   *   description: "Berserker Rage +25% Strength",
   *   duration: 5
   * };
   * 
   * const success = manager.applyModifier(playerStats, "strength", strengthBuff);
   * ```
   */
  applyModifier(instances: StatInstance[], statId: string, modifier: IStatModifier): boolean {
    const targetInstance = instances.find(instance => instance.definition.id === statId);
    
    if (!targetInstance) {
      console.warn(`StatManager: Attempted to apply modifier to unknown stat "${statId}"`);
      return false;
    }
    
    targetInstance.addModifier(modifier);
    return true;
  }

  /**
   * Removes all temporary modifiers from all StatInstance objects
   * Useful for turn-based systems or timed effect cleanup
   * 
   * @param instances - Array of StatInstance objects to clean
   * 
   * @example
   * ```typescript
   * // Clear expired buffs at end of turn
   * manager.clearAllTemporary(playerStats);
   * ```
   */
  clearAllTemporary(instances: StatInstance[]): void {
    for (const instance of instances) {
      instance.clearTemporary();
    }
  }

  /**
   * Finds a specific StatInstance by its stat ID
   * Helper method for accessing individual stats from a collection
   * 
   * @param instances - Array of StatInstance objects to search
   * @param statId - The ID of the statistic to find
   * @returns The StatInstance if found, undefined otherwise
   * 
   * @example
   * ```typescript
   * const strengthStat = manager.findStat(playerStats, "strength");
   * if (strengthStat) {
   *   console.log(`Current strength: ${strengthStat.current}`);
   * }
   * ```
   */
  findStat(instances: StatInstance[], statId: string): StatInstance | undefined {
    return instances.find(instance => instance.definition.id === statId);
  }
}