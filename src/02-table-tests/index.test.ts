import {  simpleCalculator, Action } from './index';

const testCases = [
    { a: 1, b: 2, action: Action.Add, expected: 3 },
    { a: 2, b: 1, action: Action.Subtract, expected: 1 },
    { a: 3, b: 2, action: Action.Multiply, expected: 6 },
    { a: 4, b: 2, action: Action.Divide, expected: 2 },
    { a: 4, b: 2, action: Action.Exponentiate, expected: 16 },
];

describe('simpleCalculator', () => {
  testCases.forEach(({ a, b, action, expected }) => {
    test(`should return ${expected} for ${action} of ${a} and ${b}`, () => {
      expect(simpleCalculator({ a, b, action})).toBe(expected);
    })
  });
});
