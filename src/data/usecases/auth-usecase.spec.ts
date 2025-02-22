import type { AuthModel, AuthUseCase } from '@/domain/usecases/auth-usecase';
import { MissingParamError } from '@/utils/errors';
import { AuthenticationUseCae } from './authentication-usecase';

const makeSut = (): AuthUseCase => {
  return new AuthenticationUseCae();
};

describe('Auth UseCase', () => {
  test('should throw if no email is provided', async () => {
    const sut = makeSut();
    const authModel = {
      password: 'any_password',
    };
    const promise = sut.execute(authModel as AuthModel);
    await expect(promise).rejects.toThrow(new MissingParamError('any_field'));
  });
  test('should throw if no password is provided', async () => {
    const sut = makeSut();
    const authModel = {
      email: 'any_email@mail.com',
    };
    const promise = sut.execute(authModel as AuthModel);
    await expect(promise).rejects.toThrow(new MissingParamError('any_field'));
  });
});
