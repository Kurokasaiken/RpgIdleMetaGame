// src/core/DependencyGraph.ts
export function extractVariables(expr: string): string[] {
  // un parser semplificato: trova tutte le occorrenze di variabili (es. parole)
  // in produzione serve un AST vero, ma per ora basta un regex
  const regex = /[a-zA-Z_]\w*/g;
  const vars = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = regex.exec(expr))) vars.add(m[0]);
  return Array.from(vars);
}

export function buildDependencyMap(
  stats: Record<string, { formula: string | null }>
): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  Object.entries(stats).forEach(([id, stat]) => {
    if (stat.formula) {
      const deps = extractVariables(stat.formula);
      map[id] = deps.filter((d) => d in stats);
    } else {
      map[id] = [];
    }
  });
  return map;
}

export function getDependentsRecursively(
  target: string,
  depMap: Record<string, string[]>
): string[] {
  const visited = new Set<string>();
  function dfs(curr: string) {
    Object.entries(depMap).forEach(([statId, deps]) => {
      if (deps.includes(curr) && !visited.has(statId)) {
        visited.add(statId);
        dfs(statId);
      }
    });
  }
  dfs(target);
  return Array.from(visited);
}
