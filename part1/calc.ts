enum TokenTypes {
  INTEGER = "INTEGER",
  PLUS = "PLUS",
  EOF = "EOF",
}

console.log(TokenTypes);

class Token {
  type: TokenTypes;
  value: number | string;
  constructor(type: TokenTypes, value: number | string) {
    this.type = type;
    this.value = value;
  }
}

class Interpreter {
  text: string;
  pos: number;
  current_token: Token;
  constructor(text: string) {
    this.text = text;
    this.pos = 0;
    this.current_token = null;
  }

  isIntegerChar(char) {
    return char !== "" && Number.isInteger(Number(char));
  }

  getNextToken() {
    const text = this.text;
    // pos越界，说明读取字符串完毕，返回EOF表示结束
    if (this.pos > text.length - 1) {
      return new Token(TokenTypes.EOF, null);
    }
    const currentChar = text[this.pos];
    if (this.isIntegerChar(currentChar)) {
      const token = new Token(TokenTypes.INTEGER, Number(currentChar));
      this.pos++;
      return token;
    }
    if (currentChar === "+") {
      const token = new Token(TokenTypes.PLUS, currentChar);
      this.pos++;
      return token;
    }
    throw new Error("无法生成相对应的token");
  }
  eat(tokenType) {
    if (this.current_token.type === tokenType) {
      this.current_token = this.getNextToken();
    } else {
      throw new Error("类型不匹配");
    }
  }
  expr() {
    this.current_token = this.getNextToken();
    const left = this.current_token;
    this.eat(TokenTypes.INTEGER);
    const op = this.current_token;
    this.eat(TokenTypes.PLUS);
    const right = this.current_token;
    this.eat(TokenTypes.INTEGER);
    const result = Number(left.value) + Number(right.value);
    return result;
  }
}

// 测试
const str = "1+9";
const interpreter = new Interpreter(str);
console.log("计算结果：" + interpreter.expr());
