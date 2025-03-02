import { SignUpController } from '@/presentation/controllers/signup-controller';
import type { Controller } from '@/presentation/protocols';
import { EmailValidator } from '@/utils/email-validator';
import { makeAddUserUseCaseFactory } from '../usecases/add-user-usecase-factory';
import { makeAuthenticationUseCaseFactory } from '../usecases/authentication-usecase-factory';

export const makeSignUpControllerFactory = (): Controller => {
  const emailValidator = new EmailValidator();
  return new SignUpController(
    emailValidator,
    makeAddUserUseCaseFactory(),
    makeAuthenticationUseCaseFactory(),
  );
};
