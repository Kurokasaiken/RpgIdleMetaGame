// src/core/ASTParser.ts

/**
 * A minimal AST node for our formula parser.
 * 'type' must be one of these four strings.
 */
export interface ASTNode {
  type: 'identifier' | 'number' | 'call' | 'binary';
  name?: string;      // for identifiers
  value?: number;     // for numeric literals
  left?: ASTNode;     // for binary ops
  right?: ASTNode;    // for binary ops
  children?: ASTNode[]; 
  formula?: string;   // carry the raw text back around
}

/**
 * The contract for anything that can turn a string → ASTNode and back.
 */
export interface FormulaParser {
  parse(formula: string): ASTNode;
  astToString(ast: ASTNode): string;
}

/**
 * A “dummy” implementation that doesn’t actually build a full AST:
 * it just wraps the entire formula in one ASTNode, so DependencyGraph
 * can at least see `.formula` and crawl it if you want.
 */
export const ASTParser: FormulaParser = {
  parse(formula: string): ASTNode {
    return {
      type: 'call',
      formula,
      children: [],
    };
  },
  astToString(ast: ASTNode): string {
    return ast.formula ?? '';
  },
};
