import { random } from 'lodash';
import { getBankAccount, InsufficientFundsError, SynchronizationFailedError, TransferFailedError } from '.';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

describe('BankAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create account with initial balance', () => {
    const initialBalance = 50;
    const accountData = getBankAccount(initialBalance);
    expect(accountData.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 50;
    const withdrawing = 100;
    const accountData = getBankAccount(initialBalance);
    expect(() => accountData.withdraw(withdrawing)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 50;
    const transferring = 100;
    const accountData = getBankAccount(initialBalance);
    const otherAccountData = getBankAccount(150);
    expect(() => accountData.transfer(transferring, otherAccountData)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 50;
    const transferring = 100;
    const accountData = getBankAccount(initialBalance);
    expect(() => accountData.transfer(transferring, accountData)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const initialBalance = 50;
    const deposit = 100;
    const accountData = getBankAccount(initialBalance);
    accountData.deposit(deposit);
    expect(accountData.getBalance()).toBe(initialBalance + deposit);
  });

  test('should withdraw money', () => {
    const initialBalance = 150;
    const withdraw = 100;
    const accountData = getBankAccount(initialBalance);
    accountData.withdraw(withdraw);
    expect(accountData.getBalance()).toBe(initialBalance - withdraw);
  });

  test('should transfer money', () => {
    const initialBalance = 150;
    const otherAccountInitialBalance = 250;
    const transferring = 50;
    const accountData = getBankAccount(initialBalance);
    const otherAccountData = getBankAccount(otherAccountInitialBalance);
    accountData.transfer(transferring, otherAccountData);
    expect(accountData.getBalance()).toBe(initialBalance - transferring);
    expect(otherAccountData.getBalance()).toBe(otherAccountInitialBalance + transferring);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const initialBalance = 150;
    const accountData = getBankAccount(initialBalance);
    jest.mocked(random).mockReturnValue(1);
    const balance = await accountData.getBalance();
    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initialBalance = 150;
    const accountData = getBankAccount(initialBalance);
    jest.spyOn(accountData, 'fetchBalance').mockResolvedValue(50);
    await accountData.synchronizeBalance();
    expect(accountData.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const initialBalance = 150;
    const accountData = getBankAccount(initialBalance);
    jest.spyOn(accountData, 'fetchBalance').mockResolvedValue(null);
    await expect(accountData.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
  });
});
