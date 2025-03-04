import type { Decrypter } from '@/domain/cryptography/decrypter';
import type { User } from '@/domain/models/user';
import type { UserToken } from '@/domain/models/user-token';
import type { UserTokenRepository } from '@/domain/repositories/user-token-repository';
import { LoadUserByTokenUseCase } from './load-user-by-token-usecase';

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('decoded_value'));
    }
  }

  return new DecrypterStub();
};

const makeUsersTokensRepository = (): UserTokenRepository => {
  class UsersTokensRepositoryStub implements UserTokenRepository {
    private usersToken: UserToken[] = [];

    async findByToken(token: string): Promise<UserToken> {
      const userToken = this.usersToken.filter(
        (userToken) => userToken.token === token,
      );
      return userToken[0];
    }

    async create(data: User, token: string): Promise<void> {}

    async updateAccessToken(userId: string, token: string): Promise<void> {}
  }
  return new UsersTokensRepositoryStub();
};

interface SutTypes {
  sut: LoadUserByTokenUseCase;
  decrypterStub: Decrypter;
  usersTokensRepositoryStub: UserTokenRepository;
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const usersTokensRepositoryStub = makeUsersTokensRepository();
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
});
