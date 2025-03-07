import type { FetchUsers } from '@/domain/usecases/fetch-users-usecase';
import { inject, injectable } from 'tsyringe';
import { ok, serverError } from '../helpers';
import type { Controller, HttpRequest, HttpResponse } from '../protocols';

@injectable()
export class FetchUsersController implements Controller {
  constructor(
    @inject('FetchUsersUseCase')
    private findUsersUseCase: FetchUsers,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const response = await this.findUsersUseCase.execute();
      return ok({ users: response });
    } catch (error) {
      return serverError();
    }
  }
}
