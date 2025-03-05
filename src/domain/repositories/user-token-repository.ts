import type { UserToken } from '../models/user-token';

export interface UserTokenRepository {
  create(userToken: UserToken): Promise<void>;
  findByToken(token: string): Promise<UserToken | null>;
  updateAccessToken(userId: string, token: string): Promise<void>;
}
