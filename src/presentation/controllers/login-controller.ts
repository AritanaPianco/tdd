import type { AuthUseCase } from '@/domain/usecases/auth-usecase';
import { MissingParamError } from '../errors';
import { badRequest, serverError, unauthorizedError } from '../helpers';
import type { Controller, HttpRequest, HttpResponse } from '../protocols/';

export class LoginController implements Controller {
  private response: HttpResponse = {
    statusCode: 0,
    body: '',
  };

  constructor(private readonly authUseCase: AuthUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        this.response = badRequest(new MissingParamError('email'));
      }
      if (!password) {
        this.response = badRequest(new MissingParamError('password'));
      }

      const token = await this.authUseCase.execute(httpRequest.body);
      if (!token) {
        return unauthorizedError();
      }

      return this.response;
    } catch (error) {
      return serverError();
    }
  }
}
