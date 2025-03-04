import type { User } from '@/domain/models/user';
import type { UserRepository } from '@/domain/repositories/user-repository';
import { prisma } from '@/infra';

export class UsersRepository implements UserRepository {
  async create(data: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }
  async loadByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user as User;
  }
  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users as User[];
  }
}
