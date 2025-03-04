import type { Decrypter } from '@/domain/cryptography/decrypter';
import type { User } from '@/domain/models/user';
import type { UserTokenRepository } from '@/domain/repositories/user-token-repository';
import type { LoadUserByToken } from '@/domain/usecases/load-user-by-token';

export class LoadUserByTokenUseCase implements LoadUserByToken {
  constructor(
    private readonly decrypter: Decrypter,
    private readonly usersTokensRepository: UserTokenRepository,
  ) {}

  async execute(token: string): Promise<User | null> {
    const decodedValue = await this.decrypter.decrypt(token);
    if (!decodedValue) {
      return null;
    }
    const user = await this.usersTokensRepository.findByToken(token);
    if (!user) {
      return null;
    }
  }
}
