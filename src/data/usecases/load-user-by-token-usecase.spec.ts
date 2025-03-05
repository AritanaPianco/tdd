import type { Decrypter } from '@/domain/cryptography/decrypter';
import type { UserToken } from '@/domain/models/user-token';
import type { UserTokenRepository } from '@/domain/repositories/user-token-repository';
import { UsersTokenRepositoryInMemory } from '@/test/repositories-in-memory/users-token-repository-in-memory';
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
  usersTokensRepositoryStub: UserTokenRepository;
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const usersTokensRepositoryStub = new UsersTokenRepositoryInMemory();
  const sut = new LoadUserByTokenUseCase(
    decrypterStub,
    usersTokensRepositoryStub,
  );
  return {
    sut,
    decrypterStub,
    usersTokensRepositoryStub,
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
  test('should call usersTokenRepository with correct token', async () => {
    const { sut, usersTokensRepositoryStub } = makeSut();
    const findByTokenSpy = vi.spyOn(usersTokensRepositoryStub, 'findByToken');
    const token = 'any_token';
    await sut.execute(token);
    expect(findByTokenSpy).toHaveBeenCalledWith('any_token');
  });
  test('should returns null if usersTokenRepository returns null', async () => {
    const { sut, usersTokensRepositoryStub } = makeSut();
    vi.spyOn(usersTokensRepositoryStub, 'findByToken').mockReturnValueOnce(
      new Promise((resolve) => resolve(null)),
    );
    const user = await sut.execute('any_token');
    expect(user).toBeNull();
  });

  test('should return an userId on success', async () => {
    const { sut, usersTokensRepositoryStub } = makeSut();
    const token = 'any_token';
    const userToken = {
      id: 'any_id',
      userId: 'any_userId',
      token: 'any_token',
    } as UserToken;
    await usersTokensRepositoryStub.create(userToken);
    const response = await sut.execute(token);
    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('userId');
    expect(response).toHaveProperty('token');
  });
});
