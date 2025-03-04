import type { Decrypter } from '@/domain/cryptography/decrypter';
import { LoadUserByTokenUseCase } from './load-user-by-token-usecase';

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('decoded_value'));
    }
  }

  return new DecrypterStub();
};

interface SutTypes {
  sut: LoadUserByTokenUseCase;
  decrypterStub: Decrypter;
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const sut = new LoadUserByTokenUseCase(decrypterStub);
  return {
    sut,
    decrypterStub,
  };
};

describe('LoadUserByToken UseCase', () => {
  test('should call Decrypter with correct token', async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = vi.spyOn(decrypterStub, 'decrypt');
    const token = 'any_token';
    await sut.execute(token);
    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });
  test('should return null if an invalid token is provided', async () => {
    const { sut, decrypterStub } = makeSut();
    vi.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(
      new Promise((resolve) => resolve(null!)),
    );
    const token = 'any_token';
    const response = await sut.execute(token);
    expect(response).toBeNull();
  });
});
