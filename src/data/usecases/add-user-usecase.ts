import type { Hash } from '@/domain/cryptography/hash';
import { User, type UserProps } from '@/domain/models/user';
import type { AddUserUseCase } from '@/domain/usecases/add-user-usecase';

export class AddUser implements AddUserUseCase {
  constructor(private readonly hash: Hash) {}

  async execute(user: UserProps): Promise<void> {
    const hashedPassword = await this.hash.hash(user.password, 8);
    const newUser = User.create({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });
    return hashedPassword;
  }
}
