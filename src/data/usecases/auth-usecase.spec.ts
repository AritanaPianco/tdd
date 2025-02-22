import type { AuthModel, AuthUseCase } from '@/domain/usecases/auth-usecase';

const makeSut = (): AuthUseCase => {
  class AuthUseCaseStub implements AuthUseCase {
    async execute(authModel: AuthModel): Promise<string | null> {
      if (!authModel.email || !authModel.password) {
        throw new Error();
      }

      return new Promise((resolve) => resolve('any_token'));
    }
  }
  return new AuthUseCaseStub();
};

describe('Auth UseCase', () => {
  test('should throw if no email is provided', async () => {
    const sut = makeSut();
    const authModel = {
      password: 'any_password',
    };
    const promise = sut.execute(authModel as AuthModel);
    await expect(promise).rejects.toThrow();
  });
  test('should throw if no password is provided', async () => {
    const sut = makeSut();
    const authModel = {
      email: 'any_email@mail.com',
    };
    const promise = sut.execute(authModel as AuthModel);
    await expect(promise).rejects.toThrow();
  });
});
