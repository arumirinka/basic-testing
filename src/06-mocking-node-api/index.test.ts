import path from "node:path";
import { doStuffByInterval, doStuffByTimeout, readFileAsynchronously } from "./index";
import { existsSync } from "fs";
import { readFile } from "fs/promises";

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const spy = jest.spyOn(global, 'setTimeout');
    const cb = jest.fn();
    const timeout = 3000;

    doStuffByTimeout(cb, timeout);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(cb, timeout);
  });

  test('should call callback only after timeout', () => {
    const cb = jest.fn();
    const timeout = 3000;

    doStuffByTimeout(cb, timeout);

    expect(cb).toHaveBeenCalledTimes(0);
    jest.runAllTimers();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const spy = jest.spyOn(global, 'setInterval');
    const cb = jest.fn();
    const timeout = 3000;

    doStuffByInterval(cb, timeout);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(cb, timeout);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const cb = jest.fn();
    const timeout = 3000;
    const count = 5;

    doStuffByInterval(cb, timeout);

    expect(cb).toHaveBeenCalledTimes(0);

    for (let i = 0; i < count; i += 1) {
      jest.runOnlyPendingTimers();
      expect(cb).toHaveBeenCalledTimes(i + 1);
    }
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const spy = jest.spyOn(path, 'join');
    const filePath = 'test/readme.md';
    await readFileAsynchronously(filePath);

    expect(spy).toHaveBeenCalledWith(__dirname, filePath);
  });

  test('should return null if file does not exist', async () => {
    const filePath = 'test/readme.md';
    jest.mocked(existsSync).mockReturnValue(false);
    const res = await readFileAsynchronously(filePath);
    expect(res).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const filePath = 'test/readme.md';
    const fileContent = 'test content';
    jest.mocked(existsSync).mockReturnValue(true);
    jest.mocked(readFile).mockResolvedValue(fileContent);
    const res = await readFileAsynchronously(filePath);
    expect(res).toBe(fileContent);
  });
});
