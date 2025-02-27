import type { UserProps } from '@/domain/models/user';
import type { UserRepository } from '@/domain/repositories/user-repository';
import { prisma } from '@/infra';

export class UsersRepository implements UserRepository {
  async loadByEmail(email: string): Promise<UserProps | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
}
