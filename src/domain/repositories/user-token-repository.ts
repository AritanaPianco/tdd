import type { User } from '../models/user';
import type { UserToken } from '../models/user-token';

export interface UserTokenRepository {
  create(user: User, token: string): Promise<void>;
  findByToken(token: string): Promise<UserToken | null>;
  updateAccessToken(userId: string, token: string): Promise<void>;
}
