import type { Encrypter } from '@/domain/cryptography/encrypter';
import type { Hash } from '@/domain/cryptography/hash';
import { User, type UserProps } from '@/domain/models/user';
import { UserToken } from '@/domain/models/user-token';
import type { UserRepository } from '@/domain/repositories/user-repository';
import type { UserTokenRepository } from '@/domain/repositories/user-token-repository';
import type { AddUser } from '@/domain/usecases/add-user-usecase';
import { conflictError } from '@/presentation/helpers';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AddUserUseCase implements AddUser {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UserRepository,
    @inject('BcryptAdapter')
    private hash: Hash,
    @inject('JwtAdapter')
    private encrypter: Encrypter,
    @inject('UsersTokenRepository')
    private usersTokenRepository: UserTokenRepository,
  ) {}

  async execute(user: UserProps): Promise<string | any> {
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
    const userToken = UserToken.create({ userId: newUser.id, token });
    await this.usersTokenRepository.create(userToken);
    return token;
  }
}
