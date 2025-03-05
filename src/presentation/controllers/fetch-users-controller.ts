import type { FetchUsers } from '@/domain/usecases/fetch-users-usecase';
import { ok, serverError } from '../helpers';
import type { Controller, HttpRequest, HttpResponse } from '../protocols';

export class FetchUsersController implements Controller {
  constructor(private readonly findUsersUseCase: FetchUsers) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const response = await this.findUsersUseCase.execute();
      return ok({ users: response });
    } catch (error) {
      return serverError();
    }
  }
}
