export {};
enum TokenTypes {
  INTEGER = "INTEGER",
  MINUS = "MINUS",
  PLUS = "PLUS",
  MULTIP = "MULTIP",
  DIVISION = "DIVISION",
  EOF = "EOF",
}

console.log(TokenTypes);

class Token {
  type: TokenTypes;
  value: number | string | undefined;
  constructor(type: TokenTypes, value: number | string | undefined) {
    this.type = type;
    this.value = value;
  }
}

class Interpreter {
  text: string;
  pos: number;
  current_token: Token | undefined;
  current_char: string | undefined;

  constructor(text: string) {
    this.text = text;
    this.pos = 0;
    this.current_token = undefined;
    this.current_char = this.text[this.pos];
  }

  isIntegerChar(char: string | undefined) {
    return char !== "" && char !== undefined && Number.isInteger(Number(char));
  }
  isSpace(char: string | undefined) {
    return char === " ";
  }
  skipWhiteSpace() {
    while (
      this.current_char !== "" &&
      this.current_char !== undefined &&
      this.isSpace(this.current_char)
    ) {
      this.advance();
    }
  }
  advance() {
    this.pos++;
    if (this.pos > this.text.length - 1) {
      this.current_char = undefined;
    } else {
      this.current_char = this.text[this.pos];
    }
  }
  // 获取当前位置的数字，可能是多位的
  getNumber() {
    let result = "";
    while (
      this.current_char !== "" &&
      this.current_char !== undefined &&
      Number.isInteger(Number(this.current_char))
    ) {
      result += this.current_char;
      this.advance();
    }
    return Number(result);
  }
  getNextToken() {
    while (this.current_char !== "" && this.current_char !== undefined) {
      if (this.isSpace(this.current_char)) {
        this.skipWhiteSpace();
        continue;
      }
      if (this.isIntegerChar(this.current_char)) {
        return new Token(TokenTypes.INTEGER, this.getNumber());
      }
      switch (this.current_char) {
        case "+":
          this.advance();
          return new Token(TokenTypes.PLUS, "+");
        case "-":
          this.advance();
          return new Token(TokenTypes.MINUS, "-");
        case "*":
          this.advance();
          return new Token(TokenTypes.MULTIP, "*");
        case "/":
          this.advance();
          return new Token(TokenTypes.DIVISION, "/");
        default:
      }
      throw new Error("无法生成相对应的token");
    }
  }
  eat(tokenType: TokenTypes) {
    if (this.current_token?.type === tokenType) {
      this.current_token = this.getNextToken();
    } else {
      throw new Error("类型不匹配");
    }
  }
  expr() {
    this.current_token = this.getNextToken();
    const left: any = this.current_token;
    this.eat(TokenTypes.INTEGER);
    const op = this.current_token;
    switch (op?.type) {
      case TokenTypes.PLUS:
        this.eat(TokenTypes.PLUS);
        break;
      case TokenTypes.MINUS:
        this.eat(TokenTypes.MINUS);
        break;
      case TokenTypes.MULTIP:
        this.eat(TokenTypes.MULTIP);
        break;
      case TokenTypes.DIVISION:
        this.eat(TokenTypes.DIVISION);
        break;

      default:
        break;
    }

    const right: any = this.current_token;
    this.eat(TokenTypes.INTEGER);
    let result;

    // if (op?.type === TokenTypes.PLUS) {
    //   result = Number(left.value) + Number(right.value);
    // } else {
    //   result = Number(left.value) - Number(right.value);
    // }
    switch (op?.type) {
      case TokenTypes.PLUS:
        result = Number(left.value) + Number(right.value);
        break;
      case TokenTypes.MINUS:
        result = Number(left.value) - Number(right.value);
        break;
      case TokenTypes.MULTIP:
        result = Number(left.value) * Number(right.value);
        break;
      case TokenTypes.DIVISION:
        result = Number(left.value) / Number(right.value);
        break;
      default:
        break;
    }
    return result;
  }
}

// 测试
const str = "100-9";
const interpreter = new Interpreter(str);
console.log("计算结果：" + interpreter.expr());
