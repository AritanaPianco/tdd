import type { User } from '@/domain/models/user';
import type { UserRepository } from '@/domain/repositories/user-repository';

export class UsersRepositoryInMemory implements UserRepository {
  private users: User[] = [];

  async loadByEmail(email: string): Promise<User | null> {
    const user = this.users.filter((user) => user.email === email);

    if (!user[0]) {
      return null;
    }

    return user[0];
  }
  async create(data: User): Promise<void> {
    this.users.push(data);
  }
  async findAll(): Promise<User[]> {
    return this.users;
  }
}
