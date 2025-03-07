import type { Decrypter } from '@/domain/cryptography/decrypter';
import type { UserToken } from '@/domain/models/user-token';
import type { UserTokenRepository } from '@/domain/repositories/user-token-repository';
import type { LoadUserByToken } from '@/domain/usecases/load-user-by-token';
import { inject, injectable } from 'tsyringe';

@injectable()
export class LoadUserByTokenUseCase implements LoadUserByToken {
  constructor(
    @inject('JwtAdapter')
    private decrypter: Decrypter,
    @inject('UserTokenRepository')
    private usersTokensRepository: UserTokenRepository,
  ) {}

  async execute(token: string): Promise<UserToken | null> {
    const decodedValue = await this.decrypter.decrypt(token);
    if (!decodedValue) {
      return null;
    }
    const user = await this.usersTokensRepository.findByToken(token);
    if (!user) {
      return null;
    }
    return user;
  }
}
