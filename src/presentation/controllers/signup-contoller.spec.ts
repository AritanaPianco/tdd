import type { User } from '@/domain/models/user';
import type { AddUser } from '@/domain/usecases/add-user-usecase';
import { InvalidParamError, MissingParamError } from '../errors';
import { ServerError } from '../errors';
import { badRequest, ok, serverError } from '../helpers';
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
const makeAddUserUseCaseStub = (): AddUser => {
  class AddUserUseCaseStub implements AddUser {
    async execute(user: User): Promise<string | any> {
      return new Promise((resolve) => resolve('any_token'));
    }
  }

  return new AddUserUseCaseStub();
};

type SutTypes = {
  sut: SignUpController;
  emailValidatorStub: Validator;
  addUserUseCaseStub: AddUser;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const addUserUseCaseStub = makeAddUserUseCaseStub();
  const sut = new SignUpController(emailValidatorStub, addUserUseCaseStub);
  return {
    sut,
    emailValidatorStub,
    addUserUseCaseStub,
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
  test('should return an accessToken on signUp success', async () => {
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ token: 'any_token' });
    expect(response).toEqual(ok({ token: 'any_token' }));
  });
});
