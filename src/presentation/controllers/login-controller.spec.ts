import type { AuthModel, AuthUseCase } from '@/domain/usecases/auth-usecase';
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { badRequest, ok, serverError, unauthorizedError } from '../helpers/';
import type { HttpRequest, Validator } from '../protocols';
import { LoginController } from './login-controller';

const makeAuthUseCase = (): AuthUseCase => {
  class AuthUseCaseStub implements AuthUseCase {
    async execute(authModel: AuthModel): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }
  return new AuthUseCaseStub();
};

const makeEmailValidator = (): Validator => {
  class EmailValidatorStub implements Validator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_@email.com',
    password: 'any_password',
  },
});

interface SutTypes {
  sut: LoginController;
  authUseCaseStub: AuthUseCase;
  emailValidatorStub: Validator;
}

const makeSut = (): SutTypes => {
  const authUseCaseStub = makeAuthUseCase();
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(authUseCaseStub, emailValidatorStub);
  return {
    sut,
    authUseCaseStub,
    emailValidatorStub,
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
        email: 'any_@email.com',
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
    const httpRequest = makeHttpRequest();
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
    const emailValidator = makeEmailValidator();
    const sut = new LoginController({} as AuthUseCase, emailValidator);
    const httpResponse = await sut.handle(makeHttpRequest());
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
    expect(httpResponse).toEqual(serverError());
  });
  test('should return 500 if  AuthUseCase throws', async () => {
    const { sut, authUseCaseStub } = makeSut();
    vi.spyOn(authUseCaseStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeHttpRequest());
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
    expect(httpResponse).toEqual(serverError());
  });
  test('should return 400  if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    vi.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        email: 'invalid_email',
        password: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
    expect(httpResponse.statusCode).toBe(400);
  });
  test('should return 500 if no EmailValidator is provived', async () => {
    const authUseCase = makeAuthUseCase();
    const sut = new LoginController(authUseCase, {} as Validator);
    const httpResponse = await sut.handle(makeHttpRequest());
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
    expect(httpResponse).toEqual(serverError());
  });
  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    vi.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeHttpRequest());
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
    expect(httpResponse).toEqual(serverError());
  });
  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = vi.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = makeHttpRequest();
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test('should return 200 when valid credentials is provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeHttpRequest());
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse).toEqual(ok('any_token'));
  });
});
