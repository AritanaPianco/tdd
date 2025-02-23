import type { Encrypter } from '@/domain/cryptography/encrypter';
import type { HashComparer } from '@/domain/cryptography/hash-comparer';
import type { LoadUserByEmailRepository } from '@/domain/repositories/load-user-by-email-repository';
import type { AuthModel, AuthUseCase } from '@/domain/usecases/auth-usecase';
import { MissingParamError } from '@/utils/errors';

export class AuthenticationUseCae implements AuthUseCase {
  constructor(
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
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

    const isPasswordValid = await this.hashComparer.compare(
      authModel.password,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    await this.encrypter.encrypt(user.id);

    return new Promise((resolve) => resolve('any_token'));
  }
}
