// src/utils/formulaEvaluator.ts
export function evaluateExpression(
  expression: string,
  scope: Record<string, number>
): number {
  // Sostituisce tutte le variabili con i loro valori
  let expr = expression;
  Object.entries(scope).forEach(([k, v]) => {
    const re = new RegExp(`\\b${k}\\b`, 'g');
    expr = expr.replace(re, v.toString());
  });
  // Verifica caratteri sicuri
  if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
    throw new Error('Expression contains invalid characters');
  }
  // eslint-disable-next-line no-new-func
  return new Function(`return ${expr}`)();
}
