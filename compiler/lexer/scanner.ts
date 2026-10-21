import { TokenType, Token } from "./token";

export class Scanner {
  source: string;
  tokens: Token[] = [];
  start: number = 0;
  current: number = 0;
  line: number = 1;

  constructor(source: string) {
    this.source = source;
  }

  private static readonly keywords: Map<string, TokenType> = new Map([
    ["fn", TokenType.FN],
    ["if", TokenType.IF],
    ["else", TokenType.ELSE],
    ["return", TokenType.RETURN],
    ["true", TokenType.TRUE],
    ["false", TokenType.FALSE],
  ]);

  match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.peek() != expected) return false;

    this.current++;
    return true;
  }

  peek(): string {
    return this.source.charAt(this.current);
  }

  peekNext(): string {
    let next = this.current + 1;
    if (next < this.source.length) return this.source.charAt(next);
    return "";
  }

  isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  advance(): string {
    return this.source.charAt(this.current++);
  }

  getCurrentChar(): string {
    return this.source.slice(this.start, this.current);
  }

  addToken(type: TokenType, lexeme: string, line: number): void {
    this.tokens.push(new Token(type, lexeme, line));
  }

  isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  isAlpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
  }

  isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  number(): void {
    while (
      this.isDigit(this.peek()) ||
      (this.peek() == "." && this.isDigit(this.peekNext()))
    ) {
      this.advance();
    }
    this.addToken(TokenType.NUMBER, this.getCurrentChar(), this.line);
  }

  identifier(): void {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    let ident: string = this.source.substring(this.start, this.current);
    let type: TokenType = Scanner.keywords.get(ident) ?? TokenType.IDENTIFIER;
    if (type != null) type = TokenType.IDENTIFIER;
    this.addToken(type, this.getCurrentChar(), this.line);
  }

  scanToken(): void {
    let char = this.advance();

    switch (char) {
      //Whitespaces
      case " ":
        break;
      case "\t":
        break;
      case "\r":
        break;

      case "\n":
        this.line++;
        break;

      //BinaryOperator
      case "+":
        this.addToken(
          this.match("=") ? TokenType.PLUS_EQUALS : TokenType.PLUS,
          this.getCurrentChar(),
          this.line,
        );
        break;
      case "-":
        this.addToken(
          this.match("=") ? TokenType.MINUS_EQUALS : TokenType.MINUS,
          this.getCurrentChar(),
          this.line,
        );
        break;
      case "*":
        this.addToken(
          this.match("=") ? TokenType.MULTIPLIES_EQUALS : TokenType.MULTIPLIES,
          this.getCurrentChar(),
          this.line,
        );
        break;
      case "/":
        this.addToken(
          this.match("=") ? TokenType.DEVIDED_EQUALS : TokenType.DEVIDED,
          this.getCurrentChar(),
          this.line,
        );
        break;

      //AssignmentOperator
      case "=":
        this.addToken(
          this.match("=") ? TokenType.EQUALS_EQUALS : TokenType.EQUALS,
          this.getCurrentChar(),
          this.line,
        );
        break;
      case "!":
        this.addToken(
          this.match("=") ? TokenType.BANG_EQUALS : TokenType.BANG,
          this.getCurrentChar(),
          this.line,
        );
        break;

      default:
        if (this.isDigit(char)) {
          this.number();
        } else if (this.isAlpha(char)) {
          this.identifier();
        }
    }
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push(new Token(TokenType.EOF, "", this.line));
    return this.tokens;
  }
}
