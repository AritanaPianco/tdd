import type { UserToken } from '../models/user-token';

export interface LoadUserByToken {
  execute(token: string): Promise<UserToken | null>;
}
