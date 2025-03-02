import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

vi.mock('bcrypt', () => {
  return {
    default: {
      compare: vi.fn(async (value: string, hash: string) => true),
      hash: vi.fn(async (value: string, salt: number) => 'hashed_password'),
    },
  };
});

describe('Bcrypt Adapter', () => {
  test('should call compare with corrects values', async () => {
    const sut = new BcryptAdapter();
    const valuesToCompare = {
      password: 'any_password',
      hash: 'hashed_password',
    };
    const compareSpy = vi.spyOn(bcrypt, 'compare');
    await sut.compare(valuesToCompare.password, valuesToCompare.hash);
    expect(compareSpy).toHaveBeenCalledWith(
      valuesToCompare.password,
      valuesToCompare.hash,
    );
  });
  test('should return false if an invalid password is provided', async () => {
    const sut = new BcryptAdapter();
    const valuesToCompare = {
      password: 'invalid_password',
      hash: 'hashed_password',
    };

    vi.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      return new Promise((resolve) => resolve(false));
    });
    const result = await sut.compare(
      valuesToCompare.password,
      valuesToCompare.hash,
    );
    expect(result).toBe(false);
  });
  test('should return true if a valid password is provided', async () => {
    const sut = new BcryptAdapter();
    const valuesToCompare = {
      password: 'any_password',
      hash: 'hashed_password',
    };
    const result = await sut.compare(
      valuesToCompare.password,
      valuesToCompare.hash,
    );
    expect(result).toBe(true);
  });
  test('should call hash with corrects values', async () => {
    const sut = new BcryptAdapter();
    const values = {
      password: 'any_password',
      salt: 8,
    };
    const hashSpy = vi.spyOn(bcrypt, 'hash');
    await sut.hash(values.password, values.salt);
    expect(hashSpy).toHaveBeenCalledWith(values.password, values.salt);
  });
  test('should return a hashed password on hash success', async () => {
    const sut = new BcryptAdapter();
    const values = {
      password: 'any_password',
      salt: 8,
    };
    const hash = await sut.hash(values.password, values.salt);
    expect(hash).toBe('hashed_password');
  });
});
