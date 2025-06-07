import { IStatDefinition } from "../../shared/types/Stat";
import { IStatModifier } from "../../shared/types/Modifier";

/**
 * Runtime instance of a statistic with dynamic values and modifiers
 * Represents the actual value of a statistic for a specific entity
 */
export class StatInstance {
  /**
   * The immutable definition of this statistic
   */
  public readonly definition: IStatDefinition;

  /**
   * The base value of this statistic before any modifiers
   */
  public baseValue: number;

  /**
   * Array of active modifiers affecting this statistic
   */
  public readonly modifiers: IStatModifier[] = [];

  /**
   * Creates a new statistic instance
   * @param definition - The immutable statistic definition
   * @param baseValue - The base value before modifiers
   */
  constructor(definition: IStatDefinition, baseValue: number) {
    this.definition = definition;
    this.baseValue = baseValue;
  }

  /**
   * Calculates the current effective value of this statistic
   * Applies flat modifiers first, then percentage modifiers
   * 
   * @returns The final calculated value after all modifiers
   * 
   * @example
   * ```typescript
   * // Base value: 100
   * // Flat modifier: +20
   * // Percent modifier: +15% (0.15)
   * // Result: (100 + 20) * (1 + 0.15) = 138
   * ```
   */
  get current(): number {
    // Start with base value
    let value = this.baseValue;

    // Apply flat modifiers first
    const flatModifiers = this.modifiers.filter(mod => mod.type === "flat");
    for (const modifier of flatModifiers) {
      value += modifier.value;
    }

    // Apply percentage modifiers to the result
    const percentModifiers = this.modifiers.filter(mod => mod.type === "percent");
    let percentMultiplier = 1;
    for (const modifier of percentModifiers) {
      percentMultiplier += modifier.value;
    }

    return value * percentMultiplier;
  }

  /**
   * Adds a modifier to this statistic
   * If the modifier is not stackable and another modifier from the same source exists,
   * the existing modifier will be replaced
   * 
   * @param modifier - The modifier to add
   * 
   * @example
   * ```typescript
   * const strengthBonus: IStatModifier = {
   *   id: "sword-strength",
   *   type: "flat",
   *   value: 10,
   *   source: "equipment",
   *   description: "Iron Sword +10 Strength"
   * };
   * statInstance.addModifier(strengthBonus);
   * ```
   */
  addModifier(modifier: IStatModifier): void {
    // Check if modifier is stackable
    if (modifier.stackable === false) {
      // Remove existing modifiers from the same source
      const existingIndex = this.modifiers.findIndex(
        mod => mod.source === modifier.source && mod.id !== modifier.id
      );
      if (existingIndex >= 0) {
        this.modifiers.splice(existingIndex, 1);
      }
    }

    this.modifiers.push(modifier);
  }

  /**
   * Removes all temporary modifiers (those with a duration)
   * Useful for clearing expired buffs/debuffs
   * 
   * @example
   * ```typescript
   * // Remove all temporary effects at end of turn
   * statInstance.clearTemporary();
   * ```
   */
  clearTemporary(): void {
    for (let i = this.modifiers.length - 1; i >= 0; i--) {
      const modifier = this.modifiers[i];
      if (modifier.duration !== undefined) {
        this.modifiers.splice(i, 1);
      }
    }
  }
}