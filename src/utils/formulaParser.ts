/**
 * formulaParser: valuta in modo “quasi sicuro” stringhe matematiche,
 * sostituendo le variabili con un oggetto “vars”.
 *
 * Esempio:
 *   formula: "hp / (damage * (1 - armor))"
 *   vars: { hp: 100, damage: 20, armor: 0.2 }
 *   → restituisce 100 / (20 * (1 - 0.2)) = 6.25
 *
 * Attenzione: non è completamente sandboxed, evita funzioni non matematiche nel template.
 */
export function formulaParser(
  formula: string,
  vars: Record<string, number>
): number | null {
  try {
    // Crea un contesto “with” che espone direttamente le chiavi di vars
    const func = new Function(
      'vars',
      `
      const { ${Object.keys(vars).join(', ')} } = vars;
      return ${formula};
    `
    );
    const result = func(vars);
    if (typeof result === 'number' && isFinite(result)) {
      return result;
    }
    return null;
  } catch (e) {
    console.error('Errore nel parsing della formula:', e);
    return null;
  }
}
