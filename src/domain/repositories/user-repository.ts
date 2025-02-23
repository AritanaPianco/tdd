import type { User } from '../models/user';

export interface UserRepository {
  loadByEmail(email: string): Promise<User | null>;
}
