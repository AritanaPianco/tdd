import type { AddUser } from '@/domain/usecases/add-user-usecase';
import { inject, injectable } from 'tsyringe';
import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, conflictError, ok, serverError } from '../helpers';
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  Validator,
} from '../protocols';

@injectable()
export class SignUpController implements Controller {
  constructor(
    @inject('EmailValidator')
    private emailValidator: Validator,
    @inject('AddUserUseCase')
    private addUserUseCase: AddUser,
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

      const result = await this.addUserUseCase.execute(httpRequest.body);
      if (result.statusCode === 409) {
        return conflictError('email');
      }
      return ok({ token: result });
    } catch (error) {
      return serverError();
    }
  }
}
