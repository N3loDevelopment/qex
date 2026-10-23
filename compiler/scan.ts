import { Scanner } from "./lexer/scanner.ts";
import { readFileSync } from "node:fs";

function getFileInput(): string {
  return readFileSync("./index.qx", "utf-8");
}

let scanner = new Scanner(getFileInput());
const tokens = scanner.scanTokens();

setTimeout(() => {
  for (const token of tokens) {
    console.log(token.toString(), token.line);
  }
}, 500);
