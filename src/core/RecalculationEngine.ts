// src/core/RecalculationEngine.ts
import type { StatState } from '@/modules/BalancerModule/types';
import { DependencyGraph } from './DependencyGraph';
import type { FormulaParser } from './../utils/ASTParser';
import { evaluateExpression } from '@/utils/formulaEvaluator';

export class RecalculationEngine {
  private graph: DependencyGraph;

  constructor(private parser: FormulaParser) {
    this.graph = new DependencyGraph(parser);
  }

  updateDependencyGraph(stats: Record<string, StatState>) {
    this.graph.rebuildGraph(stats);
  }

  recalculateAll(
    stats: Record<string, StatState>,
    dirtyStats: Set<string>,
    lockedStats: Set<string>
  ): {
    updatedStats: Record<string, StatState>;
    newDirtyStats: Set<string>;
    errors: { statId: string; error: string }[];
  } {
    const updated = { ...stats };
    const newDirty = new Set<string>();
    const errors: { statId: string; error: string }[] = [];

    let order: string[];
    try {
      order = this.graph.getTopologicalOrder(dirtyStats);
    } catch (e: any) {
      console.error(e);
      order = Array.from(dirtyStats);
    }

    for (const id of order) {
      if (lockedStats.has(id)) continue;
      const stat = updated[id];
      if (!stat || !stat.active) continue;

      try {
        // AST-pruning: rimuove identifer inattive
        const ast = this.parser.parse(stat.formula);
        const pruned = this.graph['extractDeps'] // usiamo traverseAST per il prune, ma qui semplifichiamo
          ? ast
          : ast;
        const expr = this.parser.astToString(pruned);

        // prepara scope
        const scope: Record<string, number> = {};
        Object.entries(updated).forEach(([k, s]) => {
          if (s.active) scope[k] = s.value;
        });

        const result = evaluateExpression(expr, scope);
        updated[id] = {
          ...stat,
          value: result,
          dirty: false,
          lastRecalcTime: Date.now(),
        };
      } catch (err: any) {
        newDirty.add(id);
        errors.push({ statId: id, error: err.message || String(err) });
      }
    }

    return { updatedStats: updated, newDirtyStats: newDirty, errors };
  }
}
