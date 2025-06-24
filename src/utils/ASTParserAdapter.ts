// src/utils/ASTParserAdapter.ts
import type { FormulaParser, ASTNode } from '@/utils/ASTParser';

/**
 * A minimal adapter that satisfies FormulaParser:
 *  - parse() returns an ASTNode with a `type` and optional children
 *  - astToString() reconstructs the formula
 */
export const ASTParserAdapter: FormulaParser = {
parse(formula: string): ASTNode {
  return {
    type: 'call', // ✅ Valido secondo il tipo ASTNode
    formula,
    children: []
    };
  },
  astToString(ast: ASTNode): string {
    return (ast as any).formula;
  }
};
