import { MissingParamError } from '../errors';
import { badRequest } from '../helpers';
import type { Controller } from '../protocols/controller';
import type { HttpRequest } from '../protocols/http-request';
import type { HttpResponse } from '../protocols/http-response';

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
