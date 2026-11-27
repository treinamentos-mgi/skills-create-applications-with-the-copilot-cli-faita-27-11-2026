const { spawnSync } = require('child_process');
const path = require('path');
const {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  power,
  squareRoot,
} = require('../calculator');

const cli = (...args) =>
  spawnSync('node', [path.join(__dirname, '..', 'calculator.js'), ...args], {
    encoding: 'utf8',
  });

describe('add', () => {
  test('2 + 3 = 5', () => expect(add(2, 3)).toBe(5));
  test('números negativos', () => expect(add(-2, -3)).toBe(-5));
  test('positivo + negativo', () => expect(add(5, -8)).toBe(-3));
  test('com zero', () => expect(add(7, 0)).toBe(7));
  test('decimais', () => expect(add(0.5, 0.25)).toBeCloseTo(0.75));
  test('0.1 + 0.2 com precisão de ponto flutuante', () =>
    expect(add(0.1, 0.2)).toBeCloseTo(0.3));
});

describe('subtract', () => {
  test('10 - 4 = 6', () => expect(subtract(10, 4)).toBe(6));
  test('resultado negativo', () => expect(subtract(4, 10)).toBe(-6));
  test('números negativos', () => expect(subtract(-5, -3)).toBe(-2));
  test('com zero', () => expect(subtract(7, 0)).toBe(7));
  test('decimais', () => expect(subtract(1.5, 0.5)).toBeCloseTo(1));
});

describe('multiply', () => {
  test('45 * 2 = 90', () => expect(multiply(45, 2)).toBe(90));
  test('por zero', () => expect(multiply(5, 0)).toBe(0));
  test('sinais opostos', () => expect(multiply(-3, 4)).toBe(-12));
  test('dois negativos', () => expect(multiply(-3, -4)).toBe(12));
  test('decimais', () => expect(multiply(0.5, 4)).toBeCloseTo(2));
});

describe('divide', () => {
  test('20 / 5 = 4', () => expect(divide(20, 5)).toBe(4));
  test('resultado decimal', () => expect(divide(1, 4)).toBe(0.25));
  test('sinais opostos', () => expect(divide(-10, 2)).toBe(-5));
  test('dois negativos', () => expect(divide(-10, -2)).toBe(5));
  test('zero dividido por número', () => expect(divide(0, 5)).toBe(0));
  test('divisão por zero lança erro', () =>
    expect(() => divide(10, 0)).toThrow('Divisão por zero'));
  test('zero dividido por zero lança erro', () =>
    expect(() => divide(0, 0)).toThrow('Divisão por zero'));
});

describe('modulo', () => {
  test('5 % 2 = 1', () => expect(modulo(5, 2)).toBe(1));
  test('divisão exata', () => expect(modulo(10, 5)).toBe(0));
  test('dividendo menor que divisor', () => expect(modulo(2, 5)).toBe(2));
  test('dividendo negativo', () => expect(modulo(-5, 3)).toBe(-2));
  test('divisor negativo', () => expect(modulo(5, -3)).toBe(2));
  test('decimais', () => expect(modulo(5.5, 2)).toBeCloseTo(1.5));
  test('zero módulo número', () => expect(modulo(0, 5)).toBe(0));
  test('módulo por zero lança erro', () =>
    expect(() => modulo(5, 0)).toThrow('Módulo por zero'));
});

describe('power', () => {
  test('2 ^ 3 = 8', () => expect(power(2, 3)).toBe(8));
  test('expoente zero', () => expect(power(5, 0)).toBe(1));
  test('expoente um', () => expect(power(7, 1)).toBe(7));
  test('base zero', () => expect(power(0, 5)).toBe(0));
  test('0 ^ 0 = 1', () => expect(power(0, 0)).toBe(1));
  test('base negativa, expoente ímpar', () => expect(power(-2, 3)).toBe(-8));
  test('base negativa, expoente par', () => expect(power(-2, 2)).toBe(4));
  test('expoente negativo', () => expect(power(2, -2)).toBe(0.25));
  test('expoente fracionário', () => expect(power(9, 0.5)).toBe(3));
});

describe('squareRoot', () => {
  test('√16 = 4', () => expect(squareRoot(16)).toBe(4));
  test('√0 = 0', () => expect(squareRoot(0)).toBe(0));
  test('√1 = 1', () => expect(squareRoot(1)).toBe(1));
  test('resultado irracional', () => expect(squareRoot(2)).toBeCloseTo(1.41421356));
  test('decimais', () => expect(squareRoot(0.25)).toBe(0.5));
  test('número negativo lança erro', () =>
    expect(() => squareRoot(-4)).toThrow('número negativo'));
  test('-1 lança erro', () =>
    expect(() => squareRoot(-1)).toThrow('número negativo'));
});

describe('CLI', () => {
  test.each([
    [['add', '2', '3'], '5'],
    [['subtract', '10', '4'], '6'],
    [['multiply', '45', '2'], '90'],
    [['divide', '20', '5'], '4'],
    [['modulo', '5', '2'], '1'],
    [['power', '2', '3'], '8'],
    [['sqrt', '16'], '4'],
  ])('%j -> %s', (args, expected) => {
    const r = cli(...args);
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe(expected);
  });

  test('divisão por zero retorna erro', () => {
    const r = cli('divide', '1', '0');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch('Divisão por zero');
  });

  test('operando não numérico', () => {
    const r = cli('add', 'a', '2');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch('números válidos');
  });

  test('operação inválida', () => {
    const r = cli('log', '2', '3');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch('Operação inválida');
  });

  test('argumentos ausentes', () => {
    const r = cli('add', '2');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch('Uso:');
  });

  test('modulo por zero retorna erro', () => {
    const r = cli('modulo', '5', '0');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch('Módulo por zero');
  });

  test('sqrt de número negativo retorna erro', () => {
    const r = cli('sqrt', '-4');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch('número negativo');
  });

  test('sqrt sem operando retorna erro de uso', () => {
    const r = cli('sqrt');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch('Uso:');
  });

  test('sqrt com operando não numérico', () => {
    const r = cli('sqrt', 'abc');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch('números válidos');
  });

  test('power sem segundo operando retorna erro de uso', () => {
    const r = cli('power', '2');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch('Uso:');
  });
});
