import type { User } from '@/domain/models/user';
import type { UserToken } from '@/domain/models/user-token';
import type { UserTokenRepository } from '@/domain/repositories/user-token-repository';
import { prisma } from '@/infra';

export class UsersTokenRepository implements UserTokenRepository {
  async create(user: User, token: string): Promise<void> {
    await prisma.userToken.create({
      data: {
        userId: user.id,
        token: token,
      },
    });
  }
  async findByToken(token: string): Promise<UserToken | null> {
    const userToken = await prisma.userToken.findFirst({
      where: {
        token,
      },
    });

    if (!userToken) {
      return null;
    }
    return userToken as UserToken;
  }
  async updateAccessToken(userId: string, token: string): Promise<void> {
    await prisma.userToken.update({
      where: {
        userId,
      },
      data: {
        token: token,
      },
    });
  }
}
