import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

vi.mock('jsonwebtoken', () => {
  return {
    default: {
      sign: vi.fn(
        (userId: string, secret: string, options?: any) => 'any_token',
      ),
      verify: vi.fn((value: string, secret: string) => 'decoded_token'),
    },
  };
});

describe('JwtAdapter', () => {
  test('should call sign with correct value', async () => {
    const sut = new JwtAdapter();
    await sut.encrypt('any_id');
    const signSpy = vi.spyOn(jwt, 'sign');
    expect(signSpy).toHaveBeenCalledWith(
      { id: 'any_id' },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      },
    );
  });
  test('should return an accessToken on sign success', async () => {
    const sut = new JwtAdapter();
    const token = await sut.encrypt('any_id');
    expect(token).toBe('any_token');
  });
  test('should call verify with corrects values', async () => {
    const sut = new JwtAdapter();
    await sut.decrypt('any_token');
    const verifySpy = vi.spyOn(jwt, 'verify');
    expect(verifySpy).toHaveBeenCalledWith(
      'any_token',
      process.env.JWT_SECRET as string,
    );
  });
  test('should return an valid token on verify success', async () => {
    const sut = new JwtAdapter();
    const token = await sut.decrypt('any_token');
    expect(token).toBe('decoded_token');
  });
});
