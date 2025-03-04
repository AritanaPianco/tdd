import type { LoadUserByToken } from '@/domain/usecases/load-user-by-token';
import { AccessDeniedError } from '../errors';
import { forbiddenError, ok } from '../helpers';
import type { HttpRequest, HttpResponse, Middleware } from '../protocols';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadUserByToken: LoadUserByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.headers['authorization']) {
      return forbiddenError(new AccessDeniedError());
    }
    const accessToken = httpRequest.headers['authorization'];
    const token = accessToken.split(' ')[1];
    const user = await this.loadUserByToken.execute(token);
    if (!user) {
      return forbiddenError(new AccessDeniedError());
    }
    return ok({ userId: user.userId });
  }
}
