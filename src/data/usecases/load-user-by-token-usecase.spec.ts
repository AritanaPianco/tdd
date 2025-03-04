import type { Decrypter } from '@/domain/cryptography/decrypter';
import { LoadUserByTokenUseCase } from './load-user-by-token-usecase';

describe('LoadUserByToken UseCase', () => {
  test('should call Decrypter with correct token', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve('decoded_value'));
      }
    }
    const decrypterStub = new DecrypterStub();
    const decryptSpy = vi.spyOn(decrypterStub, 'decrypt');
    const sut = new LoadUserByTokenUseCase(decrypterStub);
    const token = 'any_token';
    await sut.execute(token);
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });
  test('should return null if an invalid token is provided', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt(value: string): Promise<string> {
        return new Promise((resolve) => resolve('decoded_value'));
      }
    }
    const decrypterStub = new DecrypterStub();
    vi.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(
      new Promise((resolve) => resolve(null!)),
    );
    const sut = new LoadUserByTokenUseCase(decrypterStub);
    const token = 'any_token';
    const response = await sut.execute(token);
    expect(response).toBeNull();
  });
});
