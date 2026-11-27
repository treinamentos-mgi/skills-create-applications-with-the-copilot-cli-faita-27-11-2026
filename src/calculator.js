#!/usr/bin/env node
/**
 * Calculadora CLI
 *
 * Operações suportadas:
 *   add       (adição)        a + b
 *   subtract  (subtração)     a - b
 *   multiply  (multiplicação) a * b
 *   divide    (divisão)       a / b  (divisão por zero gera erro)
 *   modulo    (módulo)        a % b  (módulo por zero gera erro)
 *   power     (potência)      a ** b
 *   sqrt      (raiz quadrada) √a     (número negativo gera erro)
 *
 * Uso: node src/calculator.js <operação> <a> <b>
 * Ex.: node src/calculator.js add 2 3   # 5
 */

// Adição
function addition(a, b) {
  return a + b;
}

// Subtração
function subtraction(a, b) {
  return a - b;
}

// Multiplicação
function multiplication(a, b) {
  return a * b;
}

// Divisão (lança erro se o divisor for zero)
function division(a, b) {
  if (b === 0) {
    throw new Error('Divisão por zero não é permitida.');
  }
  return a / b;
}

// Módulo (lança erro se o divisor for zero)
function modulo(a, b) {
  if (b === 0) {
    throw new Error('Módulo por zero não é permitido.');
  }
  return a % b;
}

// Potência
function power(base, exponent) {
  return base ** exponent;
}

// Raiz quadrada (lança erro para números negativos)
function squareRoot(n) {
  if (n < 0) {
    throw new Error('Raiz quadrada de número negativo não é permitida.');
  }
  return Math.sqrt(n);
}

const operations = {
  add: addition,
  subtract: subtraction,
  multiply: multiplication,
  divide: division,
  modulo,
  power,
  sqrt: squareRoot,
};

function main(args) {
  const [op, rawA, rawB] = args;

  const unary = op === 'sqrt';
  if (!op || rawA === undefined || (!unary && rawB === undefined)) {
    throw new Error(
      `Uso: node calculator.js <${Object.keys(operations).join('|')}> <a> [b]`
    );
  }
  if (!Object.hasOwn(operations, op)) {
    throw new Error(
      `Operação inválida: "${op}". Use: ${Object.keys(operations).join(', ')}.`
    );
  }

  const a = Number(rawA);
  const b = unary ? 0 : Number(rawB);
  if (
    rawA.trim() === '' ||
    (!unary && rawB.trim() === '') ||
    Number.isNaN(a) ||
    Number.isNaN(b)
  ) {
    throw new Error('Os operandos devem ser números válidos.');
  }

  return unary ? operations[op](a) : operations[op](a, b);
}

if (require.main === module) {
  try {
    console.log(main(process.argv.slice(2)));
  } catch (err) {
    console.error(`Erro: ${err.message}`);
    process.exit(1);
  }
}

module.exports = {
  addition,
  subtraction,
  multiplication,
  division,
  add: addition,
  subtract: subtraction,
  multiply: multiplication,
  divide: division,
  modulo,
  power,
  squareRoot,
};
