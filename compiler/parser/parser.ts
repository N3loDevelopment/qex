import { Token, TokenType } from "../lexer/token.ts";
import { BinaryExpr, Expr, LiteralExpr } from "./ast.ts";

enum ParserError {
  TokenTypeMismatch,
  UnknowError,
}

export class Parser {
  tokens: Token[];
  current: number = 0;
  error: boolean = false;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  getAllTokens(): Token[] {
    return this.tokens;
  }

  isAtEnd(): boolean {
    return this.current >= this.tokens.length || this.compareToken(TokenType.EOF);
  }

  advanceToken(): Token {
    return this.tokens[this.current++];
  }

  peekToken(): Token {
    return this.tokens[this.current];
  }

  peekNext(): Token {
    let next: number = this.current + 1;
    return this.tokens[next];
  }

  compareToken(comp: TokenType): boolean {
    return this.peekToken().type == comp;
  }

  errorHandler(parseError: ParserError, tokenType: TokenType, lexeme: string): never {
    this.error = true;

    if (parseError === ParserError.TokenTypeMismatch) {
      throw new Error(`Line ${this.peekToken().line}: Expected ${tokenType}, but got ${lexeme}`);
    }

    throw new Error(`Line ${this.peekToken().line}: Parsing error`);
  }

  consume(tokenType: TokenType): Token {
    if (!this.compareToken(tokenType)) {
      this.errorHandler(ParserError.TokenTypeMismatch, tokenType, this.peekToken().lexeme);
    }

    return this.advanceToken();
  }

  parseExpression(): Expr {
    let currentToken: Token = this.peekToken();

    let currentToken: Token = this.peekToken();
    this.consume(currentToken.type);
    if (currentToken.type === TokenType.NUMBER) {
      if (this.peekToken().type === TokenType.PLUS) {
        let nextToken = this.peekToken();
        return new BinaryExpr(new LiteralExpr(currentToken), nextToken, new LiteralExpr(this.peekNext()));
      }
    }
    return this.errorHandler(ParserError.TokenTypeMismatch, currentToken.type, currentToken.lexeme);
  }
}
