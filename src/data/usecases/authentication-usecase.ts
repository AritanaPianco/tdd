import type { AuthModel, AuthUseCase } from '@/domain/usecases/auth-usecase';
import { MissingParamError } from '@/utils/errors';

export class AuthenticationUseCae implements AuthUseCase {
  async execute(authModel: AuthModel): Promise<string | null> {
    if (!authModel.email || !authModel.password) {
      throw new MissingParamError('any_field');
    }

    return new Promise((resolve) => resolve('any_token'));
  }
}
