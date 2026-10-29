import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Scanner } from "./lexer/scanner.ts";
import { Parser } from "./parser/parser.ts";
import { BinaryExpr, LiteralExpr } from "./parser/ast.ts";
import { TokenType } from "./lexer/token.ts";

const source = readFileSync(resolve(process.cwd(), "index.qx"), "utf-8");

console.log("Source:", JSON.stringify(source));

const scanner = new Scanner(source);
const tokens = scanner.scanTokens();

console.log(
  "Tokens:",
  tokens.map((token) => ({
    type: TokenType[token.type],
    lexeme: token.lexeme,
    line: token.line,
  })),
);

const parser = new Parser(tokens);
const expression = parser.parseExpression();

console.assert(expression instanceof BinaryExpr, "Expected a BinaryExpr");

if (expression instanceof BinaryExpr) {
  console.assert(expression.left instanceof LiteralExpr, "Expected left operand to be a LiteralExpr");

  console.assert(expression.operator.lexeme === "+", "Expected operator to be +");

  console.assert(expression.right instanceof LiteralExpr, "Expected right operand to be a LiteralExpr");

  if (expression.left instanceof LiteralExpr) {
    console.assert(expression.left.token.lexeme === "42", "Expected left operand to be 42");
  }

  if (expression.right instanceof LiteralExpr) {
    console.assert(expression.right.token.lexeme === "20", "Expected right operand to be 20");
  }
}

console.assert(parser.peekToken().type === TokenType.EOF, "Expected EOF after parsing the expression");

console.log("Parser test completed!");
