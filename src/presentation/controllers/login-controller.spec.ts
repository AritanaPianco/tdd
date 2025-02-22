import type { AuthModel, AuthUseCase } from '@/domain/usecases/auth-usecase';
import { MissingParamError, ServerError } from '../errors';
import { badRequest, serverError, unauthorizedError } from '../helpers/';
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
  authUseCaseStub: AuthUseCase;
}

const makeSut = (): SutTypes => {
  const authUseCaseStub = makeAuthUseCase();
  const sut = new LoginController(authUseCaseStub);
  return {
    sut,
    authUseCaseStub,
  };
};

describe('Login Router', () => {
  test('should return 400  if no email is provided', async () => {
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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
    const { sut } = makeSut();
    const httpRequest = {};
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError());
    expect(httpResponse.statusCode).toBe(500);
  });
  test('should call AuthUseCase with corrects values', async () => {
    const { sut, authUseCaseStub } = makeSut();
    const executeSpy = vi.spyOn(authUseCaseStub, 'execute');
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
      },
    };
    await sut.handle(httpRequest);
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test('should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseStub } = makeSut();
    vi.spyOn(authUseCaseStub, 'execute').mockReturnValueOnce(null!);
    const httpRequest = {
      body: {
        email: 'invalid_email',
        password: 'invalid_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse).toEqual(unauthorizedError());
  });
  test('should return 500 if no AuthUseCase is provived', async () => {
    const sut = new LoginController({} as AuthUseCase);
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
    expect(httpResponse).toEqual(serverError());
  });
});
