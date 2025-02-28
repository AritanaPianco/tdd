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

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: Validator;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};

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
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };
    const isValidSpy = vi.spyOn(emailValidatorStub, 'isValid');
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });
  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
      },
    };
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
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    };
    vi.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const response = await sut.handle(httpRequest);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(new ServerError());
    expect(response).toEqual(serverError());
  });
});
