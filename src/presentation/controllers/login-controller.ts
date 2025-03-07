import type { Auth } from '@/domain/usecases/auth-usecase';
import { inject, injectable } from 'tsyringe';
import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, ok, serverError, unauthorizedError } from '../helpers';
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  Validator,
} from '../protocols/';

@injectable()
export class LoginController implements Controller {
  constructor(
    @inject('AuthenticationUseCase')
    private authUseCase: Auth,
    @inject('EmailValidator')
    private emailValidator: Validator,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        return badRequest(new MissingParamError('email'));
      }
      if (!password) {
        return badRequest(new MissingParamError('password'));
      }

      const valid = this.emailValidator.isValid(email);
      if (!valid) {
        return badRequest(new InvalidParamError('email'));
      }

      const token = await this.authUseCase.execute(httpRequest.body);
      if (!token) {
        return unauthorizedError();
      }

      return ok({ token: token });
    } catch (error) {
      return serverError();
    }
  }
}
