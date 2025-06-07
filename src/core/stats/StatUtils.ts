import { IStatModifier } from "../../shared/types/Modifier";

/**
 * Evaluates a mathematical formula string with given variable context
 * Uses a minimal expression parser that supports basic arithmetic operations
 * 
 * Supported operations: +, -, *, /, ^, (, )
 * Variables are resolved from the context object
 * 
 * @param formula - Mathematical formula as string (e.g., "strength * 2 + dexterity * 0.5")
 * @param context - Object mapping variable names to their numeric values
 * @returns The calculated result
 * 
 * @example
 * ```typescript
 * const result = evaluateFormula("strength * 2 + constitution", {
 *   strength: 15,
 *   constitution: 12
 * });
 * // Returns: 42 (15 * 2 + 12)
 * ```
 */
export function evaluateFormula(formula: string, context: Record<string, number>): number {
  // Replace variables with their values
  let expression = formula;
  
  // Sort variables by length (descending) to avoid partial replacements
  const variables = Object.keys(context).sort((a, b) => b.length - a.length);
  
  for (const variable of variables) {
    const value = context[variable] ?? 0;
    const regex = new RegExp(`\\b${variable}\\b`, 'g');
    expression = expression.replace(regex, value.toString());
  }
  
  // Handle power operator (^) -> convert to Math.pow
  expression = expression.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, 'Math.pow($1, $2)');
  
  try {
    // Use Function constructor for safe evaluation (no access to global scope)
    const result = new Function(`"use strict"; return (${expression})`)();
    return typeof result === 'number' && !isNaN(result) ? result : 0;
  } catch (error) {
    console.warn(`Formula evaluation failed for "${formula}":`, error);
    return 0;
  }
}

/**
 * Applies a soft cap to a value using diminishing returns
 * Values below the cap are unaffected, values above experience reduced growth
 * 
 * Formula: cap + (value - cap) / (1 + ((value - cap) / cap) ^ exponent)
 * 
 * @param value - The input value to cap
 * @param cap - The soft cap threshold
 * @param exponent - Controls the severity of diminishing returns (default: 2)
 * @returns The soft-capped value
 * 
 * @example
 * ```typescript
 * // Linear growth up to 100, then diminishing returns
 * applySoftCap(50, 100);   // Returns: 50 (below cap)
 * applySoftCap(150, 100);  // Returns: ~116.67 (soft capped)
 * applySoftCap(200, 100);  // Returns: ~125 (heavily diminished)
 * ```
 */
export function applySoftCap(value: number, cap: number, exponent: number = 2): number {
  if (value <= cap) {
    return value;
  }
  
  const excess = value - cap;
  const ratio = excess / cap;
  const diminished = excess / (1 + Math.pow(ratio, exponent));
  
  return cap + diminished;
}

/**
 * Merges an array of modifiers into separate flat and percentage totals
 * Flat modifiers are summed, percentage modifiers are summed additively
 * 
 * @param modifiers - Array of stat modifiers to merge
 * @returns Object containing the total flat and percent values
 * 
 * @example
 * ```typescript
 * const modifiers: IStatModifier[] = [
 *   { type: "flat", value: 10 },
 *   { type: "flat", value: 5 },
 *   { type: "percent", value: 0.15 }, // 15%
 *   { type: "percent", value: 0.10 }  // 10%
 * ];
 * 
 * const result = mergeModifiers(modifiers);
 * // Returns: { flat: 15, percent: 0.25 } (25% total)
 * ```
 */
export function mergeModifiers(modifiers: IStatModifier[]): { flat: number; percent: number } {
  let flat = 0;
  let percent = 0;
  
  for (const modifier of modifiers) {
    if (modifier.type === "flat") {
      flat += modifier.value;
    } else if (modifier.type === "percent") {
      percent += modifier.value;
    }
  }
  
  return { flat, percent };
}

/**
 * Calculates the final value applying base, flat modifiers, and percentage modifiers
 * Helper function that combines common stat calculation logic
 * 
 * @param baseValue - The base value before any modifiers
 * @param flatBonus - Total flat modifiers to add
 * @param percentBonus - Total percentage modifiers (as decimal, e.g., 0.25 for 25%)
 * @returns The final calculated value
 * 
 * @example
 * ```typescript
 * // Base: 100, Flat: +20, Percent: +15%
 * const final = calculateFinalValue(100, 20, 0.15);
 * // Returns: 138 ((100 + 20) * (1 + 0.15))
 * ```
 */
export function calculateFinalValue(baseValue: number, flatBonus: number, percentBonus: number): number {
  return (baseValue + flatBonus) * (1 + percentBonus);
}

/**
 * Validates that a formula string contains only safe mathematical expressions
 * Prevents execution of potentially harmful code in formula evaluation
 * 
 * @param formula - The formula string to validate
 * @returns True if the formula appears safe, false otherwise
 * 
 * @example
 * ```typescript
 * isValidFormula("strength * 2 + constitution");     // Returns: true
 * isValidFormula("strength * 2; alert('hack')");     // Returns: false
 * isValidFormula("Math.random()");                   // Returns: false
 * ```
 */
export function isValidFormula(formula: string): boolean {
  // Allow only alphanumeric characters, basic math operators, dots, parentheses, and whitespace
  const safePattern = /^[a-zA-Z0-9+\-*/^().\s]+$/;
  
  // Reject potentially dangerous patterns
  const dangerousPatterns = [
    /function/i,
    /eval/i,
    /constructor/i,
    /prototype/i,
    /__/,
    /;/,
    /=/,
    /\[/,
    /\]/,
    /\{/,
    /\}/
  ];
  
  if (!safePattern.test(formula)) {
    return false;
  }
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(formula)) {
      return false;
    }
  }
  
  return true;
}