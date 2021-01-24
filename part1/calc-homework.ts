export {};
enum TokenTypes {
  INTEGER = "INTEGER",
  PLUS = "PLUS",
  EOF = "EOF",
}

console.log(TokenTypes);

class Token {
  type: TokenTypes;
  value: number | string | null;
  constructor(type: TokenTypes, value: number | string | null) {
    this.type = type;
    this.value = value;
  }
}

class Interpreter {
  text: string;
  pos: number;
  current_token: Token | null;
  constructor(text: string) {
    this.text = text;
    this.pos = 0;
    this.current_token = null;
  }

  isIntegerChar(char: string) {
    return char !== "" && Number.isInteger(Number(char));
  }
  // 处理空格（）
  handleSpace() {
    // 有两个办法
    // 1. 直接将输入的字符串正则替换，删除所有空格
    // 2. 在getNextToken时，碰到空格则跳过
    // 方法1不可取，后续可能会需要支持带空格的语法
  }
  getNextToken() {
    const text = this.text;
    // pos越界，说明读取字符串完毕，返回EOF表示结束
    if (this.pos > text.length - 1) {
      return new Token(TokenTypes.EOF, null);
    }
    let currentChar = text[this.pos];
    while (currentChar === " ") {
      this.pos++;
      currentChar = text[this.pos];
    }
    // pos越界，说明读取字符串完毕，返回EOF表示结束
    if (currentChar === undefined) {
      return new Token(TokenTypes.EOF, null);
    }
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
  eat(tokenType: TokenTypes) {
    if (this.current_token?.type === tokenType) {
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
const str = "  1  + 9 ";
console.log("公式： " + str);
const interpreter = new Interpreter(str);
console.log("计算结果：" + interpreter.expr());
