import type { Encrypter } from '@/domain/cryptography/encrypter';
import type { Hash } from '@/domain/cryptography/hash';
import { User, type UserProps } from '@/domain/models/user';
import type { UserRepository } from '@/domain/repositories/user-repository';
import type { UserTokenRepository } from '@/domain/repositories/user-token-repository';
import type { AddUserUseCase } from '@/domain/usecases/add-user-usecase';
import { conflictError } from '@/presentation/helpers';

export class AddUser implements AddUserUseCase {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly hash: Hash,
    private readonly encrypter: Encrypter,
    private readonly usersTokenRepository: UserTokenRepository,
  ) {}

  async execute(user: UserProps): Promise<any> {
    const userFound = await this.usersRepository.loadByEmail(user.email);
    if (userFound) {
      return conflictError('email');
    }

    const hashedPassword = await this.hash.hash(user.password, 8);
    const newUser = User.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });

    await this.usersRepository.create(newUser);
    const token = await this.encrypter.encrypt(newUser.id);
    await this.usersTokenRepository.create(newUser, token);
  }
}
