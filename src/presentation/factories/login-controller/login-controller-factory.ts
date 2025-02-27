import { LoginController } from '@/presentation/controllers/login-controller';
import type { Controller } from '@/presentation/protocols';
import { EmailValidator } from '@/utils/email-validator';
import { makeAuthenticationUseCaseFactory } from '../usecases/authentication-usecase-factory';

export const makeLoginControllerFactory = (): Controller => {
  const authUseCase = makeAuthenticationUseCaseFactory();
  const emailValidator = new EmailValidator();
  return new LoginController(authUseCase, emailValidator);
};
