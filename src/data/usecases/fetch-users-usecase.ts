import type { User } from '@/domain/models/user';
import type { UserRepository } from '@/domain/repositories/user-repository';
import type { FetchUsers } from '@/domain/usecases/fetch-users-usecase';

export class FetchUsersUseCase implements FetchUsers {
  constructor(private readonly usersRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    const users = await this.usersRepository.findAll();
    return users;
  }
}
