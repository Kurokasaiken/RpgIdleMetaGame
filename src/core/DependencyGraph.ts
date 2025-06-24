
// src/core/DependencyGraph.ts
// before anything else

import type { StatState } from '@/modules/BalancerModule/types';
import type { FormulaParser } from './../utils/ASTParser';

export class DependencyGraph {
  private nodes = new Map<string, {
    dependencies: Set<string>;
    dependents: Set<string>;
  }>();
  private parser: FormulaParser;

  constructor(parser: FormulaParser) {
    this.parser = parser;
  }

  rebuildGraph(stats: Record<string, StatState>): void {
    this.nodes.clear();
    Object.keys(stats).forEach((id) => {
      this.nodes.set(id, { dependencies: new Set(), dependents: new Set() });
    });
    for (const [id, stat] of Object.entries(stats)) {
      if (stat.formula && stat.active) {
        const deps = this.extractDeps(stat.formula, stats);
        this.setDependencies(id, deps);
      }
    }
  }

  private extractDeps(formula: string, stats: Record<string, StatState>): string[] {
    const ast = this.parser.parse(formula);
    const deps = new Set<string>();
    this.traverseAST(ast, (node) => {
      if (node.type === 'identifier' && stats[node.name!] && stats[node.name!].active) {
        deps.add(node.name!);
      }
    });
    return Array.from(deps);
  }

  private traverseAST(node: any, cb: (node: any) => void): void {
    cb(node);
    if (node.children) node.children.forEach((c: any) => this.traverseAST(c, cb));
    if (node.left) this.traverseAST(node.left, cb);
    if (node.right) this.traverseAST(node.right, cb);
  }

  private setDependencies(id: string, deps: string[]) {
    const node = this.nodes.get(id)!;
    // rimuovi vecchie
    node.dependencies.forEach((d) => this.nodes.get(d)!.dependents.delete(id));
    node.dependencies.clear();
    // aggiungi nuove
    for (const d of deps) {
      node.dependencies.add(d);
      this.nodes.get(d)!.dependents.add(id);
    }
  }

  getTopologicalOrder(dirty: Set<string>): string[] {
    const visited = new Set<string>();
    const temp = new Set<string>();
    const result: string[] = [];

    const visit = (id: string) => {
      if (visited.has(id)) return;
      if (temp.has(id)) throw new Error(`Circular dependency at ${id}`);
      temp.add(id);
      for (const dep of this.nodes.get(id)!.dependencies) {
        if (dirty.has(dep) || visited.has(dep)) visit(dep);
      }
      temp.delete(id);
      visited.add(id);
      result.push(id);
    };

    dirty.forEach(visit);
    return result;
  }
}
