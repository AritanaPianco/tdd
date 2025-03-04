import type { Decrypter } from '@/domain/cryptography/decrypter';
import type { User } from '@/domain/models/user';
import type { LoadUserByToken } from '@/domain/usecases/load-user-by-token';

export class LoadUserByTokenUseCase implements LoadUserByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async execute(token: string): Promise<User | null> {
    const decodedValue = await this.decrypter.decrypt(token);
    if (!decodedValue) {
      return null;
    }
  }
}
