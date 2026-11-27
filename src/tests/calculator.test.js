const { spawnSync } = require('child_process');
const path = require('path');
const { add, subtract, multiply, divide, modulo, power, sqrt, exponentiation, squareRoot } = require('../calculator');

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
  test('resto da divisão', () => expect(modulo(10, 3)).toBe(1));
  test('dividendo negativo', () => expect(modulo(-10, 3)).toBe(-1));
  test('divisor zero lança erro', () =>
    expect(() => modulo(10, 0)).toThrow('Módulo por zero'));
  test('dividendo infinito lança erro', () =>
    expect(() => modulo(Infinity, 3)).toThrow('número válido'));
});

describe('power', () => {
  test('potência inteira', () => expect(power(2, 3)).toBe(8));
  test('expoente negativo', () => expect(power(2, -2)).toBe(0.25));
  test('base negativa e expoente inteiro', () => expect(power(-2, 3)).toBe(-8));
  test('zero elevado a expoente negativo lança erro', () =>
    expect(() => power(0, -1)).toThrow('expoente negativo'));
  test('base negativa e expoente fracionário lança erro', () =>
    expect(() => power(-2, 0.5)).toThrow('número real'));
  test('exporta o nome completo', () => expect(exponentiation).toBe(power));
});

describe('sqrt', () => {
  test('raiz quadrada', () => expect(sqrt(9)).toBe(3));
  test('raiz de zero', () => expect(sqrt(0)).toBe(0));
  test('raiz de número negativo lança erro', () =>
    expect(() => sqrt(-1)).toThrow('número negativo'));
  test('exporta o nome completo', () => expect(squareRoot).toBe(sqrt));
});

describe('CLI', () => {
  test.each([
    [['add', '2', '3'], '5'],
    [['subtract', '10', '4'], '6'],
    [['multiply', '45', '2'], '90'],
    [['divide', '20', '5'], '4'],
    [['modulo', '10', '3'], '1'],
    [['power', '2', '3'], '8'],
    [['sqrt', '9'], '3'],
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
    const r = cli('invalid', '2', '3');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch('Operação inválida');
  });

  test('argumentos ausentes', () => {
    const r = cli('add', '2');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch('Uso:');
  });

  test.each([
    [['modulo', '1', '0'], 'Módulo por zero'],
    [['modulo', 'Infinity', '3'], 'número válido'],
    [['power', '0', '-1'], 'expoente negativo'],
    [['power', '-2', '0.5'], 'número real'],
    [['sqrt', '-1'], 'número negativo'],
    [['sqrt', 'abc'], 'números válidos'],
    [['sqrt', '9', 'abc'], 'números válidos'],
    [['power', '2'], 'Uso:'],
    [['sqrt'], 'Uso:'],
  ])('%j retorna erro', (args, expected) => {
    const r = cli(...args);
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(expected);
  });
});
