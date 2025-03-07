import type { Encrypter } from '@/domain/cryptography/encrypter';
import type { HashComparer } from '@/domain/cryptography/hash-comparer';
import type { UserRepository } from '@/domain/repositories/user-repository';
import type { UserTokenRepository } from '@/domain/repositories/user-token-repository';
import type { Auth, AuthModel } from '@/domain/usecases/auth-usecase';
import { MissingParamError } from '@/presentation/errors';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthenticationUseCase implements Auth {
  constructor(
    @inject('UsersRepository')
    private userRepository: UserRepository,
    @inject('BcryptAdapter')
    private hashComparer: HashComparer,
    @inject('JwtAdapter')
    private encrypter: Encrypter,
    @inject('UsersTokenRepository')
    private userTokenRepository: UserTokenRepository,
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
    await this.userTokenRepository.updateAccessToken(user.id, token);
    return token;
  }
}
