import type { AddUserUseCase } from '@/domain/usecases/add-user-usecase';
import type { AuthUseCase } from '@/domain/usecases/auth-usecase';
import { InvalidParamError, MissingParamError } from '@/utils/errors';
import { badRequest, ok, serverError } from '../helpers';
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  Validator,
} from '../protocols';
// nosso sistema -> signupController

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: Validator,
    private readonly addUserUseCase: AddUserUseCase,
    private readonly authenticationUseCase: AuthUseCase,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = httpRequest.body;
      if (!name) {
        return badRequest(new MissingParamError('name'));
      }
      if (!email) {
        return badRequest(new MissingParamError('email'));
      }
      if (!password) {
        return badRequest(new MissingParamError('password'));
      }

      const isEmailValid = this.emailValidator.isValid(email);

      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'));
      }

      await this.addUserUseCase.execute(httpRequest.body);
      const token = await this.authenticationUseCase.execute({
        email,
        password,
      });

      return ok({ token });
    } catch (error) {
      return serverError();
    }
  }
}
