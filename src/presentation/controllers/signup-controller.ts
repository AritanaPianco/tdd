import { InvalidParamError, MissingParamError } from '@/utils/errors';
import { badRequest, serverError } from '../helpers';
import type {
  Controller,
  HttpRequest,
  HttpResponse,
  Validator,
} from '../protocols';
// nosso sistema -> signupController

export class SignUpController implements Controller {
  private response: HttpResponse = {
    statusCode: 0,
    body: '',
  };

  constructor(private readonly emailValidator: Validator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = httpRequest.body;
      if (!name) {
        this.response = badRequest(new MissingParamError('name'));
      }
      if (!email) {
        this.response = badRequest(new MissingParamError('email'));
      }
      if (!password) {
        this.response = badRequest(new MissingParamError('password'));
      }

      const isEmailValid = this.emailValidator.isValid(email);

      if (!isEmailValid) {
        this.response = badRequest(new InvalidParamError('email'));
      }

      return this.response;
    } catch (error) {
      return serverError();
    }
  }
}
