import type { AuthModel, AuthUseCase } from '@/domain/usecases/auth-usecase';
import { MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/';
import { LoginController } from './login-controller';

const makeAuthUseCase = (): AuthUseCase => {
  class AuthUseCaseStub implements AuthUseCase {
    async execute(authModel: AuthModel): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }
  return new AuthUseCaseStub();
};

interface SutTypes {
  sut: LoginController;
}

const makeSut = (): SutTypes => {
  const authUseCaseStub = makeAuthUseCase();
  const sut = new LoginController();
  return {
    sut,
  };
};

describe('Login Router', () => {
  test('should return 400  if no email is provided', async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        password: 'any_passowrd',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
    expect(httpResponse.statusCode).toBe(400);
  });
  test('should return 400  if no password is provided', async () => {
    const sut = new LoginController();
    const httpRequest = {
      body: {
        email: 'any_email',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
    expect(httpResponse.statusCode).toBe(400);
  });
  test('should return 500 if httpRequest has no body', async () => {
    const sut = new LoginController();
    const httpRequest = {};
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError());
    expect(httpResponse.statusCode).toBe(500);
  });
});
