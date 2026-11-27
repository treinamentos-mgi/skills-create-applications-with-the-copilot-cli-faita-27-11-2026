#!/usr/bin/env node
/**
 * Calculadora CLI
 *
 * Operações suportadas:
 *   add       (adição)        a + b
 *   subtract  (subtração)     a - b
 *   multiply  (multiplicação) a * b
 *   divide    (divisão)       a / b  (divisão por zero gera erro)
 *   modulo    (resto)         a % b  (divisor zero gera erro)
 *   power     (potência)      a ** b
 *   sqrt      (raiz quadrada) √a
 *
 * Uso: node src/calculator.js <operação> <a> <b>
 *      node src/calculator.js sqrt <a>
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

function modulo(a, b) {
  if (b === 0) {
    throw new Error('Módulo por zero não é permitido.');
  }
  const result = a % b;
  if (Number.isNaN(result)) {
    throw new Error('Módulo não é um número válido.');
  }
  return result;
}

function exponentiation(a, b) {
  if (a === 0 && b < 0) {
    throw new Error('Zero não pode ser elevado a um expoente negativo.');
  }
  const result = a ** b;
  if (Number.isNaN(result)) {
    throw new Error('Potência não é um número real.');
  }
  return result;
}

function squareRoot(a) {
  if (a < 0) {
    throw new Error('Raiz quadrada de número negativo não é permitida.');
  }
  return Math.sqrt(a);
}

const operations = {
  add: addition,
  subtract: subtraction,
  multiply: multiplication,
  divide: division,
  modulo,
  power: exponentiation,
  sqrt: squareRoot,
};

function main(args) {
  const [op, rawA, rawB] = args;

  if (!op || rawA === undefined || (op !== 'sqrt' && rawB === undefined)) {
    throw new Error(
      `Uso: node calculator.js <${Object.keys(operations).join('|')}> <a> [b] (b é obrigatório, exceto para sqrt)`
    );
  }
  if (!Object.hasOwn(operations, op)) {
    throw new Error(
      `Operação inválida: "${op}". Use: ${Object.keys(operations).join(', ')}.`
    );
  }

  const a = Number(rawA);
  const b = rawB === undefined ? undefined : Number(rawB);
  if (rawA.trim() === '' || Number.isNaN(a) ||
      (rawB !== undefined && (rawB.trim() === '' || Number.isNaN(b)))) {
    throw new Error('Os operandos devem ser números válidos.');
  }

  return operations[op](a, b);
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
  modulo,
  exponentiation,
  squareRoot,
  add: addition,
  subtract: subtraction,
  multiply: multiplication,
  divide: division,
  power: exponentiation,
  sqrt: squareRoot,
};
