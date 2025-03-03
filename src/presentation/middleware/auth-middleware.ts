import type { LoadUserByToken } from '@/domain/usecases/load-user-by-token';
import { AccessDeniedError } from '../errors';
import { forbiddenError } from '../helpers';
import type { HttpRequest, HttpResponse, Middleware } from '../protocols';

export class AuthMiddleware implements Middleware {
  private reponse: HttpResponse = {
    statusCode: 0,
    body: undefined,
  };

  //   constructor(private readonly loadUserByToken: LoadUserByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers['authorization'];
    if (!accessToken) {
      this.reponse = forbiddenError(new AccessDeniedError());
    }
    // await this.loadUserByToken.execute(accessToken);
    return this.reponse;
  }
}
