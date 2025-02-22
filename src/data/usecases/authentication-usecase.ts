import type { LoadUserByEmailRepository } from '@/domain/repositories/load-user-by-email-repository';
import type { AuthModel, AuthUseCase } from '@/domain/usecases/auth-usecase';
import { MissingParamError } from '@/utils/errors';

export class AuthenticationUseCae implements AuthUseCase {
  constructor(
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
  ) {}

  async execute(authModel: AuthModel): Promise<string | null> {
    if (!authModel.email || !authModel.password) {
      throw new MissingParamError('any_field');
    }

    const user = await this.loadUserByEmailRepository.loadByEmail(
      authModel.email,
    );
    if (!user) {
      return null;
    }
    return new Promise((resolve) => resolve('any_token'));
  }
}
