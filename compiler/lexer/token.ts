export enum TokenType {
  IDENTIFIER,
  COLON,
  EQUALS,
  PLUS,
  PLUS_EQUALS,
  MINUS,
  MINUS_EQUALS,
  MULTIPLIES,
  MULTIPLIES_EQUALS,
  DEVIDED,
  DEVIDED_EQUALS,
  INTEGER_LITERAL,
  EQUALS_EQUALS,
  BANG,
  BANG_EQUALS,
  NUMBER,
  IF,
  ELSE,
  TRUE,
  FALSE,
  RETURN,
  FN,
  STRING,
  EOF,
}

export class Token {
  type: TokenType;
  lexeme: string;
  line: number;

  constructor(type: TokenType, lexeme: string = "", line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.line = line;
  }

  toString(): string {
    return TokenType[this.type] + " " + this.lexeme;
  }
}
