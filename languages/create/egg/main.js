const stringStr = "string";
const digitStr = "digit";
const wordStr = "word";

const regexps = {
  string: /^"([^"]*)"/,
  digit: /^\d+\b/,
  word: /^[^\s(),#"]+/
};
const regexpsKeys = Object.keys(regexps);
const regexpsValues = Object.values(regexps);
const regexpsNum = regexpsKeys.length;

const specialForms = Object.create(null);
const topScope = Object.create(null);
topScope.true = true;
topScope.false = false;

["+", "-", "*", "/", "===", "<", ">"].forEach(op => {
  topScope[op] = Function("a, b", `return a ${op} b;`);
});

topScope.print = value => {
  console.log(value);
  return value;
};

// It trims leading spaces inside a string.
function skipSpace(string) {
  const first = string.search(/\S/);
  if (first === -1) return "";
  return string.slice(first);
}

function parseExpression(program) {
  program = skipSpace(program);

  let match;
  let expr;
  let exprType;

  for (let index = 0; index < regexpsNum; index += 1) {
    const regexp = regexpsValues[index];
    const regexpType = regexpsKeys[index];
    match = regexp.exec(program);
    if (
      match !== null &&
      ((regexpType === stringStr && match[1].length > 0) ||
        ((regexpType === digitStr || regexpType === wordStr) &&
          match[0].length > 0))
    ) {
      exprType = regexpType;
      break;
    }
  }

  if (exprType === stringStr) {
    // #region String Regexp
    /*
    RegExp explanation:
    ^ : matching the beginning of a string
    " : matches a " character
    () : groups multiple tokens (e.g. *hahaha*h *ha*a *ha*h)
    [^] : negated set, matches any character that's not in the set
    [^"] : matches any character that is not a "
    [^"]* : matches 0 or more of the preceding token
    " : matches a " character
    ---
    It matches the beginning of the string for a " character,
    then it matches (0+ of) any no-" characters,
    then it matches a (closing) " character.
    So it matches a double-quoted string with content which does not contain
    any double quote.
    It matches only the first match and it doesn't match any subsequent
    matches.
    */
    // #endregion String Regexp

    expr = { type: "value", value: match[1] };
  } else if (exprType === digitStr) {
    // #region Digit Regexp
    /*
    RegExp explanation:
    ^ : matching the beginning of a string
    \d : matches any digit character
    \d+ : match 1 or more of the preceding token
    \b : matches a word boundary position between a word character and
    non-word character or position (e.g. she sell*s* seashell*s*)
    ---
    It matches any didgit character(s), which is alone, e.g. a match: *123*
    123, not a match: 123a 123. It matches only the first match and it
    doesn't match any subsequent match.
    */
    // #endregion Digit Regexp

    expr = { type: "value", value: Number(match[0]) };
  } else if (exprType === wordStr) {
    // #region Word Regexp
    /*
    RegExp explanation:
    ^ : matching the beginning of a string
    [^] : negated set, matches any character that's not in the set
    [^\s(), #"] : matches any character that's not a whitespace \s or a ( or
    a ) or a , or a #
    + : matches 1 or more of the preceding token
    ---
    It matches words (these are not strings, i.e. no content inside
    double-quotes, but just plain words, i.e. a match: haha, not a match:
    "haha").
    */
    // #endregion Word Regexp

    expr = { type: wordStr, name: match[0] };
  } else {
    throw new SyntaxError(`Unexpected syntax: ${program}`);
  }

  return parseApply(expr, program.slice(match[0].length));
}

function parseApply(expr, program) {
  program = skipSpace(program);

  if (program[0] !== "(") {
    return { expr, rest: program };
  }

  program = skipSpace(program.slice(1));
  expr = { type: "apply", operator: expr, args: [] };

  while (program[0] !== ")") {
    const arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);

    if (program[0] === ",") {
      program = skipSpace(program.slice(1));
    } else if (program[0] !== ")") {
      throw new SyntaxError("Expected ',' or ')'");
    }
  }

  return parseApply(expr, program.slice(1));
}

function parse(program) {
  const { expr, rest } = parseExpression(program);

  if (skipSpace(rest).length > 0) {
    throw new SyntaxError("Unexpected text after program");
  }

  return expr;
}

function evaluate(expr, scope) {
  let returnValue;

  if (expr.type === "value") {
    returnValue = expr.value;
  } else if (expr.type === wordStr) {
    if (expr.name in scope) {
      returnValue = scope[expr.name]; // Fetch the binded value.
    } else {
      throw new ReferenceError(`Undefined binding: ${expr.name}`);
    }
  } else if (expr.type === "apply") {
    const { operator, args } = expr;

    if (operator.type === wordStr && operator.name in specialForms) {
      returnValue = specialForms[operator.name](expr.args, scope);
      // calls a fat arrow function
    } else {
      const op = evaluate(operator, scope);

      if (typeof op === "function") {
        returnValue = op(...args.map(arg => evaluate(arg, scope)));
      } else {
        throw new TypeError("Applying a non-function.");
      }
    }
  }
  return returnValue;
}

// #region SPECIAL FORMS

// This is similar to JS's ternary ?: operator.
specialForms.if = (args, scope) => {
  if (args.length !== 3) {
    throw new SyntaxError("Wrong number of args to if");
  } else if (evaluate(args[0], scope) !== false) {
    return evaluate(args[1], scope);
  } else {
    return evaluate(args[2], scope);
  }
};

specialForms.while = (args, scope) => {
  if (args.length !== 2) {
    throw new SyntaxError("Wrong number of args to while");
  }
  while (evaluate(args[0], scope) !== false) {
    evaluate(args[1], scope);
  }
  return false;
  // undefined does not exist, and returns false for lack of meaningful
  // result...
};

specialForms.do = (args, scope) => {
  let value = false;
  args.forEach(arg => {
    value = evaluate(arg, scope);
  });
  return value;
};

specialForms.define = (args, scope) => {
  if (args.length !== 2 || args[0].type !== wordStr) {
    throw new SyntaxError("Incorrect use of define");
  }
  const value = evaluate(args[1], scope);
  scope[args[0].name] = value;
  return value;
};

specialForms.fun = (args, scope) => {
  // console.log(arguments);
  console.log(args);
  console.log(args.length);
  if (!args.length) {
    throw new SyntaxError("Functions need a body");
  }

  const body = args[args.length - 1];

  const params = args.slice(0, args.length - 1).map(expr => {
    if (expr.type !== "word") {
      throw new SyntaxError("Parameter names must be words");
    }
    return expr.name;
  });

  return function() {
    console.log(arguments);
    console.log(params);
    if (arguments.length !== params.length) {
      throw new TypeError("Wrong number of arguments");
    }
    const localScope = Object.create(scope);
    for (let i = 0; i < arguments.length; i += 1) {
      localScope[params[i]] = arguments[i];
    }
    return evaluate(body, localScope);
  };
};

// #endregion SPECIAL FORMS

function run(program) {
  return evaluate(parse(program), Object.create(topScope));
}

run(`
do(
  define(total, 0),
  define(count, 1),
  while(<(count, 11),
    do(
      define( total, +(total, count) ),
      define( count, +(count, 1) )
    )
  ),
  print(total)
)
`);

run(`
do(define(plusOne, fun(a, b, +(a, b))),
   print(plusOne(10, 12)))
`);
