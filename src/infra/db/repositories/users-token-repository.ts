import type { UserTokenRepository } from '@/domain/repositories/user-token-repository';
import { prisma } from '@/infra';

export class UsersTokenRepository implements UserTokenRepository {
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
