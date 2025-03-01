import type { User, UserProps } from '@/domain/models/user';
import type { UserRepository } from '@/domain/repositories/user-repository';
import { prisma } from '@/infra';

export class UsersRepository implements UserRepository {
  async create(user: User): Promise<void> {}
  async loadByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user as User;
  }
}
