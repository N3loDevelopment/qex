import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Scanner } from "./lexer/scanner.ts";
import { Parser } from "./parser/parser.ts";
import { LiteralExpr } from "./parser/ast.ts";
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

console.assert(expression instanceof LiteralExpr, "Expected a LiteralExpr");

if (expression instanceof LiteralExpr) {
  console.assert(expression.token.lexeme === "42", "Expected literal value 42");
}

console.assert(parser.peekToken().type === TokenType.EOF, "Expected EOF after parsing the expression");

console.log("Parser test passed!");
console.log(expression);
