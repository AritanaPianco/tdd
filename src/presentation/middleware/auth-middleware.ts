import type { LoadUserByToken } from '@/domain/usecases/load-user-by-token';
import { AccessDeniedError } from '../errors';
import { forbiddenError, ok } from '../helpers';
import type { HttpRequest, HttpResponse, Middleware } from '../protocols';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadUserByToken: LoadUserByToken) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers['authorization'];
    if (!accessToken) {
      return forbiddenError(new AccessDeniedError());
    }
    const user = await this.loadUserByToken.execute(accessToken);
    if (!user) {
      return forbiddenError(new AccessDeniedError());
    }
    return ok({ userId: user?.id });
  }
}
