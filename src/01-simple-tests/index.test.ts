import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const res = simpleCalculator({a: 1, b: 2, action: Action.Add});
    expect(res).toEqual(3);
  });

  test('should subtract two numbers', () => {
    const res = simpleCalculator({a: 3, b: 2, action: Action.Subtract});
    expect(res).toEqual(1);
  });

  test('should multiply two numbers', () => {
    const res = simpleCalculator({a: 3, b: 2, action: Action.Multiply});
    expect(res).toEqual(6);
  });

  test('should divide two numbers', () => {
    const res = simpleCalculator({a: 4, b: 2, action: Action.Divide});
    expect(res).toEqual(2);
  });

  test('should exponentiate two numbers', () => {
    const res = simpleCalculator({a: 3, b: 2, action: Action.Exponentiate});
    expect(res).toEqual(9);
  });

  test('should return null for invalid action', () => {
    const res = simpleCalculator({a: 3, b: 2, action: 'wrongAction'});
    expect(res).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const res = simpleCalculator({a: '3', b: null, action: Action.Subtract});
    expect(res).toBeNull();
  });
});
