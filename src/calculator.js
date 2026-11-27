#!/usr/bin/env node
/**
 * Calculadora CLI
 *
 * Operações suportadas:
 *   add       (adição)        a + b
 *   subtract  (subtração)     a - b
 *   multiply  (multiplicação) a * b
 *   divide    (divisão)       a / b  (divisão por zero gera erro)
 *
 * Uso: node src/calculator.js <operação> <a> <b>
 * Ex.: node src/calculator.js add 2 3   # 5
 */

// Adição
function add(a, b) {
  return a + b;
}

// Subtração
function subtract(a, b) {
  return a - b;
}

// Multiplicação
function multiply(a, b) {
  return a * b;
}

// Divisão (lança erro se o divisor for zero)
function divide(a, b) {
  if (b === 0) {
    throw new Error('Divisão por zero não é permitida.');
  }
  return a / b;
}

const operations = { add, subtract, multiply, divide };

function main(args) {
  const [op, rawA, rawB] = args;

  if (!op || rawA === undefined || rawB === undefined) {
    throw new Error(
      `Uso: node calculator.js <${Object.keys(operations).join('|')}> <a> <b>`
    );
  }
  if (!Object.hasOwn(operations, op)) {
    throw new Error(
      `Operação inválida: "${op}". Use: ${Object.keys(operations).join(', ')}.`
    );
  }

  const a = Number(rawA);
  const b = Number(rawB);
  if (rawA.trim() === '' || rawB.trim() === '' || Number.isNaN(a) || Number.isNaN(b)) {
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

module.exports = { add, subtract, multiply, divide };
