import type { User } from '@/domain/models/user';
import type { UserRepository } from '@/domain/repositories/user-repository';
import type { FetchUsers } from '@/domain/usecases/fetch-users-usecase';
import { inject, injectable } from 'tsyringe';

@injectable()
export class FetchUsersUseCase implements FetchUsers {
  constructor(
    @inject('UsersRepository')
    private usersRepository: UserRepository,
  ) {}

  async execute(): Promise<User[]> {
    const users = await this.usersRepository.findAll();
    return users;
  }
}
