import { MissingParamError } from '../errors';
import { badRequest } from '../helpers';
import type { Controller, HttpRequest, HttpResponse } from '../protocols/';

export class LoginController implements Controller {
  private response: HttpResponse = {
    statusCode: 0,
    body: '',
  };

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body;
    if (!email) {
      this.response = badRequest(new MissingParamError('email'));
    }
    return this.response;
  }
}
