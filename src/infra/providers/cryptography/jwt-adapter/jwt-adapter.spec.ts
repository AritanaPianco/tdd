import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

vi.mock('jsonwebtoken', () => {
  return {
    default: {
      sign: vi.fn(
        (userId: string, secret: string, options?: any) => 'any_token',
      ),
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
});
