import type { UserToken } from '../models/user-token';

export interface UserTokenRepository {
  updateAccessToken(userId: string, token: string): Promise<UserToken>;
}
