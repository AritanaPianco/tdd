import type { Encrypter } from '@/domain/cryptography/encrypter';
import type { HashComparer } from '@/domain/cryptography/hash-comparer';
import type { UserRepository } from '@/domain/repositories/user-repository';
import type { AuthModel, AuthUseCase } from '@/domain/usecases/auth-usecase';
import { MissingParamError } from '@/utils/errors';

export class AuthenticationUseCae implements AuthUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute(authModel: AuthModel): Promise<string | null> {
    if (!authModel.email || !authModel.password) {
      throw new MissingParamError('any_field');
    }

    const user = await this.userRepository.loadByEmail(authModel.email);
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

    const token = await this.encrypter.encrypt(user.id);
    return token;
  }
}
