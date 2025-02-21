import { MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers';
import type { Controller, HttpRequest, HttpResponse } from '../protocols/';

export class LoginController implements Controller {
  private response: HttpResponse = {
    statusCode: 0,
    body: '',
  };

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;
      if (!email) {
        this.response = badRequest(new MissingParamError('email'));
      }
      if (!password) {
        this.response = badRequest(new MissingParamError('password'));
      }

      if (!httpRequest.body) {
        this.response = serverError();
      }
      return this.response;
    } catch (error) {
      return serverError();
    }
  }
}
