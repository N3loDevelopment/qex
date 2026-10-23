import { TokenType, Token } from "./token";

export class Scanner {
  source: string;
  tokens: Token[] = [];
  start: number = 0;
  current: number = 0;
  line: number = 1;
  error: boolean = false;

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

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.peek() != expected) return false;

    this.current++;
    return true;
  }

  private peek(): string {
    return this.source.charAt(this.current);
  }

  private peekNext(): string {
    let next = this.current + 1;
    if (next < this.source.length) return this.source.charAt(next);
    return "";
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    return this.source.charAt(this.current++);
  }

  private getCurrentChar(): string {
    return this.source.slice(this.start, this.current);
  }

  private addToken(type: TokenType, lexeme: string, line: number): void {
    this.tokens.push(new Token(type, lexeme, line));
  }

  public createError(type: TokenType, line: number): void {
    this.addToken(type, "", line);
    this.error = true;
  }

  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  private isAlpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private number(): void {
    while (this.isDigit(this.peek()) || (this.peek() == "." && this.isDigit(this.peekNext()))) this.advance();

    if (this.isAlpha(this.peek())) {
      this.createError(TokenType.InvalidIdentifier, this.line);
      return;
    }
    this.addToken(TokenType.NUMBER, this.getCurrentChar(), this.line);
  }

  private identifier(): void {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    let ident: string = this.source.substring(this.start, this.current);
    let type: TokenType = Scanner.keywords.get(ident) ?? TokenType.IDENTIFIER;
    this.addToken(type, this.getCurrentChar(), this.line);
  }

  private string(): void {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == "\n") this.line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      this.createError(TokenType.InvalidString, this.line);
      return;
    }

    this.advance();

    let startString: number = this.start + 1;
    let endString: number = this.current - 1;

    let string: string = this.source.substring(startString, endString);
    this.addToken(TokenType.STRING, string, this.line);
  }

  private invalidChar(): void {
    this.createError(TokenType.InvalidChar, this.line);
  }

  private scanToken(): void {
    let char = this.advance();

    // Whitespaces
    if (char === " " || char === "\t" || char === "\r") {
      return;
    }

    if (char === "\n") {
      this.line++;
      return;
    }

    // BinaryOperator
    if (char === "+") {
      this.addToken(this.match("=") ? TokenType.PLUS_EQUALS : TokenType.PLUS, this.getCurrentChar(), this.line);
      return;
    }

    if (char === "-") {
      this.addToken(this.match("=") ? TokenType.MINUS_EQUALS : TokenType.MINUS, this.getCurrentChar(), this.line);
      return;
    }

    if (char === "*") {
      this.addToken(
        this.match("=") ? TokenType.MULTIPLIES_EQUALS : TokenType.MULTIPLIES,
        this.getCurrentChar(),
        this.line,
      );
      return;
    }

    if (char === "/") {
      this.addToken(this.match("=") ? TokenType.DEVIDED_EQUALS : TokenType.DEVIDED, this.getCurrentChar(), this.line);
      return;
    }

    //CompareOperator
    if (char === "<") {
      this.addToken(this.match("=") ? TokenType.LowerEquals : TokenType.Lower, this.getCurrentChar(), this.line);
      return;
    }

    if (char === ">") {
      this.addToken(this.match("=") ? TokenType.BiggerEquals : TokenType.Bigger, this.getCurrentChar(), this.line);
      return;
    }

    //Brackets
    if (char === "(") {
      this.addToken(TokenType.LParen, this.getCurrentChar(), this.line);
      return;
    }

    if (char === ")") {
      this.addToken(TokenType.RParen, this.getCurrentChar(), this.line);
      return;
    }

    if (char === "{") {
      this.addToken(TokenType.LBrace, this.getCurrentChar(), this.line);
      return;
    }

    if (char === "}") {
      this.addToken(TokenType.RBrace, this.getCurrentChar(), this.line);
      return;
    }

    if (char === "[") {
      this.addToken(TokenType.LBracket, this.getCurrentChar(), this.line);
      return;
    }

    if (char === "]") {
      this.addToken(TokenType.RBracket, this.getCurrentChar(), this.line);
      return;
    }

    if (char === ";") {
      this.addToken(TokenType.Semi, this.getCurrentChar(), this.line);
      return;
    }

    if (char === ",") {
      this.addToken(TokenType.Comma, this.getCurrentChar(), this.line);
      return;
    }

    if (char === ":") {
      this.addToken(TokenType.Colon, this.getCurrentChar(), this.line);
      return;
    }

    if (char === ".") {
      let dotCounter: number = 1;
      while (this.peek() === ".") {
        this.advance();
        dotCounter++;
      }
      if (dotCounter === 1) {
        this.addToken(TokenType.Dot, this.getCurrentChar(), this.line);
      } else if (dotCounter === 3) {
        this.addToken(TokenType.TripleDot, this.getCurrentChar(), this.line);
      } else {
        this.createError(TokenType.PointerError, this.line);
        this.error = true;
      }
      return;
    }

    // AssignmentOperator
    if (char === "=") {
      this.addToken(this.match("=") ? TokenType.EQUALS_EQUALS : TokenType.EQUALS, this.getCurrentChar(), this.line);
      return;
    }

    if (char === "!") {
      this.addToken(this.match("=") ? TokenType.BANG_EQUALS : TokenType.BANG, this.getCurrentChar(), this.line);
      return;
    }

    // String
    if (char === '"') {
      this.string();
      return;
    }

    // Numbers and identifiers
    if (this.isDigit(char)) {
      this.number();
      return;
    }

    if (this.isAlpha(char)) {
      this.identifier();
      return;
    }

    // Invalid character
    this.invalidChar();
  }

  public scanTokens(): Token[] {
    while (!this.isAtEnd() && !this.error) {
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push(new Token(TokenType.EOF, "", this.line));
    return this.tokens;
  }
}
