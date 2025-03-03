import type { User } from '../models/user';

export interface LoadUserByToken {
  execute(token: string): Promise<User | null>;
}
