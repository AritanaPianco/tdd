import type { User } from '@/domain/models/user';
import type { AddUserUseCase } from '@/domain/usecases/add-user-usecase';
import type { AuthModel, AuthUseCase } from '@/domain/usecases/auth-usecase';
import { InvalidParamError, MissingParamError } from '@/utils/errors';
import { ServerError } from '../errors';
import { badRequest, serverError } from '../helpers';
import type { Validator } from '../protocols';
import { SignUpController } from './signup-controller';

const makeEmailValidatorStub = (): Validator => {
  class EmailValidatorStub implements Validator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};
const makeAddUserUseCaseStub = (): AddUserUseCase => {
  class AddUserUseCaseStub implements AddUserUseCase {
    async execute(user: User): Promise<void> {}
  }

  return new AddUserUseCaseStub();
};
const makeAuthUseCase = (): AuthUseCase => {
  class AuthUseCaseStub implements AuthUseCase {
    async execute(authModel: AuthModel): Promise<string> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }
  return new AuthUseCaseStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: Validator;
  addUserUseCaseStub: AddUserUseCase;
  authenticationUseCaseStub: AuthUseCase;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const addUserUseCaseStub = makeAddUserUseCaseStub();
  const authenticationUseCaseStub = makeAuthUseCase();
  const sut = new SignUpController(
    emailValidatorStub,
    addUserUseCaseStub,
    authenticationUseCaseStub,
  );
  return {
    sut,
    emailValidatorStub,
    addUserUseCaseStub,
    authenticationUseCaseStub,
  };
};

const makeHttpRequest = () => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

describe('SignUpController', () => {
  test('should return 400 if no name is provided', async () => {
    // sut => system under test => nosso sistema é SignUpController
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(new MissingParamError('name'));
  });

  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
      },
    };
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError('email'));
  });
  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
      },
    };
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new MissingParamError('password'));
  });
  test('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeHttpRequest();
    const isValidSpy = vi.spyOn(emailValidatorStub, 'isValid');
    await sut.handle(makeHttpRequest());
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeHttpRequest();
    vi.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(new InvalidParamError('email'));
    expect(response).toEqual(badRequest(new InvalidParamError('email')));
  });
  test('should return 500 if httpRequest has no body', async () => {
    const { sut } = makeSut();
    const httpRequest = {};
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
    expect(response).toEqual(serverError());
  });

  test('should return 500 if emailValidator throws an error', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = makeHttpRequest();
    vi.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
    expect(response).toEqual(serverError());
  });
  test('should call AddUserUseCase with corrects values', async () => {
    const { sut, addUserUseCaseStub } = makeSut();
    const httpRequest = makeHttpRequest();
    const executeSpy = vi.spyOn(addUserUseCaseStub, 'execute');
    await sut.handle(httpRequest);
    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body);
  });
  test('should return 500 if AddUserUseCase throws an error', async () => {
    const { sut, addUserUseCaseStub } = makeSut();
    const httpRequest = makeHttpRequest();
    vi.spyOn(addUserUseCaseStub, 'execute').mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
    expect(response).toEqual(serverError());
  });
  test('should call AuthenticationUseCase with corrects values', async () => {
    const { sut, authenticationUseCaseStub } = makeSut();
    const httpRequest = makeHttpRequest();
    const executeSpy = vi.spyOn(authenticationUseCaseStub, 'execute');
    await sut.handle(httpRequest);
    const { email, password } = httpRequest.body;
    expect(executeSpy).toHaveBeenCalledWith({ email, password });
  });
  test('should return 500 if AuthenticationUseCase throws an error', async () => {
    const { sut, authenticationUseCaseStub } = makeSut();
    const httpRequest = makeHttpRequest();
    vi.spyOn(authenticationUseCaseStub, 'execute').mockImplementationOnce(
      () => {
        throw new Error();
      },
    );
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
    expect(response).toEqual(serverError());
  });
});
