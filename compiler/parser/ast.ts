import { Token } from "../lexer/token.ts";

export abstract class Expr {}

export class LiteralExpr extends Expr {
  token: Token;

  constructor(token: Token) {
    super();
    this.token = token;
  }
}

export class BinaryExpr extends Expr {
  left: Expr;
  operator: Token;
  right: Expr;

  constructor(left: Expr, operator: Token, right: Expr) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }
}
